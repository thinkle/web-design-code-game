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
# Make the Cat Respond to a Hovering Mouse

Make the cat background turn black when you hover over it.

**Note: for the computer to know you completed this challenge, you'll have to
hover your mouse over the cat in the *Result* area after fixing the code!**

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
  interactionPrompt: "Now hold your mouse over the cat in the Result to check your work!",
  css: `   
    WORK
  `,
  starterCode: `
    FIXME {
      transition: all 300ms;      
    }
    ANDME {
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
    // Any transition that animates what changes on hover counts, whatever
    // its length (the model uses 500ms). The hidden cat CSS already
    // transitions padding/margin/size, so those don't count.
    const cat = contentWindow.document.querySelector("cat") as HTMLElement;
    const catStyle = contentWindow.getComputedStyle(cat);
    const properties = catStyle.transitionProperty.split(",").map((p) => p.trim());
    const durations = catStyle.transitionDuration
      .split(",")
      .map((d) => parseFloat(d) || 0);
    const hoverDurations = properties
      .map((property, i) => ({
        property,
        // durations repeat if there are fewer of them than properties
        duration: durations[i % durations.length],
      }))
      .filter(({ property }) =>
        ["all", "background", "background-color", "transform"].includes(
          property
        )
      )
      .map(({ duration }) => duration);
    items.push({
      name: "Transition",
      isValid: hoverDurations.some((d) => d > 0),
      message: "Add a smooth transition to the cat",
    });
    // Check once the cat's own transition has finished
    const longest = Math.max(0, ...hoverDurations) * 1000;
    await pc.hoverOne("cat", Math.min(longest, 2000) + 100);
    items.push(
      pc.checkOne(
        "cat",
        {
          "background-color": "black",
        },
        () =>
          "Move your mouse over the cat to make it black! (hint: this won't work until you hover in the preview area)",
        "Hover Effect"
      )
    );
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
