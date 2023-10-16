import type { ChallengeDefinition } from "../../types/challenge";

import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/catnap.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import {
  calculateOffsets,
  doElementsOverlap,
  hasVisibleBorder,
} from "../validation";

export const cozyCatNapChallenge: ChallengeDefinition = {
  title: "Cat Nap",
  language: "css",
  height: 300,
  instructions,
  html: ` 
<div class="bed">
  <div class="pillow">
  </div>
  <div class="blanket">
    <div class="cat"></div>
  </div>
</div>`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    maincss +
    `
.bed {
    background-color: lightblue;
    background: linear-gradient(
    to bottom,
    #e0eafc 0%,  /* color of the sheet */
    #e0eafc 30%, /* color of the sheet */
    #ffb6c1 30%, /* color of the blanket */
    #ffb6c1 100% /* color of the blanket */
    );
}  

.blanket {
  background-image: radial-gradient(
    circle at center,
    #ffabab 0%,    /* innermost color */
    #ffabab 20%,   /* innermost color */
    #ffc3a0 20%,   /* middle color */
    #ffc3a0 40%,   /* middle color */
    #ffdfab 40%,   /* outer color */
    #ffdfab 60%,   /* outer color */
    #ffe8a9 60%,   /* outermost color */
    #ffe8a9 80%,   /* outermost color */
    #f3e5ab 80%,    /* background color */
    #ffabab 100%
  );
}
.pillow {
  background-color: #fff5cb;    
}
  `,
  css: ` 
  .cat {
    width: 30px;
    height: 30px;
  }

  .bed {
    width: 200px;
    height: 250px;
    box-sizing: border-box;  
  }

  .blanket {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    
  }

  .pillow {
    width: 100px;
    height: 50px;
    border-radius: 16px;    
    margin-left: 50px;
    margin-top: 15px;
    margin-bottom: 15px;        
  }

  WORK`,
  starterCode: `
.blanket {
  box-sizing: border-box;   
  FIXME     
}

.bed {

}

  `,
  solution: ` .blanket {
    box-sizing: border-box;
    margin-top: -50px;
    margin-left: 100px;
    padding: 30px;
  }

  .bed {
    border-top: 5px solid brown;
    border-bottom: 5px solid brown;
  }

  `,
  validateSkeleton(contentWindow) {
    let items: ValidationItem[] = [];
    // Check if the cat is on the right half of the bed

    // Check if the blanket is overlapping the pillow

    // Check if the bed has a visible bottom and top border

    return {
      isSolved: false,
      items,
    };
  },
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    // Get elements
    const bed = contentWindow.document.querySelector(".bed") as HTMLDivElement;
    const blanket = contentWindow.document.querySelector(
      ".blanket"
    ) as HTMLDivElement;
    const pillow = contentWindow.document.querySelector(
      ".pillow"
    ) as HTMLDivElement;
    const cat = contentWindow.document.querySelector(".cat") as HTMLDivElement;

    // Check if the cat is centered on the blanket
    const catBlanketOffsets = calculateOffsets(blanket, cat);
    const isCatCenteredHorizontally =
      Math.abs(
        catBlanketOffsets.left -
          (blanket.getBoundingClientRect().width / 2 -
            cat.getBoundingClientRect().width / 2)
      ) <= 5; // Allowing 5px tolerance
    const isCatCenteredVertically =
      Math.abs(
        catBlanketOffsets.top -
          (blanket.getBoundingClientRect().height / 2 -
            cat.getBoundingClientRect().height / 2)
      ) <= 5; // Allowing 5px tolerance

    items.push({
      name: "Centered on blanket",
      message: "The cat should be centered on the blanket.",
      isValid: isCatCenteredHorizontally && isCatCenteredVertically,
    });

    // Check if the cat is on the right half of the bed
    const catOffsets = calculateOffsets(bed, cat);
    items.push({
      name: "Right half of the bed",
      message: "The cat should be on the right half of the bed.",
      isValid: catOffsets.left >= bed.getBoundingClientRect().width / 2,
    });

    items.push({
      name: "Blanket overlaps pillow",
      message: "The blanket should overlap the pillow.",
      isValid: doElementsOverlap(pillow, blanket),
    });

    // Check if the bed has a visible bottom and top border
    const bedBorder = hasVisibleBorder(bed);
    items.push({
      name: "Headboard & Footboard",
      message: "The bed should have visible top and bottom borders.",
      isValid: bedBorder.top && bedBorder.bottom,
    });

    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
