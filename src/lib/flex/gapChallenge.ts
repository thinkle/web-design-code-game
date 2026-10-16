import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/gap.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import {
  all,
  flexContainerCheck,
  gapsX,
  inARow,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  rectsByX,
  result,
} from "./flexChecks";

const GAP = 24;

export const gapChallenge: ChallengeDefinition = {
  title: "Cat Yoga",
  language: "css",
  height: 150,
  instructions,
  html: `
<div class="studio">
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
  background: #f4efe6;
}
/* A yoga studio with a wooden floor */
.studio {
  box-sizing: border-box;
  border-radius: 10px;
  border: 4px solid #b98b5e;
  background: repeating-linear-gradient(
    90deg, #e2bf8f 0 38px, #d9b483 38px 40px
  );
}
/* Every cat sits on its own yoga mat */
.cat {
  position: relative;
}
.cat::before {
  content: "";
  position: absolute;
  inset: -12px -6px -12px -6px;
  border-radius: 6px;
  background: var(--mat, #7cc6b8);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.35);
  z-index: -1;
}
.cat:nth-child(2) { --mat: #f2a7b8; }
.cat:nth-child(3) { --mat: #b3a6e8; }
.cat:nth-child(4) { --mat: #f6c56b; }
.studio {
  position: relative;
  z-index: 0;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.studio {
  width: 300px;
  height: 90px;
  padding: 26px 8px 0;
}

WORK
`,
  starterCode: `
.studio {
  display: flex;
  FIXME
}
`,
  solution: `
.studio {
  display: flex;
  justify-content: center;
  gap: ${GAP}px;
}
`,
  validate(win) {
    const studio = one(win, ".studio")!;
    const cats = all(win, ".cat");
    const rects = rectsByX(cats);
    const gaps = gapsX(rects);
    const m = studio.getBoundingClientRect();
    const leftSpace = rects[0].left - m.left;
    const rightSpace = m.right - rects[rects.length - 1].right;
    const spaced = gaps.every((g) => near(g, GAP, 1.5));
    const tooClose = gaps.some((g) => g < GAP - 1.5);
    return result([
      flexContainerCheck(win, studio, "studio"),
      {
        name: "24px between neighbors",
        isValid: inARow(rects) && spaced,
        message: tooClose
          ? "The cats are too close together: their mats are bumping! They want 24px between each cat and the next."
          : "The cats are too far apart. They want exactly 24px between neighbors.",
      },
      {
        name: "Together in the middle of the studio",
        isValid: near(leftSpace, rightSpace, 3),
        message: "The class should be in the middle of the studio.",
      },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, studio, "studio", { top: 26, left: 8, right: 8 }),
    ]);
  },
};
