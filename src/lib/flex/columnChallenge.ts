import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/column.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  centerX,
  flexContainerCheck,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  rectsByY,
  result,
} from "./flexChecks";

export const columnChallenge: ChallengeDefinition = {
  title: "Cat Tower",
  language: "css",
  height: 330,
  instructions,
  html: `
<div class="tower">
  <div class="cat"></div>
  <div class="cat"></div>
  <div class="cat"></div>
</div>
`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
main {
  background: linear-gradient(#f6ead7 85%, #d8b48a 85%);
}
.tower {
  border-bottom: 12px solid #7b5a45;
  border-radius: 4px;
  background:
    /* platforms: just under the top, middle and bottom cats */
    linear-gradient(#a1887f, #8d6e63) center 30px / 96px 10px no-repeat,
    linear-gradient(#a1887f, #8d6e63) center calc(50% + 20px) / 96px 10px no-repeat,
    /* the post, wrapped in rope */
    repeating-linear-gradient(0deg, #d9b98a 0 5px, #c49a63 5px 7px) center / 20px 100% no-repeat;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.tower {
  width: 120px;
  height: 260px;
}

WORK
`,
  starterCode: `
.tower {
  display: flex;
  FIXME
}
`,
  solution: `
.tower {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
`,
  validate(win) {
    const tower = one(win, ".tower")!;
    const cats = all(win, ".cat");
    const t = getContentRect(tower);
    const middle = (t.left + t.right) / 2;
    const rects = rectsByY(cats);
    // Where each cat's paws should be: on top of each platform
    const platforms = [t.top + 30, (t.top + t.bottom) / 2 + 15, t.bottom];

    const stacked = rects.every(
      (r, i) => i === 0 || r.top >= rects[i - 1].bottom - 0.5
    );
    const centered = rects.every((r) => near(centerX(r), middle, 2));
    const onPlatforms =
      rects.length === 3 && rects.every((r, i) => near(r.bottom, platforms[i], 2));

    return result([
      flexContainerCheck(win, tower, "tower"),
      {
        name: "The cats are stacked up",
        isValid: stacked,
        message:
          "The cats should be one above the other. Which property changes a row into a column?",
      },
      {
        name: "The cats are in the middle of the tower",
        isValid: stacked && centered,
        message:
          "Line the cats up with the middle of the tower. In a column, which axis goes left and right?",
      },
      {
        name: "A cat on every platform",
        isValid: stacked && onPlatforms,
        message:
          "Spread the cats out so there's one at the top, one in the middle and one at the bottom, like the Target.",
      },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, tower, "tower", {}),
    ]);
  },
};
