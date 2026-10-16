import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/move.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import type { RectLike } from "../validation";
import { all, gapsX, inARow, near, one, rectsByX, result } from "./flexChecks";

function inside(r: RectLike, box: Element) {
  const b = box.getBoundingClientRect();
  return (
    r.left >= b.left - 1 &&
    r.right <= b.right + 1 &&
    r.top >= b.top - 1 &&
    r.bottom <= b.bottom + 1
  );
}

export const moveChallenge: ChallengeDefinition = {
  title: "Dog on the Sofa",
  language: "html",
  height: 230,
  instructions,
  html: `WORK`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
main {
  gap: 24px;
  background: linear-gradient(#e9f1f7 62%, #d8c3a5 62%);
}
.sofa {
  box-sizing: border-box;
  border-radius: 16px 16px 6px 6px;
  border: 18px solid #4f7cac;
  border-top: none;
  border-bottom-width: 22px;
  /* the backrest and seat cushions */
  background:
    linear-gradient(90deg, transparent 49.5%, #3d6894 49.5% 50.5%, transparent 50.5%),
    linear-gradient(#6d98c7, #5b88b8);
  box-shadow: 0 6px 0 #2f4f73;
}
.dog-bed {
  box-sizing: border-box;
  border-radius: 50%;
  border: 10px solid #c0763a;
  background: radial-gradient(ellipse at 50% 70%, #f4d3a6, #e6b37a);
}
`,
  css: `
.cat,
.dog {
  width: 30px;
  height: 30px;
}

.sofa {
  display: flex;
  justify-content: space-around;
  align-items: end;
  width: 260px;
  height: 70px;
}

.dog-bed {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 60px;
}
`,
  starterCode: `<div class="sofa">
  <div class="cat"></div>
  <div class="dog"></div>
  <div class="cat"></div>
</div>

<div class="dog-bed">
  <div class="cat"></div>
</div>
`,
  solution: `<div class="sofa">
  <div class="cat"></div>
  <div class="cat"></div>
  <div class="cat"></div>
</div>

<div class="dog-bed">
  <div class="dog"></div>
</div>
`,
  validate(win) {
    const sofa = one(win, ".sofa");
    const bed = one(win, ".dog-bed");
    const dog = one(win, ".dog");
    const cats = all(win, ".cat");
    if (!sofa || !bed || !dog || cats.length !== 3) {
      return result([
        {
          name: "Everyone is still here",
          isValid: false,
          message:
            "Keep the sofa, the dog bed, the dog and all three cats in your HTML. Use Restart if you need a fresh start.",
        },
      ]);
    }
    const rects = rectsByX(cats);
    const gaps = gapsX(rects);
    const sofaRect = sofa.getBoundingClientRect();
    const dogRect = dog.getBoundingClientRect();
    return result([
      {
        name: "The dog is in the dog bed",
        isValid: inside(dogRect, bed) && !inside(dogRect, sofa),
        message: "Move the dog out of the sofa and into the dog bed.",
      },
      {
        name: "All three cats are on the sofa",
        isValid: rects.every((r) => inside(r, sofa)),
        message: "Every cat should be inside the sofa.",
      },
      {
        name: "The cats are spread out on the sofa",
        isValid:
          inARow(rects) &&
          gaps.length === 2 &&
          near(gaps[0], gaps[1], 2) &&
          rects[0].left - sofaRect.left > 20,
        message:
          "The cats should sit in a row, spread out across the sofa like the Target. Is each cat a direct child of the sofa?",
      },
    ]);
  },
};
