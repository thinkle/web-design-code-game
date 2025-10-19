import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const adjacentSiblingChallenge: ChallengeDefinition = {
  title: "Spooked Cats",
  language: "css",
  height: 240,
  instructions: `
## Using the adjacent sibling selector (\`+\`)

The \`+\` selector selects an element that is **immediately after** another element.

\`\`\`css
/* Select <p> elements immediately after <h2> */
h2 + p {
  color: red;
}
\`\`\`


# Challenge: Spooked Cats

👉 When a **dog** is immediately to the left of a **cat**, the cat gets a **glowy shadow**.  

Note: Only cats that directly follow a dog should be affected — other cats should stay calm.

  `,
  html: `
  <yard>

    <cat></cat>
    <cat></cat>
    <dog></dog>    
    <dog></dog>
    <cat></cat>
    <cat></cat>    
    <dog></dog>    
    <cat></cat>
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
      yard:hover > * {
      transform: rotateY(-30deg);
      }

    WORK
  `,
  starterCode: `
    /* Make cats after dogs glow */
    FIXME {
      filter: drop-shadow(3px 3px 8px red);
    }
  `,
  solution: `
    dog + cat {
      filter: drop-shadow(3px 3px 8px red);
    }
  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [
      pc.checkAll(
        "dog + cat",
        { filter: "drop-shadow(3px 3px 8px red)" },
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
