import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/spread.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import {
  all,
  centerX,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  rectsByX,
  result,
} from "./flexChecks";

export const spreadChallenge: ChallengeDefinition = {
  title: "Spread Out",
  language: "css",
  height: 220,
  instructions,
  html: `
<div class="fence">
  <div class="cat"></div>
  <div class="cat"></div>
  <div class="cat"></div>
</div>

<div class="floor">
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
  gap: 14px;
}
.fence {
  box-sizing: border-box;
  border-radius: 6px 6px 0 0;
  background:
    /* three posts: left, middle, right */
    linear-gradient(#9a6a3c, #7d5430) left bottom / 30px 32px no-repeat,
    linear-gradient(#9a6a3c, #7d5430) center bottom / 30px 32px no-repeat,
    linear-gradient(#9a6a3c, #7d5430) right bottom / 30px 32px no-repeat,
    /* two rails */
    linear-gradient(transparent 50px, #b98a59 50px 56px, transparent 56px 66px, #b98a59 66px 72px, transparent 72px),
    /* grass and sky */
    linear-gradient(#bfe6fb, #e5f6ff 80%, #9fd17e 80%);
}
.floor {
  box-sizing: border-box;
  border-radius: 0 0 6px 6px;
  border-bottom: 6px solid #c9a27a;
  background:
    /* four cushions, one in the middle of each quarter of the floor */
    radial-gradient(ellipse 24px 10px at 50% 46px, #e8798d 0 85%, #c75a6f 90%, transparent 100%)
      0 0 / 25% 100% repeat-x,
    repeating-linear-gradient(90deg, #f0dcc0 0 28px, #e8d1b2 28px 30px);
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.fence {
  width: 300px;
  height: 80px;
  padding-top: 18px;
}

.floor {
  width: 300px;
  height: 64px;
  padding-top: 14px;
}

WORK
`,
  starterCode: `
.fence {
  display: flex;
  FIXME
}

.floor {
  display: flex;
}
`,
  solution: `
.fence {
  display: flex;
  justify-content: space-between;
}

.floor {
  display: flex;
  justify-content: space-around;
}
`,
  validate(win) {
    const fence = one(win, ".fence")!;
    const floor = one(win, ".floor")!;
    const fenceCats = rectsByX(all(win, ".fence .cat"));
    const floorCats = rectsByX(all(win, ".floor .cat"));

    const f = fence.getBoundingClientRect();
    const posts = [f.left + 15, (f.left + f.right) / 2, f.right - 15];
    const onPosts =
      fenceCats.length === 3 &&
      fenceCats.every((r, i) => near(centerX(r), posts[i], 4));

    const fl = floor.getBoundingClientRect();
    const cushions = [1, 3, 5, 7].map((n) => fl.left + (fl.width * n) / 8);
    const onCushions =
      floorCats.length === 4 &&
      floorCats.every((r, i) => near(centerX(r), cushions[i], 5));

    let fenceHint =
      "Put one cat on each fence post: the first and last cats go all the way to the ends.";
    if (fenceCats.length === 3 && near(centerX(fenceCats[1]), posts[1], 4)) {
      fenceHint =
        "Close! The middle cat is on its post, but the outside cats should go all the way to the ends of the fence.";
    }
    let floorHint =
      "Each cat needs its own cushion. Compare with the Target: is there space at the outside edges too?";
    if (floorCats.length === 4 && near(floorCats[0].left, fl.left, 2)) {
      floorHint =
        "The outside cats are squished against the edges. In the Target, there's a little space outside them too.";
    } else if (
      floorCats.length === 4 &&
      centerX(floorCats[0]) > cushions[0] + 5 &&
      centerX(floorCats[3]) < cushions[3] - 5
    ) {
      floorHint =
        "Almost! The outside cats are a little too far from the edges. Which value gives the edges less space than the gaps between the cats?";
    }

    return result([
      {
        name: "A cat on every fence post",
        isValid: onPosts,
        message: fenceHint,
      },
      {
        name: "A cat on every cushion",
        isValid: onCushions,
        message: floorHint,
      },
      placedByFlexbox(win, all(win, ".cat")),
      paddingUnchanged(win, fence, "fence", { top: 18 }),
      paddingUnchanged(win, floor, "floor", { top: 14 }),
    ]);
  },
};
