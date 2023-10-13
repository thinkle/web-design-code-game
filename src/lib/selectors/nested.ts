import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const nestedChallenge: ChallengeDefinition = {
  title: "Jumping on Beds",
  language: "css",
  height: 140,
  instructions: `
## Turn the Cat on the Bed Upside Down
Cats on beds can't help but be silly: turn the
cat on the bed upside down!

Use *descendant* selectors to select only
the cat on the bed.

### Selectors

You can chain two selectors together with a space between
them to select descendants.

So, if you write: \`parent descendant\`, that will select
any matching descendant *inside* of parent.

Here's how it works:
\`\`\`css
/* Select every <a> inside of <nav> */
nav a {
  /* don't underline it! */
  text-decoration: none;
}
\`\`\`
  `,
  html: `
  <room style="display:flex">
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
    FIXME {
      transform: rotate(180deg);      
    }
  `,
  solution: `  
  bed cat {      
    transform: rotate(180deg);
  }
  `,
  validate(contentWindow) {
    let items: ValidationItem[] = [];

    let chair = contentWindow.document.querySelector("chair") as HTMLDivElement;
    let box = contentWindow.document.querySelector("box") as HTMLDivElement;
    let bed = contentWindow.document.querySelector("bed") as HTMLDivElement;

    let bedCat = contentWindow.document.querySelector(
      "bed cat"
    ) as HTMLDivElement;
    items.push({
      name: "Cat on the bed!",
      message: "The cat on the bed wants to flip!",
      isValid: isElementRotated(bedCat, contentWindow),
    });
    let allCats = contentWindow.document.querySelectorAll("cat");
    let otherCatsFlipped = false;
    allCats.forEach((cat) => {
      if (isElementRotated(cat, contentWindow)) {
        if (cat != bedCat) {
          otherCatsFlipped = true;
        }
      }
    });
    if (otherCatsFlipped) {
      items.push({
        name: "The other cats flipped?!?",
        message: "Only flip the cat on the bed!",
        isValid: false,
      });
    }
    items.push({
      name: "Chair!",
      message: "Don't flip the chair!",
      isValid: !isElementRotated(chair, contentWindow),
    });
    items.push({
      name: "Box",
      message: "Don't flip the box!",
      isValid: !isElementRotated(box, contentWindow),
    });
    items.push({
      name: "Bed",
      message: "Goodness, why would you flip the bed?",
      isValid: !isElementRotated(bed, contentWindow),
    });

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
