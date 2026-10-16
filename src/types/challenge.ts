// challengeType.ts

import type { ValidationResult } from "./validation";

export type ChallengeDefinition = {
  title: string;
  language: "html" | "css" | "js";
  html: string;
  css?: string;
  js?: string;
  hiddenHTMLBefore?: string;
  hiddenHTMLAfter?: string;
  hiddenCSSBefore?: string;
  instructions: string;
  starterCode: string;
  requireHover?: boolean;
  /** Shown while an interactive (click/hover) check waits for the student */
  interactionPrompt?: string;
  solution: string;
  validate: (
    contentWindow: Window,
    studentWork: string
  ) => ValidationResult | Promise<ValidationResult>;
  height?: number;
};
