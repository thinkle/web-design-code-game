import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/balance.md?raw";
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
  rectsByX,
  result,
} from "./flexChecks";

const POND_WIDTH = 300;
const CAT = 30;
const COUNT = 4;
// Where space-evenly puts four 30px cats: the leftover 180px is split into
// five equal 36px spaces (both edges and the three gaps).
const SPACE = (POND_WIDTH - COUNT * CAT) / (COUNT + 1);
const STONES = [0, 1, 2, 3].map((i) => SPACE * (i + 1) + CAT * i + CAT / 2);

export const balanceChallenge: ChallengeDefinition = {
  title: "Balancing Act",
  language: "css",
  height: 140,
  instructions,
  html: `
<div class="pond">
  <div class="cat"></div>
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
  padding-top: 20px;
  background: #e9f4e1;
}
.pond {
  border-radius: 40px;
  border: 4px solid #8cbf6e;
  background:
${STONES.map(
  (x) =>
    `    radial-gradient(ellipse 21px 9px at ${x}px 50px, #9e9e9e 0 75%, #7d7d7d 85%, transparent 100%),`
).join("\n")}
    repeating-linear-gradient(170deg, #7ec8e3 0 10px, #74bedb 10px 20px);
}
`,
  css: `
.cat {
  width: ${CAT}px;
  height: ${CAT}px;
}

.pond {
  width: ${POND_WIDTH}px;
  height: 72px;
  padding-top: 20px;
}

WORK
`,
  starterCode: `
.pond {
  display: flex;
  FIXME
}
`,
  solution: `
.pond {
  display: flex;
  justify-content: space-evenly;
}
`,
  validate(win) {
    const pond = one(win, ".pond")!;
    const cats = all(win, ".cat");
    const p = getContentRect(pond);
    const rects = rectsByX(cats);
    const onStones =
      rects.length === COUNT &&
      rects.every((r, i) => near(centerX(r) - p.left, STONES[i], 3));

    let hint =
      "Spread the cats out across the pond, one on each stepping stone, like the Target.";
    if (
      rects.length === COUNT &&
      rects[0].left - p.left < 2 &&
      p.right - rects[COUNT - 1].right < 2
    ) {
      hint =
        "Splash! The outside cats are squished against the edges of the pond. In the Target, there's space outside them too.";
    } else if (
      rects.length === COUNT &&
      centerX(rects[0]) - p.left < STONES[0] - 3 &&
      p.right - centerX(rects[COUNT - 1]) < POND_WIDTH - STONES[COUNT - 1] - 3
    ) {
      hint =
        "Close! The outside cats are a bit too close to the edges. Look at the Target: is the space at the edges the same as the space between the cats?";
    }

    return result([
      flexContainerCheck(win, pond, "pond"),
      { name: "A cat on every stone", isValid: onStones, message: hint },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, pond, "pond", { top: 20 }),
    ]);
  },
};
