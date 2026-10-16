import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/findCenter.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  centerX,
  centerY,
  keepsSize,
  near,
  paddingUnchanged,
  placedByFlexbox,
  result,
} from "./flexChecks";

// Optional final challenge: the `display: grid; place-content: center`
// shortcut. It is self-contained, so it can be dropped from the set.

const SIZES: { [name: string]: number } = { small: 50, medium: 80, large: 110 };

export const findCenterChallenge: ChallengeDefinition = {
  title: "Find Your Center",
  language: "css",
  height: 170,
  instructions,
  html: `
<div class="shelf">
  <div class="box small"><div class="cat"></div></div>
  <div class="box medium"><div class="cat"></div></div>
  <div class="box large"><div class="cat"></div></div>
</div>
`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
.shelf {
  width: 300px;
  border-bottom: 10px solid #b9824f;
}
.box {
  box-sizing: border-box;
  border: 3px solid #b88a55;
  border-radius: 3px;
  background:
    linear-gradient(90deg, transparent 46%, #d9b07a 46% 54%, transparent 54%),
    linear-gradient(#e8c393, #ddb27c);
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.small {
  width: ${SIZES.small}px;
  height: ${SIZES.small}px;
}

.medium {
  width: ${SIZES.medium}px;
  height: ${SIZES.medium}px;
}

.large {
  width: ${SIZES.large}px;
  height: ${SIZES.large}px;
}

WORK
`,
  starterCode: `
.shelf {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 24px;
}

.box {
  FIXME
}
`,
  solution: `
.shelf {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 24px;
}

.box {
  display: grid;
  place-content: center;
}
`,
  validate(win) {
    const boxes = all(win, ".box");
    const centered = boxes.every((box) => {
      const cat = box.querySelector(".cat");
      if (!cat) return false;
      const c = getContentRect(cat);
      const b = getContentRect(box);
      return near(centerX(c), centerX(b), 2) && near(centerY(c), centerY(b), 2);
    });
    // Either way of centering is fine: flexbox or the grid shortcut
    const usesLayout = boxes.every((box) =>
      /flex|grid/.test(win.getComputedStyle(box).display)
    );
    const sizeItem =
      boxes
        .map((box) => {
          const size = SIZES[box.classList[1]];
          return keepsSize(
            box,
            size,
            size,
            "Keep the boxes their original sizes.",
            "The boxes keep their sizes"
          );
        })
        .find((item) => !item.isValid) ||
      ({ name: "The boxes keep their sizes", isValid: true } as const);
    // Half-centered (often place-content in a flex container) gets its own hint
    const leftRightOnly =
      !centered &&
      boxes.every((box) => {
        const cat = box.querySelector(".cat");
        return !!cat && near(centerX(getContentRect(cat)), centerX(getContentRect(box)), 2);
      });
    const topBottomOnly =
      !centered &&
      boxes.every((box) => {
        const cat = box.querySelector(".cat");
        return !!cat && near(centerY(getContentRect(cat)), centerY(getContentRect(box)), 2);
      });
    let centerHint =
      "Each cat should be right in the middle of its box, both left-right and top-bottom.";
    if (leftRightOnly) {
      centerHint =
        "Left to right is done! Now center the cats from top to bottom too.";
    } else if (topBottomOnly) {
      centerHint =
        "Top to bottom is done! Now center the cats from left to right too.";
    }
    return result([
      {
        name: "Every cat is in the middle of its box",
        isValid: centered,
        message: centerHint,
      },
      {
        name: "The boxes center their cats",
        isValid: usesLayout,
        message:
          "Center the cats by changing the boxes: use flexbox, or the grid shortcut.",
      },
      placedByFlexbox(win, all(win, ".cat"), "cats", {
        name: "The boxes place the cats",
      }),
      sizeItem,
      ...boxes
        .map((box) => paddingUnchanged(win, box, "box", {}, "flexbox or the grid shortcut"))
        .filter((item, i, items) => !item.isValid && items.findIndex((o) => !o.isValid) === i),
    ]);
  },
};
