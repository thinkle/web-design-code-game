import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/condo.md?raw";
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
  rectsByY,
  result,
} from "./flexChecks";

const condoHTML = `
  <div class="condo">
    <div class="cat"></div>
    <div class="cat"></div>
    <div class="cat"></div>
  </div>`;

export const condoChallenge: ChallengeDefinition = {
  title: "Cat Condos",
  language: "css",
  height: 260,
  instructions,
  html: `
<div class="street">${condoHTML}${condoHTML}${condoHTML}
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
  background: #dff1fb;
}
.street {
  width: 100%;
  height: 190px;
  /* sidewalk along the bottom */
  border-bottom: 14px solid #b9b2a7;
  box-sizing: content-box;
}
.condo {
  background:
    repeating-linear-gradient(0deg, transparent 0 34px, #b08868 34px 36px),
    #d7b48c;
  border-top: 10px solid #9c4f3c;
  border-radius: 8px 8px 0 0;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.condo {
  width: 46px;
  height: 110px;
}

WORK
`,
  starterCode: `
.street {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
}

.condo {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}
`,
  solution: `
.street {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
}

.condo {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}
`,
  validate(win) {
    const street = one(win, ".street");
    const condos = all(win, ".condo");
    const cats = all(win, ".cat");

    // The condos stand side by side, none overlapping
    const condoRects = rectsByX(condos);
    const sideBySide =
      condoRects.length === 3 &&
      condoRects
        .slice(1)
        .every(
          (r, i) =>
            r.left >= condoRects[i].right - 0.5 &&
            near(r.bottom, condoRects[0].bottom, 2)
        );

    // In each condo, its own cats are stacked up inside it, at the bottom
    let stacked = true;
    let inside = true;
    let atBottom = true;
    for (const condo of condos) {
      const c = getContentRect(condo);
      const rects = rectsByY(all(win, ".cat").filter((cat) => condo.contains(cat)));
      if (
        !rects.every(
          (r, i) =>
            near(centerX(r), centerX(rects[0]), 2) &&
            (i === 0 || r.top >= rects[i - 1].bottom - 0.5)
        )
      ) {
        stacked = false;
      }
      if (
        !rects.every(
          (r) =>
            r.left >= c.left - 1 &&
            r.right <= c.right + 1 &&
            r.top >= c.top - 1 &&
            r.bottom <= c.bottom + 1
        )
      ) {
        inside = false;
      }
      if (!rects.length || !near(rects[rects.length - 1].bottom, c.bottom, 2)) {
        atBottom = false;
      }
    }

    return result([
      flexContainerCheck(win, street, "street"),
      flexContainerCheck(win, condos[0] ?? null, "condo"),
      {
        name: "The condos stand side by side",
        isValid: sideBySide,
        message:
          "The condos should stand next to each other along the street. Which container lines up the condos?",
      },
      {
        name: "The cats are stacked up",
        isValid: stacked,
        message:
          "In each condo, the cats should be one above the other. Which container lines up the cats?",
      },
      {
        name: "Every cat is inside its condo",
        isValid: stacked && inside,
        message: "Some cats are sticking out of their condo!",
      },
      {
        name: "The cats rest at the bottom",
        isValid: stacked && inside && atBottom,
        message:
          "Let the cats rest at the bottom of each condo, like the Target. Which way does justify-content point now?",
      },
      placedByFlexbox(win, cats),
      placedByFlexbox(win, condos, "condos"),
      paddingUnchanged(win, street, "street", {}),
    ]);
  },
};
