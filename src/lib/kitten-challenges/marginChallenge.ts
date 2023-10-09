import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/margin-1.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { isUsingBoxModel, validateSpaceBetweenElementsLR } from "../validation";

const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const BOX_SIZE = 40;
const MARGIN = 25;
const PADDING = 5;
const threshhold = 5;

export const marginChallenge: ChallengeDefinition = {
  language: "css",
  height: 140,
  instructions,
  html: `
    <div class="box">
      <div class="cat"></div>
    </div>
    <div class="box">
      <div class="cat"></div>
    </div>
  `,
  hiddenHTMLBefore : '<main>',
  hiddenHTMLAfter : '</main>',
  hiddenCSSBefore: `main { background-color: #222}` + maincss + "\n" + catcss,
  css: `
    
    .cat {
      width: ${CAT_WIDTH}px;
      height: ${CAT_HEIGHT}px;
    }

    .box {
      display: inline-block;
      width: ${BOX_SIZE}px;
      height: ${BOX_SIZE}px;
      box-sizing: border-box;
      padding: ${PADDING}px;
    }
    
    WORK
  `,
  starterCode: `
    .box {
      
    }
  `,
  solution: `  
  .box {      
    margin: ${MARGIN}px;
  }
  `,
  validate(contentWindow) {
    let boxes = contentWindow.document.querySelectorAll(".box");    
    let box1Element = boxes[0] as HTMLDivElement;
    let box2Element = boxes[1] as HTMLDivElement;

    let items: ValidationItem[] = [];
    let isSolved = true;

    if (!validateSpaceBetweenElementsLR(box1Element, box2Element, 20)) {
      items.push({
        name: "Too close!",
        message: "The kitties are too close! Move their boxes apart!",
        isValid: false,
      });
      isSolved = false;
    }
    // Your validation logic here, similar to the first challenge but adapted for margin
    if (
      !isUsingBoxModel(box1Element, contentWindow) ||
      !isUsingBoxModel(box2Element, contentWindow)
    ) {
      items.push({
        name: "Use the boxes!",
        message:
          "Use the box model for this challenge! No relative or absolution positioning allowed.",
        isValid: false,
      });
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
