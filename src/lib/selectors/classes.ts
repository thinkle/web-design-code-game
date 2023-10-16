import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const classChallenge: ChallengeDefinition = {
  title: "Classy Paragraphs",
  language: "css",
  height: 240,
  instructions: `
# Highlight the "important" paragraphs
Go ahead and highlight the important paragraphs in yellow
by using a *class* selector.

## Picking out elements

So far, all my examples used different elements (and I didn't even use
real elements &mdash; I used pretend ones for fun).

In actual HTML, we often need to distinguish between tags that are otherwise
similar. For this reason, you can add a \`class\` attribute to *any* element
with one or more class names, like this:

\`\`\`html
<div class="important info">
  This part has important info
</div>
<div class="info">
  This part has regular info.
</div>
\`\`\`

You can then *select* classes by prefixing the class name with
a **dot**.

\`\`\`
.info {
  font-weight: normal;
}
.important {
  font-weight: bold;
}
\`\`\`

\`\`\`
  `,
  html: `
<p>This is a boring paragraph. 
  You can tell because there
    are no cats in it.
</p>
<p class="important">This is an
  important paragraph which 
  includes a cat: 
  <cat></cat>
</p>
<p>This is another unimportant
  paragraph.
  </p>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
  `,
  starterCode: `
    FIXME {
      background-color: yellow;
      border-right: 3px solid red;
      padding-right: 1em;       
    }
  `,
  solution: `  
  .important {
      background-color: yellow;
      border-right: 3px solid red;
      padding-right: 1em;       
    }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    let items = [
      pc.checkOne(
        ".important",
        { "background-color": "yellow" },
        (expected, actual) =>
          `Unexpected color! Got ${actual} instead of ${expected}`,
        "Highlight important paragraph in yellow"
      ),
      pc.checkAllBut(
        "p",
        { "background-color": null },
        [".important"],
        undefined,
        "Leave other paragraphs alone"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
