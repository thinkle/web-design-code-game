import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/center.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import {
  all,
  flexContainerCheck,
  one,
  paddingUnchanged,
  placedByFlexbox,
  rectsByX,
  result,
} from "./flexChecks";

const SUNBEAM_HALF_WIDTH = 70;

export const centerChallenge: ChallengeDefinition = {
  title: "Sunbeam",
  language: "css",
  height: 140,
  instructions,
  html: `
<div class="rug">
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
.rug {
  box-sizing: border-box;
  border-radius: 10px;
  border: 4px solid #8c3b2e;
  outline: 3px dashed #e2b04a;
  outline-offset: -10px;
  background:
    radial-gradient(
      ellipse ${SUNBEAM_HALF_WIDTH}px 34px at 50% 50%,
      rgba(255, 236, 140, 0.95) 0 80%,
      rgba(255, 236, 140, 0) 100%
    ),
    repeating-linear-gradient(45deg, #b4473a 0 10px, #a33e33 10px 20px);
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.rug {
  width: 300px;
  height: 80px;
  padding-top: 21px;
}

WORK
`,
  starterCode: `
.rug {
  display: flex;
  FIXME
}
`,
  solution: `
.rug {
  display: flex;
  justify-content: center;
}
`,
  validate(win) {
    const rug = one(win, ".rug");
    const cats = all(win, ".cat");
    const rugRect = rug!.getBoundingClientRect();
    const middle = (rugRect.left + rugRect.right) / 2;
    const rects = rectsByX(cats);
    const inSunbeam = rects.every(
      (r) =>
        r.left >= middle - SUNBEAM_HALF_WIDTH &&
        r.right <= middle + SUNBEAM_HALF_WIDTH
    );
    const leftOut = rects.filter((r) => r.right < middle).length;
    const rightOut = rects.filter((r) => r.left > middle).length;
    return result([
      flexContainerCheck(win, rug, "rug"),
      {
        name: "Every cat is in the sunbeam",
        isValid: inSunbeam,
        message:
          leftOut > 1
            ? "Some cats are still out in the cold on the left. The sunbeam is in the middle of the rug."
            : rightOut > 1
            ? "Too far! The sunbeam is in the middle of the rug, not at the end."
            : "Some cats are out in the cold. All three should be together in the middle of the rug.",
      },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, rug, "rug", { top: 21 }),
    ]);
  },
};
