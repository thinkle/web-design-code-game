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
Highlight the important paragraphs in yellow
by using a *class* selector.

## Picking out elements

In actual web projects, we often need to distinguish between different instances
of the *same tag*. For this reason, you can add a \`class\` attribute to *any* element
with one or more class names, like this:

\`\`\`html
<p class="important">
  This part has important info
</p>
<p>
  This part has regular info.
</p>
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
    /* Target elements with the important class */
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
        (expected, actual) => `Unexpected color`,
        "Highlight the important paragraph"
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
