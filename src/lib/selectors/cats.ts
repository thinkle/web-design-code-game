import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const flipCatChallenge: ChallengeDefinition = {
  title: "Flip the Cats!",
  language: "css",
  height: 140,
  instructions: `
  ## Selectors

Selectors are the way you pick which elements you want to style with CSS.
The selector always comes on the *left* side of a CSS expression before
all the rules which apply styles.

Here's how it works:
\`\`\`css
/* Select every div */
div {
  /* Turn it's background green...*/
  background-color: green;
}
\`\`\`

# Your challenge: Flip the cats!

Every cat should turn upside down. The rotation rule is already written:
\`\`\`css
transform: rotate(180deg);
\`\`\`
Add the selector so that the rule applies to each cat element.

**Note: for this game, we’re using custom elements like <cat>, <box>, and <chair>.
Selecting these with CSS works just like normal HTML elements like <div> and <span>.**`,
  html: `
  <room>
    <bed>
      <cat></cat>
    </bed>
    <chair>
      <cat></cat>
    </chair>
    <box>
      <cat></cat>
    </box>
    <chair>
      <cat></cat>
    </chair>
  </room>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
  `,
  starterCode: `
    /* Select the cat elements and flip them */
    FIXME {
      transform: rotate(180deg);      
    }
  `,
  solution: `  
  cat {      
    transform: rotate(180deg);
  }
  `,
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    let chair = contentWindow.document.querySelector("chair");
    let box = contentWindow.document.querySelector("box");
    let bed = contentWindow.document.querySelector("bed");
    let cats = contentWindow.document.querySelectorAll("cat");
    let room = contentWindow.document.querySelector("room");
    let allCatsFlipped = true;
    let anyCatsFlipped = false;
    cats.forEach((cat) => {
      if (isElementRotated(cat, contentWindow)) {
        anyCatsFlipped = true;
      } else {
        allCatsFlipped = false;
      }
    });
    if (allCatsFlipped) {
      items.push({ name: "Cats flipped!", isValid: true });
    } else if (anyCatsFlipped) {
      items.push({
        name: "Cats flipped",
        message: "You flipped some but not all!",
        isValid: false,
      });
    } else {
      items.push({
        name: "Flip the cats!",
        message: "The cats want to flip!",
        isValid: false,
      });
    }
    items.push({
      name: "Chair not flipped!",
      message: "Don't flip the chair upside down!",
      isValid: !isElementRotated(chair, contentWindow),
    });
    items.push({
      name: "Box not flipped",
      message: "Don't flip the box!",
      isValid: !isElementRotated(box, contentWindow),
    });
    items.push({
      name: "Bed not flipped",
      message: "Goodness, why would you flip the bed?",
      isValid: !isElementRotated(bed, contentWindow),
    });
    items.push({
      name: "Room not flipped",
      message: "Goodness, why would you flip the room?",
      isValid: !isElementRotated(room, contentWindow),
    });

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
