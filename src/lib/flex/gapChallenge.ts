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
  title: "Elbow Room",
  language: "css",
  height: 140,
  instructions,
  html: `
<div class="mat">
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
  padding-top: 24px;
}
.mat {
  box-sizing: border-box;
  border-radius: 40px;
  border: 5px solid #6f9a5b;
  background: repeating-linear-gradient(
    90deg, #a9cf8f 0 8px, #9cc483 8px 16px
  );
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.mat {
  width: 300px;
  height: 70px;
  padding-top: 15px;
}

WORK
`,
  starterCode: `
.mat {
  display: flex;
  FIXME
}
`,
  solution: `
.mat {
  display: flex;
  justify-content: center;
  gap: ${GAP}px;
}
`,
  validate(win) {
    const mat = one(win, ".mat")!;
    const cats = all(win, ".cat");
    const rects = rectsByX(cats);
    const gaps = gapsX(rects);
    const m = mat.getBoundingClientRect();
    const leftSpace = rects[0].left - m.left;
    const rightSpace = m.right - rects[rects.length - 1].right;
    const spaced = gaps.every((g) => near(g, GAP, 1.5));
    const tooClose = gaps.some((g) => g < GAP - 1.5);
    return result([
      flexContainerCheck(win, mat, "mat"),
      {
        name: "24px between neighbors",
        isValid: inARow(rects) && spaced,
        message: tooClose
          ? "The cats are too close together! They want 24px between each cat and the next."
          : "The cats are too far apart. They want exactly 24px between neighbors.",
      },
      {
        name: "Together in the middle of the mat",
        isValid: near(leftSpace, rightSpace, 3),
        message: "The group of cats should be in the middle of the mat.",
      },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, mat, "mat", { top: 15 }),
    ]);
  },
};
