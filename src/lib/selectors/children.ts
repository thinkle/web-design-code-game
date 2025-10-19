import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker, isElementRotated } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const childCombinatorChallenge: ChallengeDefinition = {
  title: "Cats on the Bed Only",
  language: "css",
  height: 240,
  instructions: `
# Use the child selector (\`>\`) 

The \`>\` selector selects elements that are *immediate* children of another element.

\`\`\`css
section > p {
  color: red;
}
\`\`\`

This would color only \`<p>\` elements that are *directly* inside a \`<section>\`, not paragraphs nested deeper inside divs.

## Challenge: Only the Cats on the Bed Lie Down

👉 In the example below, make only the **top-level cats** sitting on the bed lie on their sides. The cats hiding inside *boxes* on the bed should not be affected.

  `,
  html: `
  <bed>
    <cat></cat>
    <box>
      <cat></cat>
    </box>
    <cat></cat>
    <box>
      <box>
        <cat></cat>
      </box>
    </box>
  </bed>
  `,

  hiddenCSSBefore: catcss,
  css: `
  
    bed {
      display: flex;      
      justify-content: space-around;
      align-items: start;
      padding-top: 30px;
      width: 400px;
      height: 180px;
      padding-right: 20px;
      padding-left: 20px;      
    }
      bed cat {
      padding-bottom: 30px;}
      box {
       margin-bottom: 16px;
       flex-basis: 80px;
       }

    WORK
  `,
  starterCode: `
    /* Select only cats that are direct children of the couch */
    FIXME {
      transform: rotate(-90deg);
      transform-origin: right;
    }
  `,
  solution: `
    bed > cat {
      transform: rotate(-90deg);
      transform-origin: right;
    }
  `,
  validate(contentWindow) {
    const items: ValidationItem[] = [];

    // Check that direct child cats are rotated
    const directCats = contentWindow.document.querySelectorAll("bed > cat");
    let allDirectCatsRotated = true;
    directCats.forEach((cat) => {
      if (!isElementRotated(cat as HTMLDivElement, contentWindow)) {
        allDirectCatsRotated = false;
      }
    });

    if (allDirectCatsRotated && directCats.length > 0) {
      items.push({
        name: "Direct bed cats",
        message: "Cats on the bed are lying down!",
        isValid: true,
      });
    } else {
      items.push({
        name: "Direct bed cats",
        message: "Cats on the bed should lie down!",
        isValid: false,
      });
    }

    // Check that nested cats inside boxes are NOT rotated
    const allCats = contentWindow.document.querySelectorAll("cat");
    let anyNestedCatsRotated = false;
    allCats.forEach((cat) => {
      // Check if it's NOT a direct child of bed
      if (cat.parentElement?.tagName !== "BED") {
        if (isElementRotated(cat as HTMLDivElement, contentWindow)) {
          anyNestedCatsRotated = true;
        }
      }
    });

    if (!anyNestedCatsRotated) {
      items.push({
        name: "No nested cats",
        message: "Cats inside boxes are standing up!",
        isValid: true,
      });
    } else {
      items.push({
        name: "No nested cats",
        message: "Cats inside boxes should NOT lie down!",
        isValid: false,
      });
    }

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
