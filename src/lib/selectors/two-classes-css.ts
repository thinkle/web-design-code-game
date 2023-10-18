import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const classesChallenge: ChallengeDefinition = {
  title: "Shady Cats",
  language: "css",
  height: 240,
  instructions: `
# Use multiple class selectors

This code has a rule for \`.shadow\` and a rule for \`.dark\`,
but update the rule so that if both \`.dark\` and \`.shadow\`
are present, the shadow turns white.

## Combining selectors

You can put selectors together to select elements
that have more than one class by writing the class
selectors together with no space, like this:

\`.important.dark\` - select elements like \`<div class="dark important">\`

\`\`\`
.info {
  background-color: yellow;
}
.important {
  font-weight: bold;
}
.info.important {
  /* Select items with both
     info and important classes */
  background-color: black;
  color: yellow;  
}
\`\`\`


Note: you can actually chain *any* selectors, so you could also write items like...
\`\`\`
div.important { /* any <div class="important"> */}
li.important {/* any <li class="important"> /* }
/* etc */
\`\`\`
  `,
  html: `  
    <div class="dark">
      <h3>Dark</h3>
      <Cat></Cat>
    </div>
    <div class="shadowed">
      <h3>Shadowed</h3>
      <Cat></Cat>
    </div>    
    <div class="dark shadowed">
      <h3>Dark Shadowed</h3>
      <Cat></Cat>
    </div>  
  `,
  hiddenCSSBefore: catcss + `\nh3 {font-size: small; margin: 0;}`,
  css: `
    .dark {
      background-color: #001;
      color: #ddd;
    }   
    .shadowed {
      /* Black shadow w transparency */
      text-shadow: 3px 8px rgba(0,0,0,0.5);
    }

    WORK

    div {
      width: 30%;
      text-align: center;
    }
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  starterCode: `
    FIXME {
      /* White shadow w transparency */
      text-shadow: 3px 8px rgba(255,255,255,0.5);
    }
  `,
  solution: `  
  .dark.shadowed {
      /* White shadow w transparency */
      text-shadow: 3px 8px rgba(255,255,255,0.5);
    }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    let items = [
      pc.checkOne(
        ".dark.shadowed",
        { "text-shadow": "3px 8px rgba(255,255,255,0.5)" },
        (expected, actual) =>
          `Didn't get white text shadow :-() Got ${actual} instead of ${expected}`,
        "Add a white shadow to 'shadowed' 'dark' elements"
      ),
      pc.checkAllBut(
        ".dark",
        { "text-shadow": null },
        [".dark.shadowed"],
        () => "Dark elements without shadowed should not get a shadow!",
        ".dark"
      ),
      pc.checkAllBut(
        ".shadowed",
        { "text-shadow": "3px 8px rgba(0,0,0,0.5)" },
        [".dark.shadowed"],
        () => "Shadowed elements without dark should get a black shadow!",
        ".shadowed"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
