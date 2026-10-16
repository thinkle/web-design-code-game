import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/box-sizing.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { getContentRect, hasVisibleBorder } from "../validation";

const RAFT_WIDTH = 80;
const RAFT_HEIGHT = 64;
const tolerance = 1;
// How close Timmy's cat may get to the inside of his border
const MIN_ROOM = 4;

export const boxSizingChallenge: ChallengeDefinition = {
  title: "Timmy's Raft",
  language: "css",
  height: 180,
  instructions,
  html: `
    <div class="raft"><div class="cat"></div></div>
    <div class="raft timmy-raft"><div class="cat"></div></div>
    <div class="raft"><div class="cat"></div></div>
  `,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    maincss +
    "\n" +
    catcss +
    `
  main {
    display: block;
    text-align: center;
    padding: 24px 0;
    min-height: 140px;
    background: repeating-linear-gradient(
      170deg,
      #5dade2,
      #5dade2 12px,
      #6cb8e8 12px,
      #6cb8e8 24px
    );
  }
  /* Line the rafts up on the water */
  .raft {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    margin: 4px 8px;
    border-radius: 4px;
  }
  .timmy-raft .cat::after {
    content: "😼";
  }
  `,
  css: `
    .cat {
      width: 30px;
      height: 30px;
    }

    .raft {
      background-color: tan;
      width: ${RAFT_WIDTH}px;
      height: ${RAFT_HEIGHT}px;
    }

    WORK
  `,
  starterCode: `
    .raft {
      padding: 8px;
      FIXME
    }

    .timmy-raft {
      border: 8px solid gold;
    }
  `,
  solution: `
    .raft {
      padding: 8px;
      box-sizing: border-box;
    }

    .timmy-raft {
      border: 8px solid gold;
    }
  `,
  validate(contentWindow) {
    const doc = contentWindow.document;
    const timmy = doc.querySelector(".timmy-raft") as HTMLDivElement;
    const timmyCat = timmy.querySelector(".cat") as HTMLDivElement;
    const friend = doc.querySelector(
      ".raft:not(.timmy-raft)"
    ) as HTMLDivElement;
    const items: ValidationItem[] = [];

    items.push({
      name: "Gold outline",
      message: "Timmy is special: give his raft a border all the way around!",
      isValid: hasVisibleBorder(timmy).all,
    });

    // Room between the inside of Timmy's border and his cat
    const style = contentWindow.getComputedStyle(timmy);
    const px = (v: string) => parseFloat(v) || 0;
    const raftRect = timmy.getBoundingClientRect();
    const catRect = getContentRect(timmyCat);
    const room = [
      catRect.top - (raftRect.top + px(style.borderTopWidth)),
      raftRect.right - px(style.borderRightWidth) - catRect.right,
      raftRect.bottom - px(style.borderBottomWidth) - catRect.bottom,
      catRect.left - (raftRect.left + px(style.borderLeftWidth)),
    ];
    items.push({
      name: "Room to breathe",
      message: "Timmy's too close to his border! Give him some padding.",
      isValid: room.every((r) => r >= MIN_ROOM),
    });

    const friendRect = friend.getBoundingClientRect();
    items.push({
      name: "Same size as his friends",
      message: `Timmy's raft is ${Math.round(raftRect.width)}px by ${Math.round(
        raftRect.height
      )}px, but his friends' rafts are ${Math.round(
        friendRect.width
      )}px by ${Math.round(friendRect.height)}px.`,
      isValid:
        Math.abs(raftRect.width - friendRect.width) <= tolerance &&
        Math.abs(raftRect.height - friendRect.height) <= tolerance,
    });

    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
