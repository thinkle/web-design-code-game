import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/sides.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { calculateOffsets, hasVisibleBorder } from "../validation";

const CAT_HEIGHT = 30;

export const sidesChallenge: ChallengeDefinition = {
  title: "Cat on a Line",
  language: "css",
  height: 140,
  instructions,
  html: `
    <div class="box">
      <div class="cat"></div>
    </div>
  `,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore: `main { background-color: #222}` + maincss + "\n" + catcss,
  css: `
    .cat {
      width: ${CAT_HEIGHT}px;
      height: ${CAT_HEIGHT}px;
    }

    .box {
      display: inline-block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    
    WORK
  `,
  starterCode: `
    .box {
      FIXME
    }
    .cat {
      
    }
  `,
  solution: `  
    .box {      
      border-bottom: 8px solid black;
      padding-left: 33%;
      padding-top: calc(90vh - ${CAT_HEIGHT}px - 8px);
      padding-bottom: 0;
    }
  `,
  validate(contentWindow) {
    let boxElement = contentWindow.document.querySelector(
      ".box"
    ) as HTMLDivElement;
    let catElement = boxElement.querySelector(".cat") as HTMLDivElement;
    let items: ValidationItem[] = [];
    let isSolved = true;
    let boxrect = boxElement.getBoundingClientRect();
    const computedStyle = contentWindow.getComputedStyle(boxElement);
    const visibleBorder = hasVisibleBorder(boxElement);
    let offsets = calculateOffsets(boxElement, catElement);
    // Validate padding-left
    if (
      offsets.left < boxrect.width * 0.3 ||
      offsets.left > boxrect.width * 0.5
    ) {
      items.push({
        name: "1/3 of the way across",
        message: "Move the cat one-third of the way from left to right",
        isValid: false,
      });
      isSolved = false;
    }

    // Validate padding-top
    if (offsets.top < 50) {
      items.push({
        name: "Needs some room to breath!",
        message: `Make sure there is space over the kitty!`,
        isValid: false,
      });
      isSolved = false;
    }

    // Validate padding-bottom
    if (computedStyle.bottom < 5) {
      items.push({
        name: "Cat should be on the line",
        message: "Make sure the cat is sitting on the bottom line!",
        isValid: false,
      });
      isSolved = false;
    }

    // Validate border-bottom
    if (!visibleBorder.bottom) {
      items.push({
        name: "No line to stand on!",
        message: "Put a line at the bottom of the box for the kitty to sit on!",
        isValid: false,
      });
      isSolved = false;
    }
    if (visibleBorder.top || visibleBorder.left || visibleBorder.right) {
      items.push({
        name: "Only the bottom has a line!",
        message: "Don't box the poor kitty in!",
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
