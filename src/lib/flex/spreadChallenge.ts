import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/spread.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
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

export const spreadChallenge: ChallengeDefinition = {
  title: "Stretching Room",
  language: "css",
  height: 140,
  instructions,
  html: `
<div class="fence">
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
}
.fence {
  box-sizing: border-box;
  border-radius: 6px;
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


WORK
`,
  starterCode: `
.fence {
  display: flex;
  FIXME
}
`,
  solution: `
.fence {
  display: flex;
  justify-content: space-between;
}
`,
  validate(win) {
    const fence = one(win, ".fence")!;
    const fenceCats = rectsByX(all(win, ".fence .cat"));

    const f = fence.getBoundingClientRect();
    const posts = [f.left + 15, (f.left + f.right) / 2, f.right - 15];
    const onPosts =
      fenceCats.length === 3 &&
      fenceCats.every((r, i) => near(centerX(r), posts[i], 4));

    let fenceHint =
      "Put one cat on each fence post: the first and last cats go all the way to the ends.";
    if (fenceCats.length === 3 && near(centerX(fenceCats[1]), posts[1], 4)) {
      fenceHint =
        "Close! The middle cat is on its post, but the outside cats should go all the way to the ends of the fence.";
    }

    return result([
      flexContainerCheck(win, fence, "fence"),
      {
        name: "A cat on every fence post",
        isValid: onPosts,
        message: fenceHint,
      },
      placedByFlexbox(win, all(win, ".cat")),
      paddingUnchanged(win, fence, "fence", { top: 18 }),
    ]);
  },
};
