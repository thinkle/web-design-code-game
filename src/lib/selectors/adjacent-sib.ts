import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const adjacentSiblingChallenge: ChallengeDefinition = {
  title: "Spooked Cats",
  language: "css",
  height: 240,
  instructions: `
# Use the adjacent sibling selector (\`+\`)

The \`+\` selector selects an element that is **immediately after** another element.

\`\`\`css
h2 + p {
  color: red;
}
\`\`\`

This would color only \`<p>\` elements that **come right after** an \`<h2>\` — not paragraphs further down.

## Challenge: Spooked Cats

👉 When a **dog** is immediately to the left of a **cat**, the cat gets a **glowy shadow**.  

Note: Only cats that directly follow a dog should be affected — other cats should stay calm.

  `,
  html: `
  <yard>
    <dog></dog>
    <cat></cat>
    <cat></cat>
    <dog></dog>    
    <dog></dog>
    <cat></cat>    
    <dog></dog>    
    <cat></cat>
  </yard>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    yard {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 20px;
    }
    box {
      display: flex;
      padding: 10px;
      border: 2px dashed #ccc;
    }
    cat, dog {
      transition: filter 0.3s;
    }

    WORK
  `,
  starterCode: `
    /* Make cats after dogs glow */
    FIXME {
      filter: drop-shadow(3px 3px 6px orange);
    }
  `,
  solution: `
    dog + cat {
      filter: drop-shadow(3px 3px 6px orange);
    }
  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [
      pc.checkAll(
        "dog + cat",
        { filter: "drop-shadow(3px 3px 6px orange)" },
        () => "Cats immediately after dogs should glow!",
        "Spooked cats"
      ),
      pc.checkAllBut(
        "cat",
        { filter: null },
        ["dog + cat"],
        () => "Cats that are NOT right after a dog should not have a shadow",
        "Calm cats"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
