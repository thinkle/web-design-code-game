import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/margin-3.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import {
  calculateOffsets,
  validateSpaceBetweenElementsTB,
} from "../validation";

export const advancedWaterChallenge: ChallengeDefinition = {
  title: "Beach Cat 2",
  language: "css",
  height: 250,
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
  .land {
    position: relative;
  }  
  .land::after {
    content : "🏖️🏖️🏖️";
    font-size: 50px;
    line-height: 40px;
    position: absolute;
    right: 10px;
    bottom: -10px;
    width: 50px;
  }
  .cat {
    position: relative;
    z-index: 2;
    top: 0;
    left: 0;
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
      margin-top: 80px;
      margin-left: 240px;
    }
  `,
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    // Get elements
    const water = contentWindow.document.querySelector(
      ".water"
    ) as HTMLDivElement;
    const cat = contentWindow.document.querySelector(".cat") as HTMLDivElement;
    const land = contentWindow.document.querySelector(
      ".land"
    ) as HTMLDivElement;
    // Check if the cat is at the bottom of the land

    items.push({
      name: "Away from water!",
      message: "The cat should at least 50px from the water!",
      isValid: validateSpaceBetweenElementsTB(water, cat, 50),
    });
    let offsets = calculateOffsets(land, cat);
    items.push({
      name: "Shade",
      message: "Get the cat under the umbrellas!",
      isValid: offsets.right < 50 && offsets.top > 20,
    });
    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
