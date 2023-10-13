import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const hoverChallenge: ChallengeDefinition = {
  title: "Hover Magic",
  language: "css",
  height: 240,
  instructions: `
# Hover

Make the cat background turn black when you hover over it.

## Pseudoselectors

You can add \`:hover\` to any selector to make rules that
only apply when you hover the mouse over them.

It's also a good idea in this case to add a 
\`transition\` rule which will make the browser animate
the change so it happens gradually.

For example, to make a button grow slightly when you
hover over it, you can do this:
\`\`\`css
button {
  /* Animate changes to the all properties
  over 300ms - you can also specify
  which properties to transform */
  transition: all 300ms;
}
button:hover {
  /* Zoom in on hover */
  transform: scale(1.1);
}
\`\`\`

Now you do the same, but with the \`<cat>\` element!

  `,
  html: `
  <cat></cat>
  <dog></dog>
  <cat></cat>
  `,
  hiddenCSSBefore: catcss,
  requireHover: true,
  css: `   
    WORK
  `,
  starterCode: `
    FIXME {
      transition: all 300ms;      
    }
    FIXME {
      background-color: black;
      transform: scale(2);
    }
  `,
  solution: `  
  cat {
      transition: all 500ms;      
    }
    cat:hover {
      background-color: black;
      transform: scale(2);
    }
  `,
  async validate(contentWindow) {
    debugger;
    let pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [];
    items.push(
      pc.checkAll(
        "cat",
        { "background-color": null },
        () => "No background in normal state",
        "No mouse, no color"
      )
    );
    items.push(pc.checkOne("cat", { transition: "all 300ms" }));
    await pc.hoverOne("cat", 300);
    items.push(
      pc.checkOne(
        "cat",
        { "background-color": "black" },
        () => "Background changes to black on hover",
        "Move mouse, see effect!"
      )
    );
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
