// validationLibrary.js

import type {
  CssSolution,
  ValidationResult,
  ValidationItem,
} from "../types/validation";

export function isElementRotated(
  element: HTMLDivElement,
  contentWindow: Window
): boolean {
  const style = contentWindow.getComputedStyle(element);
  const transform = style.transform;

  // If there's no transform property, it's not rotated
  if (transform === "none" || !transform) {
    return false;
  }
  // Extracting the rotation matrix values
  const values = transform.split("(")[1].split(")")[0].split(",").map(Number);

  // Calculating the angle of rotation in degrees
  // using arctan(y/x) and converting radians to degrees
  const angle = Math.atan2(values[1], values[0]) * (180 / Math.PI);

  // If the angle is not 0, the element is rotated
  return angle !== 0;
}

export function isUsingBoxModel(
  element: HTMLDivElement,
  contentWindow: Window
): boolean {
  let style = contentWindow.getComputedStyle(element);
  let valid =
    (!style.position || style.position === "static") &&
    (!style.display || style.display.includes("block"));
  if (!valid) {
    return false;
  } else {
    return true;
  }
}

export function validateSpaceBetweenElementsLR(
  element1: HTMLDivElement,
  element2: HTMLDivElement,
  minSpace: number
): boolean {
  let rect1 = element1.getBoundingClientRect();
  let rect2 = element2.getBoundingClientRect();
  return rect2.left - rect1.right >= minSpace;
}
export function validateSpaceBetweenElementsTB(
  element1: HTMLDivElement,
  element2: HTMLDivElement,
  minSpace: number
): boolean {
  let rect1 = element1.getBoundingClientRect();
  let rect2 = element2.getBoundingClientRect();
  if (rect1.top > rect2.top) {
    [rect2, rect1] = [rect1, rect2];
  }
  console.log("measured", rect2.top - rect1.bottom, "space");
  return rect2.top - rect1.bottom >= minSpace;
}

export function validateElementSize(
  element: HTMLDivElement,
  expectedWidth: number,
  expectedHeight: number,
  threshold: number = 5
): boolean {
  let rect = element.getBoundingClientRect();
  return (
    Math.abs(rect.width - expectedWidth) <= threshold &&
    Math.abs(rect.height - expectedHeight) <= threshold
  );
}

export function hasVisibleBorder(element: HTMLElement): {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  all: boolean;
} {
  const computedStyle = getComputedStyle(element);

  const hasWidth = (side: string) =>
    parseInt(computedStyle[`border${side}Width`], 10) > 0;
  const hasColor = (side: string) =>
    computedStyle[`border${side}Color`] !== "transparent" &&
    computedStyle[`border${side}Color`] !== "rgba(0, 0, 0, 0)";
  const hasStyle = (side: string) =>
    computedStyle[`border${side}Style`] !== "none";

  const top = hasWidth("Top") && hasColor("Top") && hasStyle("Top");
  const right = hasWidth("Right") && hasColor("Right") && hasStyle("Right");
  const bottom = hasWidth("Bottom") && hasColor("Bottom") && hasStyle("Bottom");
  const left = hasWidth("Left") && hasColor("Left") && hasStyle("Left");

  return {
    top,
    right,
    bottom,
    left,
    all: top && right && bottom && left,
  };
}

export function calculateOffsets(element1: HTMLElement, element2: HTMLElement) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return {
    left: rect2.left - rect1.left,
    top: rect2.top - rect1.top,
    right: rect1.right - rect2.right,
    bottom: rect1.bottom - rect2.bottom,
  };
}

export function validateHorizontalAlignment(
  elements: NodeListOf<Element>,
  contentWindow: Window
): boolean {
  const firstElementTop = elements[0].getBoundingClientRect().top;

  elements.forEach((element, index) => {
    const elementTop = element.getBoundingClientRect().top;
    if (Math.abs(elementTop - firstElementTop) > 1) {
      // Allowing 1px tolerance
      return false;
    }
  });

  return true;
}

export function doElementsOverlap(
  element1: HTMLElement,
  element2: HTMLElement
): boolean {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  // IF NOT
  return !(
    (
      rect1.right < rect2.left || // rect1 is to the left of rect2
      rect1.left > rect2.right || // rect1 is to the right of rect2
      rect1.bottom < rect2.top || // rect1 is above rect2
      rect1.top > rect2.bottom
    ) // rect1 is below rect2
  );
}

export class PropertyChecker {
  private contentWindow: Window;

  private static iframe: HTMLIFrameElement | null = null;

  private getIframe(): HTMLIFrameElement {
    if (!PropertyChecker.iframe) {
      PropertyChecker.iframe = document.createElement("iframe");
      PropertyChecker.iframe.style.display = "none";
      document.body.appendChild(PropertyChecker.iframe);
    }
    return PropertyChecker.iframe;
  }

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  checkCSSProperty(
    element: HTMLElement,
    property: string,
    expectedCss: string | null,
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const iframe = this.getIframe();
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) {
      throw new Error("Unable to access iframe's document");
    }

    // Clone the element into the iframe and apply the CSS to check
    const elementClone = iframeDoc.importNode(element, true);
    elementClone.style.cssText = `${property}: ${expectedCss};`;
    iframeDoc.body.appendChild(elementClone);

    // Get the computed style
    const expectedComputedCss = getComputedStyle(elementClone)[property];
    debugger;
    const actualCss = getComputedStyle(element)[property];
    // Clean up: remove the element from the iframe
    iframeDoc.body.removeChild(elementClone);

    const isValid = actualCss === expectedComputedCss;
    const name = customName || `Check ${property} for ${element.tagName}`;
    const message = customMessageFn
      ? customMessageFn(expectedCss ?? "none", actualCss)
      : `Expected ${property}: ${
          expectedCss ?? "none"
        }; (${expectedComputedCss}) but got ${property}: ${actualCss};`;

    return {
      name,
      isValid,
      message,
      expected: expectedCss,
      measured: actualCss,
      element, // Not returning the element since it's in a different document (iframe)
    };
  }

  checkAllPV(
    selector: string,
    property: string,
    expectedCss: string | null,
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const elements = Array.from(
      this.contentWindow.document.querySelectorAll(selector)
    );
    for (const el of elements) {
      const check = this.checkCSSProperty(
        el,
        property,
        expectedCss,
        customMessageFn,
        customName
      );
      if (!check.isValid) return check;
    }
    return {
      name: customName || `Check ${property} for all ${selector}`,
      isValid: true,
      message: `All ${selector} have correct ${property}.`,
    };
  }

  checkOnePV(
    selector: string,
    property: string,
    expectedCss: string | null,
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const element = this.contentWindow.document.querySelector(selector);
    if (!element) {
      return {
        name: customName || `Check ${property} for ${selector}`,
        isValid: false,
        message: `No element found for selector: ${selector}`,
      };
    }
    return this.checkCSSProperty(
      element,
      property,
      expectedCss,
      customMessageFn,
      customName
    );
  }

  checkAllButPV(
    selector: string,
    property: string,
    expectedCss: string | null,
    excludeSelectors: string[],
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const excludedElements = excludeSelectors.flatMap((sel) =>
      Array.from(this.contentWindow.document.querySelectorAll(sel))
    );
    const elements = Array.from(
      this.contentWindow.document.querySelectorAll(selector)
    ).filter((el) => !excludedElements.includes(el));

    for (const el of elements) {
      const check = this.checkCSSProperty(
        el,
        property,
        expectedCss,
        customMessageFn,
        customName
      );
      if (!check.isValid) return check;
    }
    return {
      name:
        customName ||
        `Check ${property} for all ${selector} excluding ${excludeSelectors.join(
          ", "
        )}`,
      isValid: true,
      message: `All ${selector} (excluding ${excludeSelectors.join(
        ", "
      )}) have correct ${property}.`,
    };
  }

  checkCSSProperties(
    element: HTMLElement,
    propDic: { [key: string]: string },
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ) {
    let validationItem;
    for (let key in propDic) {
      validationItem = this.checkCSSProperty(
        element,
        key,
        propDic[key],
        customMessageFn,
        customName
      );
      if (!validationItem.isValid) {
        return validationItem;
      }
    }
    return validationItem;
  }

  checkOne(
    selector: string,
    properties: { [key: string]: string | null },
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const element = this.contentWindow.document.querySelector(selector);
    if (!element) {
      return {
        name: customName || `Check properties for ${selector}`,
        isValid: false,
        message: `No element found for selector: ${selector}`,
      };
    }
    for (const prop in properties) {
      const check = this.checkCSSProperty(
        element,
        prop,
        properties[prop],
        customMessageFn,
        customName
      );
      if (!check.isValid) return check;
    }
    return {
      name: customName || `All properties correct for ${selector}`,
      isValid: true,
      message: `All properties are correctly set for ${selector}.`,
    };
  }

  checkAll(
    selector: string,
    properties: { [key: string]: string | null },
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const elements = Array.from(
      this.contentWindow.document.querySelectorAll(selector)
    );
    for (const el of elements) {
      for (const prop in properties) {
        const check = this.checkCSSProperty(
          el,
          prop,
          properties[prop],
          customMessageFn,
          customName
        );
        if (!check.isValid) return check;
      }
    }
    return {
      name: customName || `Check properties for all ${selector}`,
      isValid: true,
      message: `All ${selector} have correct properties.`,
    };
  }

  checkAllBut(
    selector: string,
    properties: { [key: string]: string | null },
    excludeSelectors: string[],
    customMessageFn?: (expected: string, actual: string) => string,
    customName?: string
  ): ValidationItem {
    const excludedElements = excludeSelectors.flatMap((sel) =>
      Array.from(this.contentWindow.document.querySelectorAll(sel))
    );
    const elements = Array.from(
      this.contentWindow.document.querySelectorAll(selector)
    ).filter((el) => !excludedElements.includes(el));

    for (const el of elements) {
      for (const prop in properties) {
        const check = this.checkCSSProperty(
          el,
          prop,
          properties[prop],
          customMessageFn,
          customName
        );
        if (!check.isValid) return check;
      }
    }
    return {
      name:
        customName ||
        `Check properties for all ${selector} excluding ${excludeSelectors.join(
          ", "
        )}`,
      isValid: true,
      message: `All ${selector} (excluding ${excludeSelectors.join(
        ", "
      )}) have correct properties.`,
    };
  }

  hoverOne(selector: string, extraDelay = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = this.contentWindow.document.querySelector(selector);
      if (!element) {
        reject(`No element found for selector: ${selector}`);
        return;
      }

      // Set up a one-time event listener
      const onMouseOver = async () => {
        element.removeEventListener("mouseover", onMouseOver);
        await new Promise((resolve) => setTimeout(resolve, extraDelay));
        resolve();
      };

      element.addEventListener("mouseover", onMouseOver);
    });
  }

  async unhoverOne(selector: string): Promise<void> {
    const element = this.contentWindow.document.querySelector(selector);
    if (!element) {
      throw new Error(`No element found for selector: ${selector}`);
    }

    // Trigger unhover
    element.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));

    // Wait for a frame to ensure CSS is applied
    await new Promise(requestAnimationFrame);
  }
}

export function validatePseudoSelector(
  contentWindow,
  selector,
  expectedProperties,
  name
) {
  // Get all stylesheets from the contentWindow
  const styleSheets = contentWindow.document.styleSheets;
  let isValid = true;
  let errorMessage = "";

  // Iterate through all stylesheets
  for (const sheet of styleSheets) {
    // Try-catch block to handle cross-origin restrictions
    try {
      const rules = sheet.cssRules || sheet.rules;
      // Iterate through all rules in the stylesheet
      for (const rule of rules) {
        // Check if the rule selector matches the desired selector and is a StyleRule
        if (
          rule.selectorText === selector &&
          rule.type === CSSRule.STYLE_RULE
        ) {
          // Validate each property
          for (const property in expectedProperties) {
            const expectedValue = expectedProperties[property];
            if (rule.style[property] !== expectedValue) {
              isValid = false;
              errorMessage += `Expected ${property}: ${expectedValue}, but got ${rule.style[property]}. `;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Can't read the css rules of: ", sheet.href, e);
    }
  }

  return {
    isValid,
    name,
    message:
      errorMessage || `All properties are correctly set for ${selector}.`,
  };
}
