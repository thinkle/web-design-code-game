import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/margin-1.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import {
  getContentRect,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";

const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const BOX_SIZE = 40;
const MARGIN = 25;
const PADDING = 5;
const threshhold = 5;
// Space required between the (visible) cats. The gap is roughly
// 2 * margin + 14px: the start has ~14px, the Target's 25px margin ~64px.
const MIN_CAT_GAP = 30;

export const marginChallenge: ChallengeDefinition = {
  title: "Fighting Cats",
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
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
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
      FIXME
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
    let cats = contentWindow.document.querySelectorAll(".cat");

    let items: ValidationItem[] = [];
    let isSolved = true;

    // Measure the cats students can see, not the boxes, so any box-model
    // approach (margin, padding, border...) that separates them counts.
    if (
      !validateSpaceBetweenElementsLR(
        getContentRect(cats[0]),
        getContentRect(cats[1]),
        MIN_CAT_GAP
      )
    ) {
      items.push({
        name: "Too close!",
        message: "The kitties are too close! Compare with the Target.",
        isValid: false,
      });
      isSolved = false;
    }
    // Your validation logic here, similar to the first challenge but adapted for margin
    if (
      !isUsingBoxModel(box1Element, contentWindow) ||
      !isUsingBoxModel(box2Element, contentWindow) ||
      Array.from(cats).some(
        (cat) => !isUsingBoxModel(cat as HTMLDivElement, contentWindow)
      )
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
