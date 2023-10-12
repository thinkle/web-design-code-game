import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";

import instructions from "./markdown/inlineBlock.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import {
  validateHorizontalAlignment,
  validateSpaceBetweenElementsLR,
  validateSpaceBetweenElementsTB,
} from "../validation";

export const inlineBlockChallenge: ChallengeDefinition = {
  title: "Cats in Line",
  language: "css",
  height: 200,
  instructions,
  html: `
    <div class="box"><div class="cat"></div></div>
    <div class="box"><div class="cat"></div></div>
    <div class="box"><div class="cat"></div></div>
  `,
  hiddenHTMLBefore: "<main><section>",
  hiddenHTMLAfter: "</main></section>",
  hiddenCSSBefore: catcss + "\n" + maincss,
  css: `
  .cat {
    width: 30px;
    height: 30px;
  }
  .box {
    background-color: beige;
    box-sizing: border-box;
    width: 70px;
    height: 70px;
    padding: 20px;
  }
  WORK`,
  starterCode: `.box {
    margin: 16px;
  }`,
  solution: `  
    .box {
      display: inline-block;
      margin: 16px;
    }
  `,
  validate(contentWindow) {
    let boxElements = contentWindow.document.querySelectorAll(".box");
    let items: ValidationItem[] = [];
    let isSolved = true;

    // Validate display property and margin
    let marginValidation = {
      name: "Gap between boxes",
      message: "Put more space between the boxes!",
      isValid: true,
    };
    boxElements.forEach((box, index) => {
      if (index) {
        let otherBox = boxElements[index - 1];
        let marginValid = validateSpaceBetweenElementsLR(otherBox, box, 16);
        if (!marginValid) {
          marginValidation.isValid = false;
          isSolved = false;
        }
      }
    });
    items.push(marginValidation);
    let horizontalValidation = {
      name: "Line boxes up horizontally",
      message: `Boxes in a line horizontally`,
      isValid: validateHorizontalAlignment(boxElements, contentWindow),
    };
    items.push(horizontalValidation);
    if (!horizontalValidation.isValid) {
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
