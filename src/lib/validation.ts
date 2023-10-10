// validationLibrary.js

import type {CssSolution,ValidationResult,ValidationItem} from '../types/validation';

export function validateCssProperties(
  element: Element,
  solution: CssSolution,
  tolerance: number = 1
): ValidationResult {
  const computedStyle = getComputedStyle(element);
  const items: ValidationItem[] = [];

  for (const [property, expectedValue] of Object.entries(solution)) {
    const actualValue = computedStyle[property];
    let isValid = false;
    let message = "";

    if (typeof expectedValue === "number" && !isNaN(parseFloat(actualValue))) {
      isValid = Math.abs(parseFloat(actualValue) - expectedValue) < tolerance;
      message = isValid
        ? `Correct ${property}!`
        : `The ${property} should be ${expectedValue}px.`;
    } else {
      isValid = actualValue === expectedValue;
      message = isValid
        ? `Correct ${property}!`
        : `The ${property} should be ${expectedValue}.`;
    }

    items.push({
      name: `Validate ${property}`,
      isValid,
      message,
    });
  }

  return {
    isSolved: items.every((item) => item.isValid),
    items,
  };
}




export function isUsingBoxModel(element: HTMLDivElement, contentWindow: Window): boolean {
  let style = contentWindow.getComputedStyle(element);
  let valid = (!style.position || style.position === 'static') && (!style.display || style.display.includes('block'));
  if (!valid) {        
    return false
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
  return (rect2.left - rect1.right) >= minSpace;
}
export function validateSpaceBetweenElementsTB(
  element1: HTMLDivElement,
  element2: HTMLDivElement,
  minSpace: number
): boolean {
  let rect1 = element1.getBoundingClientRect();
  let rect2 = element2.getBoundingClientRect();
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
) : boolean {  

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