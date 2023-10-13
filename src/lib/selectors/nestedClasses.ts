import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";

import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";

import type { ValidationItem } from "../../types/validation";

export const nestedClassesChallenge: ChallengeDefinition = {
  title: "Nested Classes",
  language: "css",
  height: 180,
  instructions: `
# Fancy Brand Cat Toys

Our fancy paragraph is special. And our branded items are special.
Make our fancy, branded items *extra special* by adding a 
wavy blue underline to them.
  `,
  html: ` 
  <p class="center"><cat></cat></p>
  <p class="fancy">
    Everyone knows 
    <span class="brand">MeowMeow</span> 
    makes the best toys in the West.
  </p>
  <p class="normal">
    Also, cats love our 
    <span class="brand">MeowMeow</span>
    toys.
  </p>
  `,
  hiddenCSSBefore: catcss,
  css: ` 
  WORK 
  .fancy {
    line-height: 1.4;
    font-weight: bold;
  }
  .brand {
    font-variant: small-caps;
    color: #4a4a4a;
  }
  .center {
    text-align: center;
  }
   `,
  starterCode: ` FIXME {
    text-decoration: blue wavy underline;    
  }

  `,
  solution: ` .fancy .brand {
    text-decoration: blue wavy underline;
     }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);

    let items = [
      pc.checkOne(".fancy .brand", {
        "text-decoration-line": "underline",
        "text-decoration-style": "wavy",
        "text-decoration-color": "blue",
      }),
      pc.checkAllBut(
        ".brand",
        { "text-decoration-style": null },
        [".fancy .brand"],
        (expected, actual) => "Regular old brands DON'T get underlined!",
        "Don't underline brand elsewhere"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
