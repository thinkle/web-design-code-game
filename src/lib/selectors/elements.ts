import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const elementChallenge: ChallengeDefinition = {
  title: "Flip the Chair!",
  language: "css",
  height: 140,
  instructions: `
## Turn the chair upside down

Our cats love a little mischief. Flip every chair so it's upside down.

Select the chair elements and rotate them 180 degrees

Hint: use the element name as the selector (no angle brackets)
  `,
  html: `
  <room>
    <bed>
      <cat></cat>
    </bed>
    <chair>
      <cat></cat>
    </chair>
    <basket>
      <cat></cat>
    </basket>
    <chair>
      <cat></cat>
    </chair>
  </room>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
  `,
  starterCode: `
    /* Target the <chair> elements and flip them */
    FIXME {
      transform: rotate(180deg);      
    }
  `,
  solution: `  
  chair {      
    transform: rotate(180deg);
  }
  `,
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    let chair = contentWindow.document.querySelector("chair");
    let basket = contentWindow.document.querySelector("basket");
    let bed = contentWindow.document.querySelector("bed");

    items.push({
      name: "Chair",
      message: "Flip the chairs",
      isValid: isElementRotated(chair, contentWindow),
    });
    items.push({
      name: "Basket",
      message: "Don't flip the basket",
      isValid: !isElementRotated(basket, contentWindow),
    });
    items.push({
      name: "Bed",
      message: "Goodness, why would you flip the bed?",
      isValid: !isElementRotated(bed, contentWindow),
    });

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
