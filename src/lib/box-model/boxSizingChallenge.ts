import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/box-sizing.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { hasVisibleBorder } from "../validation";

const RAFT_WIDTH = 80;
const RAFT_HEIGHT = 40;
const tolerance = 1;

export const boxSizingChallenge: ChallengeDefinition = {
  title: "Timmy's Raft",
  language: "css",
  height: 160,
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
    align-items: center;
    min-height: 140px;
    background: repeating-linear-gradient(
      170deg,
      #5dade2,
      #5dade2 12px,
      #6cb8e8 12px,
      #6cb8e8 24px
    );
  }
  /* Keep each cat centered on its raft, whatever size the raft is */
  .raft {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 12px;
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
    .timmy-raft {
      border: 8px solid gold;
      padding: 8px;
      FIXME
    }
  `,
  solution: `
    .timmy-raft {
      border: 8px solid gold;
      padding: 8px;
      box-sizing: border-box;
    }
  `,
  validate(contentWindow) {
    const doc = contentWindow.document;
    const timmy = doc.querySelector(".timmy-raft") as HTMLDivElement;
    const friends = Array.from(
      doc.querySelectorAll(".raft:not(.timmy-raft)")
    ) as HTMLDivElement[];
    const items: ValidationItem[] = [];

    const isRaftSized = (raft: HTMLElement) => {
      const rect = raft.getBoundingClientRect();
      return (
        Math.abs(rect.width - RAFT_WIDTH) <= tolerance &&
        Math.abs(rect.height - RAFT_HEIGHT) <= tolerance
      );
    };

    items.push({
      name: "Friends' rafts unchanged",
      message: `Leave the other rafts alone: they should stay ${RAFT_WIDTH}px by ${RAFT_HEIGHT}px.`,
      isValid: friends.every(isRaftSized),
    });

    const timmyRect = timmy.getBoundingClientRect();
    items.push({
      name: "Same size as his friends",
      message: `Timmy's raft is ${Math.round(timmyRect.width)}px by ${Math.round(
        timmyRect.height
      )}px, but his friends' rafts are ${RAFT_WIDTH}px by ${RAFT_HEIGHT}px.`,
      isValid: isRaftSized(timmy),
    });

    // Fixing the size by removing the outline doesn't count
    const style = contentWindow.getComputedStyle(timmy);
    const border = hasVisibleBorder(timmy);
    const borderWidths = [
      style.borderTopWidth,
      style.borderRightWidth,
      style.borderBottomWidth,
      style.borderLeftWidth,
    ].map((w) => parseFloat(w) || 0);
    items.push({
      name: "Gold outline",
      message: "Keep Timmy's gold border all the way around his raft!",
      isValid: border.all && borderWidths.every((w) => w >= 4),
    });

    const paddings = [
      style.paddingTop,
      style.paddingRight,
      style.paddingBottom,
      style.paddingLeft,
    ].map((p) => parseFloat(p) || 0);
    items.push({
      name: "Padding",
      message: "Keep the padding inside Timmy's border!",
      isValid: paddings.every((p) => p >= 4),
    });

    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
