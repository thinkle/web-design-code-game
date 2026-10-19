import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/autoMargin.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  flexContainerCheck,
  inAColumn,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  result,
} from "./flexChecks";

/** Cats in HTML order: top pair at the top, bottom pair at the bottom? */
function measure(tree: HTMLElement, cats: HTMLElement[]) {
  const t = getContentRect(tree);
  const r = cats.map((cat) => getContentRect(cat));
  const topPair =
    near(r[0].top, t.top, 1.5) && near(r[1].top, r[0].bottom, 1.5);
  const bottomPair =
    near(r[3].bottom, t.bottom, 1.5) && near(r[2].bottom, r[3].top, 1.5);
  return { topPair, bottomPair, column: inAColumn(r) };
}

export const autoMarginChallenge: ChallengeDefinition = {
  title: "The Big Stretch",
  language: "css",
  height: 330,
  instructions,
  html: `
<div class="cat-tree">
  <div class="cat"></div>
  <div class="cat"></div>
  <div class="cat sleepy"></div>
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
  background: linear-gradient(#eef4e6 85%, #cdb38e 85%);
}
.cat-tree {
  border-bottom: 12px solid #7b5a45;
  border-radius: 4px;
  background:
    /* the top perch, under the top two cats */
    linear-gradient(#a1887f, #8d6e63) center 60px / 96px 10px no-repeat,
    /* the post, wrapped in rope */
    repeating-linear-gradient(0deg, #d9b98a 0 5px, #c49a63 5px 7px) center / 20px 100% no-repeat;
}
.sleepy::before {
  content: "💤";
  position: absolute;
  top: -6px;
  right: -16px;
  font-size: 14px;
}
.cat {
  position: relative;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.cat-tree {
  width: 120px;
  height: 260px;
}

WORK
`,
  starterCode: `
.cat-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sleepy {
  FIXME
}
`,
  solution: `
.cat-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sleepy {
  margin-top: auto;
}
`,
  validate(win) {
    const tree = one(win, ".cat-tree")!;
    const cats = all(win, ".cat");
    const now = measure(tree, cats);
    // Make the tree taller for a moment: the bottom cats should follow
    // the bottom, which a fixed margin wouldn't do.
    const oldHeight = tree.style.height;
    tree.style.height = `${tree.getBoundingClientRect().height + 40}px`;
    const taller = measure(tree, cats);
    tree.style.height = oldHeight;

    return result([
      flexContainerCheck(win, tree, "cat tree"),
      {
        name: "Two cats at the top",
        isValid: now.column && now.topPair,
        message:
          "The first two cats should stay at the top of the tree, one on top of the other.",
      },
      {
        name: "The sleepy cats are at the bottom",
        isValid: now.column && now.bottomPair,
        message:
          "The sleepy cat and the cat after it should be down at the bottom of the tree, like the Target.",
      },
      {
        name: "Works for any height of tree",
        isValid: !now.bottomPair || taller.bottomPair,
        message:
          "When the tree gets taller, the sleepy cats don't stay at the bottom. Instead of a number of pixels, what margin takes up all the leftover space?",
      },
      placedByFlexbox(win, cats, "cats", { allowMargins: true }),
      paddingUnchanged(win, tree, "cat tree", {}),
    ]);
  },
};
