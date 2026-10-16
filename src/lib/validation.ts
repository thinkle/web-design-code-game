// validationLibrary.js

import type {
  CssSolution,
  ValidationResult,
  ValidationItem,
} from "../types/validation";

// Helper function to convert any color format to rgba for comparison
function colorToRgba(color: string): string | null {
  // Create a temporary element to leverage the browser's color parsing
  const tempEl = document.createElement("div");
  tempEl.style.color = color;
  document.body.appendChild(tempEl);
  const computed = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  return computed;
}

// Helper function to normalize color values for comparison
function normalizeColor(color: string): string {
  if (!color || color === "transparent") {
    return "rgba(0, 0, 0, 0)";
  }

  // Use browser's computed style to normalize the color
  const normalized = colorToRgba(color);
  if (normalized) {
    // Extract rgb/rgba values and normalize spacing
    const match = normalized.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (match) {
      const [, r, g, b, a] = match;
      // Return in canonical format: rgba(r, g, b, a)
      const alpha = a ? parseFloat(a).toFixed(1) : "1.0";
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  // Return as-is if we can't parse it
  return color;
}

/** WCAG relative luminance (0 = black, 1 = white) of any CSS color. */
export function relativeLuminance(color: string): number {
  const match = normalizeColor(color).match(
    /rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/
  );
  if (!match) return 1;
  const [r, g, b] = match.slice(1, 4).map((v) => {
    const c = parseInt(v, 10) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colors (1 to 21). */
export function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** True if the color is fully transparent. */
export function isTransparent(color: string): boolean {
  return /, 0(\.0)?\)$/.test(normalizeColor(color));
}

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
    (!style.display ||
      style.display.includes("block") ||
      style.display.includes("flow-root") ||
      style.display === "list-item");
  if (!valid) {
    return false;
  } else {
    return true;
  }
}

export type RectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function toRect(target: Element | RectLike): RectLike {
  // (Not `instanceof Element`: elements in the preview iframe come from a
  // different window, so they aren't instances of *our* Element.)
  return "getBoundingClientRect" in target
    ? target.getBoundingClientRect()
    : target;
}

/**
 * The rectangle of an element's *content* box (inside border + padding).
 *
 * Elements like .cat have no background, so what the student actually sees
 * is whatever is drawn in the content area (the emoji). If a student moves
 * the cat with padding instead of margin, the border box stays put but the
 * visible cat moves, so we measure the content box instead.
 */
export function getContentRect(element: Element): RectLike {
  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView || window;
  const style = win.getComputedStyle(element);
  const px = (prop: string) => parseFloat(style.getPropertyValue(prop)) || 0;
  const left = rect.left + px("border-left-width") + px("padding-left");
  const top = rect.top + px("border-top-width") + px("padding-top");
  const right = rect.right - px("border-right-width") - px("padding-right");
  const bottom = rect.bottom - px("border-bottom-width") - px("padding-bottom");
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

/** Compare sizes with some slack: browser zoom produces fractional pixels. */
export function isAboutSize(
  rect: RectLike,
  width: number,
  height: number,
  tolerance = 1
): boolean {
  return (
    Math.abs(rect.width - width) <= tolerance &&
    Math.abs(rect.height - height) <= tolerance
  );
}

export function validateSpaceBetweenElementsLR(
  element1: Element | RectLike,
  element2: Element | RectLike,
  minSpace: number
): boolean {
  let rect1 = toRect(element1);
  let rect2 = toRect(element2);
  return rect2.left - rect1.right >= minSpace;
}
export function validateSpaceBetweenElementsTB(
  element1: Element | RectLike,
  element2: Element | RectLike,
  minSpace: number
): boolean {
  let rect1 = toRect(element1);
  let rect2 = toRect(element2);
  if (rect1.top > rect2.top) {
    [rect2, rect1] = [rect1, rect2];
  }
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

export function calculateOffsets(
  element1: Element | RectLike,
  element2: Element | RectLike
) {
  const rect1 = toRect(element1);
  const rect2 = toRect(element2);

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

  // (A `return false` inside forEach only exits the callback, which is why
  // this used to report "in a line" even when the boxes were stacked.)
  return Array.from(elements).every(
    // Allowing 1px tolerance
    (element) => Math.abs(element.getBoundingClientRect().top - firstElementTop) <= 1
  );
}

export function doElementsOverlap(
  element1: Element | RectLike,
  element2: Element | RectLike
): boolean {
  const rect1 = toRect(element1);
  const rect2 = toRect(element2);
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
    const expectedComputedCss = getComputedStyle(elementClone)[property as any];
    const actualCss = getComputedStyle(element)[property as any];

    // Check if we should use flexible color comparison
    const isColorProperty = property.toLowerCase().includes("color");
    const isValid = isColorProperty
      ? normalizeColor(actualCss as string) ===
        normalizeColor(expectedComputedCss as string)
      : actualCss === expectedComputedCss;

    // Clean up: remove the element from the iframe
    iframeDoc.body.removeChild(elementClone);

    const name = customName || `Check ${property} for ${element.tagName}`;
    const message = customMessageFn
      ? customMessageFn(expectedCss ?? "none", actualCss as string)
      : `Expected ${property}: ${
          expectedCss ?? "none"
        }; (${expectedComputedCss}) but got ${property}: ${actualCss};`;

    return {
      name,
      isValid,
      message,
      expected: expectedCss ?? undefined,
      measured: actualCss as string,
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

/**
 * Check styles on a pseudo-element (::before, ::first-line, ...), which
 * getComputedStyle can't reliably give us, by reading the CSS rules.
 *
 * Any selector counts if it ends with the same pseudo-element and its
 * base selects exactly the same elements as the expected one, so
 * `ul li::before` or `section li::before` satisfy `li::before`.
 */
export function validatePseudoSelector(
  contentWindow: Window,
  selector: string,
  expectedProperties: { [key: string]: string | null },
  name: string
) {
  const doc = contentWindow.document;
  const pseudoMatch = selector.match(/^(.*?)(::?[a-z-]+)$/);
  const expectedBase = pseudoMatch ? pseudoMatch[1].trim() : selector;
  const pseudo = pseudoMatch
    ? pseudoMatch[2].replace(/^::?/, "").toLowerCase()
    : "";

  const select = (sel: string): Element[] | null => {
    try {
      return Array.from(doc.querySelectorAll(sel || "*"));
    } catch (e) {
      return null; // invalid selector
    }
  };
  const expectedElements = select(expectedBase) || [];

  const sameElements = (sel: string) => {
    if (sel.replace(/\s+/g, " ") === selector.replace(/\s+/g, " ")) {
      return true;
    }
    const m = sel.match(/^(.*?)(::?[a-z-]+)$/);
    if (!m || m[2].replace(/^::?/, "").toLowerCase() !== pseudo) return false;
    const found = select(m[1].trim());
    return (
      !!found &&
      expectedElements.length > 0 &&
      found.length === expectedElements.length &&
      found.every((el) => expectedElements.includes(el))
    );
  };

  // Gather declarations from every matching rule; later rules win
  const declared: { [property: string]: string } = {};
  let foundRule = false;
  for (const sheet of Array.from(doc.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch (e) {
      console.warn("Can't read the css rules of: ", sheet.href, e);
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule as CSSStyleRule).selectorText) continue;
      const styleRule = rule as CSSStyleRule;
      const parts = styleRule.selectorText.split(",").map((p) => p.trim());
      if (!parts.some(sameElements)) continue;
      foundRule = true;
      for (const property in expectedProperties) {
        const value = styleRule.style.getPropertyValue(property);
        if (value) declared[property] = value;
      }
    }
  }

  if (!foundRule) {
    return {
      isValid: false,
      name,
      message: "Looks like you don't have a working rule yet!",
    };
  }
  for (const property in expectedProperties) {
    const expected = expectedProperties[property];
    const actual = declared[property] ?? "";
    if (!sameCssValue(contentWindow, property, actual, expected ?? "")) {
      return {
        isValid: false,
        name,
        message: `Found a rule for ${selector}, but some properties don't match. (expected ${property} to be ${expected} but got ${
          actual || "nothing"
        })`,
      };
    }
  }
  return {
    isValid: true,
    name,
    message: "Correct rules for " + selector,
  };
}

/** Compare two CSS values the way the browser would compute them. */
function sameCssValue(
  contentWindow: Window,
  property: string,
  a: string,
  b: string
): boolean {
  if (a.trim() === b.trim()) return true;
  if (!a || !b) return false;
  const doc = contentWindow.document;
  const probe = (value: string) => {
    const el = doc.createElement("span");
    el.style.setProperty(property, value);
    doc.body.appendChild(el);
    const computed = contentWindow.getComputedStyle(el).getPropertyValue(property);
    el.remove();
    return computed;
  };
  return probe(a) === probe(b);
}
