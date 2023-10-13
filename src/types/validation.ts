// validationLibrary.js

export type CssSolution = {
  [property: string]: any;
};

export type ValidationItem = {
  name: string;
  isValid: boolean;
  message?: string;
  mesaured?: string;
  element?: HTMLElement;
  expected?: string;
};

export type ValidationResult = {
  isSolved: boolean;
  items: ValidationItem[];
};
