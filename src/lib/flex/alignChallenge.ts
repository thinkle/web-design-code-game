import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/align.md?raw";
import catcss from "../box-model/css/cat.css?raw";
import scenecss from "./css/scene.css?raw";
import { getContentRect } from "../validation";
import {
  all,
  flexContainerCheck,
  near,
  one,
  paddingUnchanged,
  placedByFlexbox,
  result,
} from "./flexChecks";

export const alignChallenge: ChallengeDefinition = {
  title: "Floating Cats",
  language: "css",
  height: 240,
  instructions,
  html: `
<div class="room">
  <div class="cat"></div>
  <div class="scratcher"></div>
  <div class="cat"></div>
  <div class="plant"></div>
</div>
`,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    scenecss +
    `
.room {
  border-bottom: 18px solid #b07a4a;
  box-shadow: 0 4px 0 #8a5a33;
  background:
    /* a picture on the wall */
    linear-gradient(#cfe8f7, #cfe8f7) 64% 30px / 54px 38px no-repeat,
    linear-gradient(#a37a50, #a37a50) 64% 25px / 64px 48px no-repeat,
    /* wallpaper */
    repeating-linear-gradient(90deg, #f6ead7 0 18px, #efdfc6 18px 20px);
}
.scratcher {
  box-sizing: border-box;
  border-top: 10px solid #8d6e63;
  border-bottom: 8px solid #8d6e63;
  border-radius: 3px;
  background: repeating-linear-gradient(
    0deg, #d9b98a 0 4px, #c49a63 4px 6px
  );
}
.plant {
  position: relative;
}
.plant::after {
  content: "🪴";
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 40px;
  line-height: 1;
}
`,
  css: `
.cat {
  width: 30px;
  height: 30px;
}

.scratcher {
  width: 26px;
  height: 110px;
}

.plant {
  width: 44px;
  height: 50px;
}

.room {
  width: 300px;
  height: 160px;
}

WORK
`,
  starterCode: `
.room {
  display: flex;
  justify-content: space-around;
  FIXME
}
`,
  solution: `
.room {
  display: flex;
  justify-content: space-around;
  align-items: end;
}
`,
  validate(win) {
    const room = one(win, ".room")!;
    const things = all(win, ".room > *");
    const floor = getContentRect(room).bottom;
    const onFloor = things.filter((el) =>
      near(el.getBoundingClientRect().bottom, floor, 1.5)
    );
    const everythingHigh = things.every(
      (el) => el.getBoundingClientRect().bottom < floor - 20
    );
    const roomRect = room.getBoundingClientRect();
    const rects = things.map((el) => el.getBoundingClientRect());
    const middles = rects.map((r) => (r.top + r.bottom) / 2);
    const allCentered = middles.every((m) => near(m, middles[0], 1.5));
    const xs = rects.map((r) => r.left).sort((a, b) => a - b);
    const stillSpread =
      xs.length === 4 && xs[0] > roomRect.left + 5 && xs[3] < roomRect.right - 50;
    return result([
      flexContainerCheck(win, room, "room"),
      {
        name: "Everything stands on the floor",
        isValid: onFloor.length === things.length,
        message: allCentered
          ? "Now they're lined up through the middle of the room. Bring them all the way down to the floor."
          : everythingHigh
          ? "Things are still floating! Which way does the cross axis go in a row?"
          : "Some things are still off the floor. Every item should touch the floor, like the Target.",
      },
      {
        name: "Still spread around the room",
        isValid: stillSpread,
        message: "Keep the items spread out across the room like before.",
      },
      placedByFlexbox(win, things, "items in the room"),
      paddingUnchanged(win, room, "room", {}),
    ]);
  },
};
