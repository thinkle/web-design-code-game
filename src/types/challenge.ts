
export type ChallengeDefinitionOld = {
  language: 'html' | 'css' | 'js';
  template: string;
  instructions: string;
  solution: string;
  html: string;
  css: string;
  js: string;
  starter: string;
};

// challengeType.ts

import type { ValidationResult } from './validation';

export type ChallengeDefinition = {
  language: 'html' | 'css' | 'js';
  html : string;
  css : string;
  js : string;
  hiddenHTMLBefore? : string;
  hiddenHTMLAfter? : string;
  hiddenCSSBefore? : string;
  instructions: string;
  starterCode: string;
  solution: string;      
  validate: (contentWindow: Window) => ValidationResult;
};


