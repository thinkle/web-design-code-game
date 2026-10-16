import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/row.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import {
  all,
  flexContainerCheck,
  inARow,
  one,
  placedByFlexbox,
  rectsByX,
  result,
} from "./flexChecks";

export const rowChallenge: ChallengeDefinition = {
  title: "Warm-Up Stretch",
  language: "css",
  height: 220,
  instructions,
  html: `
<div class="window">
  <div class="windowsill">
    <div class="cat"></div>
    <div class="cat"></div>
    <div class="cat"></div>
  </div>
</div>
`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
.window {
  width: 300px;
  height: 160px;
  box-sizing: border-box;
  border: 10px solid #fdfbf7;
  border-bottom: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  /* sky, a sun, and the window's crossbars */
  background:
    linear-gradient(#fdfbf7, #fdfbf7) 50% 0 / 8px 100% no-repeat,
    linear-gradient(#fdfbf7, #fdfbf7) 0 45% / 100% 8px no-repeat,
    radial-gradient(circle at 78% 22%, #ffe27a 0 14px, transparent 15px),
    linear-gradient(#8fd0f5, #d8f1ff 70%, #b9e3a8 70%);
  display: flex;
  flex-direction: column;
  justify-content: end;
}
.windowsill {
  border-bottom: 12px solid #b9824f;
  box-shadow: 0 6px 0 #8a5a33;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.windowsill {
  padding: 0 16px;
}

WORK
`,
  starterCode: `
.windowsill {
  FIXME
}
`,
  solution: `
.windowsill {
  display: flex;
}
`,
  validate(win) {
    const sill = one(win, ".windowsill");
    const cats = all(win, ".cat");
    return result([
      flexContainerCheck(win, sill, "windowsill"),
      {
        name: "The cats sit side by side",
        isValid: inARow(rectsByX(cats)),
        message:
          "The cats should sit next to each other in one row, like in the Target.",
      },
      placedByFlexbox(win, cats),
    ]);
  },
};
