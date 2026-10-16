import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/nest.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  centerY,
  inAColumn,
  near,
  one,
  rectsByY,
  result,
} from "./flexChecks";

export const nestChallenge: ChallengeDefinition = {
  title: "Strike a Pose",
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
.photo {
  box-sizing: border-box;
  border: 12px solid #a0673a;
  outline: 3px solid #7a4a25;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  background:
    radial-gradient(circle at 30% 30%, #fff8e7, transparent 60%),
    linear-gradient(135deg, #fde2c8, #f7c9d6);
}
.mom {
  position: relative;
}
.mom::before {
  content: "👑";
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 1;
  z-index: 1;
}
.kitten::after {
  font-size: 19px;
  align-items: end;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.photo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 260px;
  height: 180px;
  padding: 0 40px;
}

.kittens {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
`,
  starterCode: `<div class="photo">
  <div class="cat mom"></div>
  <div class="cat kitten"></div>
  <div class="cat kitten"></div>
  <div class="cat kitten"></div>
</div>
`,
  solution: `<div class="photo">
  <div class="cat mom"></div>
  <div class="kittens">
    <div class="cat kitten"></div>
    <div class="cat kitten"></div>
    <div class="cat kitten"></div>
  </div>
</div>
`,
  validate(win) {
    const photo = one(win, ".photo");
    const mom = one(win, ".mom");
    const kittens = all(win, ".kitten");
    if (!photo || !mom || kittens.length !== 3) {
      return result([
        {
          name: "Everyone is in the photo",
          isValid: false,
          message:
            "Keep the .photo, Mama Cat and all three kittens in your HTML. Use Restart if you need a fresh start.",
        },
      ]);
    }
    const p = getContentRect(photo);
    const m = getContentRect(mom);
    const k = rectsByY(kittens);
    const column = inAColumn(k);
    const kLeft = Math.min(...k.map((r) => r.left));
    const kRight = Math.max(...k.map((r) => r.right));
    const inside = [m, ...k].every(
      (r) =>
        r.left >= p.left - 1 &&
        r.right <= p.right + 1 &&
        r.top >= p.top - 1 &&
        r.bottom <= p.bottom + 1
    );
    const columnMiddle = (k[0].top + k[2].bottom) / 2;
    return result([
      {
        name: "The kittens are stacked in a column",
        isValid: column,
        message:
          "The kittens should be one above the other. Which CSS rule makes a column? What needs that class?",
      },
      {
        name: "Mama on the left, kittens on the right",
        isValid:
          near(m.left, p.left, 2) && near(kRight, p.right, 2) && m.right < kLeft,
        message:
          "Mama Cat should be at the left edge of the photo and the kittens at the right edge.",
      },
      {
        name: "Everyone fits in the frame",
        isValid: inside && near(centerY(m), columnMiddle, 2),
        message:
          "Everyone should be inside the photo, lined up across the middle like the Target.",
      },
    ]);
  },
};
