import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/end.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
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

export const endChallenge: ChallengeDefinition = {
  title: "Waiting at the Door",
  language: "css",
  height: 140,
  instructions,
  html: `
<div class="hallway">
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
.hallway {
  box-sizing: content-box;
  /* the classroom door, at the far end of the hallway */
  border-right: 40px solid #8d5a3b;
  border-radius: 4px;
  background:
    /* floor */
    linear-gradient(transparent 62px, #c9a27a 62px),
    /* wall */
    #efe3cf;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.hallway {
  width: 250px;
  height: 80px;
  padding-top: 32px;
}

WORK
`,
  starterCode: `
.hallway {
  display: flex;
  FIXME
}
`,
  solution: `
.hallway {
  display: flex;
  justify-content: end;
}
`,
  validate(win) {
    const hallway = one(win, ".hallway")!;
    const cats = all(win, ".cat");
    const rects = rectsByX(cats);
    const h = getContentRect(hallway);
    const last = rects[rects.length - 1];
    const atDoor = !!last && near(last.right, h.right, 2);
    const together = inARow(rects) && gapsX(rects).every((g) => g <= 2);
    return result([
      flexContainerCheck(win, hallway, "hallway"),
      {
        name: "Lined up at the door",
        isValid: atDoor,
        message:
          "The cats want to be first through the door: line them up at the far end of the hallway.",
      },
      {
        name: "Standing together in line",
        isValid: together,
        message: "Keep the cats together in one line, like the Target.",
      },
      placedByFlexbox(win, cats),
      paddingUnchanged(win, hallway, "hallway", { top: 32 }),
    ]);
  },
};
