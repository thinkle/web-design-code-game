import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/border-1.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { hasVisibleBorder } from "../validation";

const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const BOX_SIZE = 40;
const BORDER_WIDTH = 5;
const MARGIN = 20;
const PADDING = 20;

export const borderChallenge: ChallengeDefinition = {
  title: "Fence in the Cat",
  language: "css",
  height: 200,
  instructions,
  html: `
    <div class="yard dog-yard">
      <div class="dog"></div>
    </div>
    <div class="yard cat-yard">
      <div class="cat"></div>
    </div>    
  `,
  hiddenHTMLBefore: "<main><section>",
  hiddenHTMLAfter: "<section></main>",
  hiddenCSSBefore:
    `main { background-color: #7a7a7a;}` +
    maincss +
    "\n" +
    catcss +
    `
  .yard {
    background: repeating-linear-gradient(
      50deg,
      #6CBB3C,
      #6CBB3C 5px,
      #8BD048 5px,
      #8BD048 10px
    );
  }
  
  
  `,
  css: `
    
    .cat {
      width: ${CAT_WIDTH}px;
      height: ${CAT_HEIGHT}px;
    }
    .yard {
      width: 100px;
      height: 80px;
    }
        
    WORK
  `,
  starterCode: `
    .cat-yard {
      box-sizing: border-box;
    }
  `,
  solution: `  
  .cat-yard {
      box-sizing: border-box;
      border-color: brown;
      border-width: 8px;
      border-style: solid;
    }
  `,
  validate(contentWindow) {
    let solved = false;
    let yard = contentWindow.document.querySelector(
      ".cat-yard"
    ) as HTMLDivElement;
    let items: ValidationItem[] = [];
    let borderInfo = hasVisibleBorder(yard);
    if (borderInfo.all) {
      return { isSolved: true, items: [] };
    } else {
      for (let dir of ["left", "right", "top", "bottom"]) {
        items.push({
          isValid: borderInfo[dir],
          name: `${dir} border`,
          message: `What if the dog comes from the ${dir}!`,
        });
      }
    }
    return {
      isSolved: solved,
      items,
    };
  },
};
