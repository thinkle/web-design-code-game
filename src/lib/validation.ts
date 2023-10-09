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


