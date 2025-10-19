import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker, isElementRotated } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const generalSiblingChallenge: ChallengeDefinition = {
  title: "Full Bed Panic",
  language: "css",
  height: 240,
  instructions: `
# Use the general sibling selector (\`~\`)

The \`~\` selector selects **all** siblings that come **after** another element — not just the next one.

\`\`\`css
h2 ~ p {
  color: red;
}
\`\`\`

This would color every \`<p>\` that follows an \`<h2>\` — not just the first.

## Challenge: Cats Panic

👉 When a **dog** is on the bed, **every cat to its right** flips upside down. Cats to the left don’t notice.  

Tip: \`dog ~ cat\` will select every cat *after* a dog.
  `,
  html: `
  <bed>
    <cat></cat>
    <dog></dog>
    <cat></cat>
    <cat></cat>
    <dog></dog>
    <cat></cat>
    <cat></cat>
  </bed>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    bed {
      display: flex;
      gap: 16px;
      padding: 20px;
      width: 250px;
    }
    cat, dog {
      transition: transform 0.3s ease;
    }

    WORK
  `,
  starterCode: `
    /* Make all cats to the right of a dog flip upside down */
    FIXME {
      transform: rotate(180deg);
    }
  `,
  solution: `
    dog ~ cat {
      transform: rotate(180deg);
    }
  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [];

    // Check: all cats after dogs should be rotated
    const dogElements = Array.from(
      contentWindow.document.querySelectorAll("dog")
    );
    let allCatsAfterDogsRotated = true;

    dogElements.forEach((dog) => {
      let sibling = dog.nextElementSibling;
      while (sibling) {
        if (sibling.tagName === "CAT") {
          if (!isElementRotated(sibling as HTMLDivElement, contentWindow)) {
            allCatsAfterDogsRotated = false;
          }
        }
        sibling = sibling.nextElementSibling;
      }
    });

    items.push({
      name: "Cats after dogs",
      message: allCatsAfterDogsRotated
        ? "All cats after dogs flipped!"
        : "Some cats after dogs did not flip!",
      isValid: allCatsAfterDogsRotated,
    });

    // Check: cats before dogs should NOT be rotated
    const catElements = Array.from(
      contentWindow.document.querySelectorAll("cat")
    );
    let catsBeforeDogsRotated = false;

    catElements.forEach((cat) => {
      // Is there a dog before this cat?
      const prevSiblings = [];
      let sibling = cat.previousElementSibling;
      while (sibling) {
        prevSiblings.push(sibling);
        sibling = sibling.previousElementSibling;
      }
      const hasDogBefore = prevSiblings.some((el) => el.tagName === "DOG");
      if (
        !hasDogBefore &&
        isElementRotated(cat as HTMLDivElement, contentWindow)
      ) {
        catsBeforeDogsRotated = true;
      }
    });

    items.push({
      name: "Cats before dogs",
      message: catsBeforeDogsRotated
        ? "Some cats before dogs flipped (they shouldn't)!"
        : "Cats before dogs stayed calm.",
      isValid: !catsBeforeDogsRotated,
    });

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
