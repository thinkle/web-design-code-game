import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/margin-2.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import {
  calculateOffsets,
  validateSpaceBetweenElementsTB,
} from "../validation";

export const escapeWaterChallenge: ChallengeDefinition = {
  language: "css",
  height: 200,
  instructions,
  html: `
    <div class="water"></div>
    <div class="land">
      <div class="cat"></div>
    </div>
  `,
  hiddenHTMLBefore: "<main><section>",
  hiddenHTMLAfter: "</section></main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    maincss +
    `
  section {
    width: calc(100% - 32px);
    margin-left: 32px;
  }
  `,
  css: `
    .cat {
      width: 30px;
      height: 30px;
    }

    .land {
      width: 100%;
      height: 150px;
      background-color: beige;
      border-top: 1px solid turquoise;
      box-sizing: border-box;
    }

    .water {
      width: 100%;
      height: 50px;
      background-color: lightblue;
    }

    WORK
  `,
  starterCode: `
    .cat {
      
    }
  `,
  solution: `
    .cat {
      margin-top: 60px;
    }
  `,
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    // Get elements
    const water = contentWindow.document.querySelector(
      ".water"
    ) as HTMLDivElement;
    const cat = contentWindow.document.querySelector(".cat") as HTMLDivElement;

    // Check if the cat is at the bottom of the land

    items.push({
      name: "Cat Position",
      message:
        "The cat should be far away from the water!",
      isValid: validateSpaceBetweenElementsTB(water, cat, 50),
    });    
    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
