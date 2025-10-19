import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker, validatePseudoSelector } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const firstLineChallenge: ChallengeDefinition = {
  title: "Dear Diary",
  language: "css",
  height: 260,
  instructions: `
# Style the first line of text with \`::first-line\`

The \`::first-line\` pseudo-element lets you style **only the first line** of a block of text.  
The exact amount of text affected depends on the container’s width and wrapping.

\`\`\`css
p::first-line {
  font-weight: bold;
  color: red;
}
\`\`\`

This would make only the first line of each paragraph bold and red.

## Challenge: Fancy First Lines

👉 Make the **first line** of each diary entry bold and a different color, like a dramatic opening line of a cat diary.
  `,
  html: `
  <entry>
    <p>
      Dear Diary, today the humans failed to open the treat bag fast enough.  
      It was tragic. I considered a lawsuit. Or biting.
    </p>
    <p>
      Dear Diary, the sunbeam was perfect. The dog, however, was not.
      I stared him down for seven minutes straight.
    </p>
  </entry>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    entry {
      display: block;
      max-width: 360px;
      font-family: Georgia, serif;
      line-height: 1.5;
    }
    p {
      margin-bottom: 16px;
      padding: 10px;
      border: 1px solid #ccc;
      background: #fafafa;
    }

    WORK
  `,
  starterCode: `
    /* Make the first line dramatic */
    FIXME {
      font-weight: bold;
      color: purple;
    }
  `,
  solution: `
    p::first-line {
      font-weight: bold;
      color: purple;
    }
  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [
      validatePseudoSelector(
        contentWindow,
        "p::first-line",
        {
          "font-weight": "bold",
          color: "purple",
        },
        "Fancy first line"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
