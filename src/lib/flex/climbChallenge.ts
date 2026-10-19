import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/climb.md?raw";
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

const WALL_HEIGHT = 240;
const CAT = 30;
// Where space-around puts three 30px cats in the wall: each gets
// (240 - 90) / 3 = 50px of space, half above and half below.
const AROUND = (WALL_HEIGHT - 3 * CAT) / 3;
const HOLDS = [0, 1, 2].map((i) => AROUND / 2 + i * (AROUND + CAT) + CAT);

export const climbChallenge: ChallengeDefinition = {
  title: "Climbing Wall",
  language: "css",
  height: 290,
  instructions,
  html: `
<div class="wall">
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
  background: #eef3f7;
}
.wall {
  border-radius: 6px;
  background:
${HOLDS.map(
  (y, i) =>
    `    linear-gradient(${["#e67e22", "#2e86de", "#27ae60"][i]}, ${
      ["#c0651a", "#1f6bb5", "#1e8c4c"][i]
    }) center ${y}px / 56px 9px no-repeat,`
).join("\n")}
    radial-gradient(circle at 20% 30%, #b8a99a 0 3px, transparent 4px) 0 0 / 34px 34px,
    radial-gradient(circle at 70% 75%, #a79888 0 2px, transparent 3px) 0 0 / 26px 26px,
    #cdbfb0;
}
`,
  css: `
.cat {
  width: ${CAT}px;
  height: ${CAT}px;
}

.wall {
  width: 120px;
  height: ${WALL_HEIGHT}px;
}

WORK
`,
  starterCode: `
.wall {
  display: flex;
  flex-direction: column;
  align-items: center;
  FIXME
}
`,
  solution: `
.wall {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
`,
  validate(win) {
    const wall = one(win, ".wall")!;
    const cats = all(win, ".cat");
    const w = getContentRect(wall);
    const rects = rectsByY(cats);
    const middle = (w.left + w.right) / 2;
    const onHolds =
      rects.length === 3 &&
      rects.every(
        (r, i) => near(r.bottom - w.top, HOLDS[i], 3) && near(centerX(r), middle, 2)
      );

    let hint =
      "Spread the cats out from top to bottom, one on each climbing hold, like the Target.";
    if (
      rects.length === 3 &&
      rects[0].top - w.top < 2 &&
      w.bottom - rects[2].bottom < 2
    ) {
      hint =
        "The top and bottom cats are squished against the edges of the wall. In the Target, there's a little space outside them too.";
    } else if (
      rects.length === 3 &&
      rects[0].bottom - w.top > HOLDS[0] + 3 &&
      w.bottom - rects[2].bottom > WALL_HEIGHT - HOLDS[2] + 3
    ) {
      hint =
        "Almost! The top and bottom cats are a little too far from the edges. Which value gives the edges half as much space as the gaps between cats?";
    }

    return result([
      flexContainerCheck(win, wall, "wall"),
      { name: "A cat on every hold", isValid: onHolds, message: hint },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, wall, "wall", {}),
    ]);
  },
};
