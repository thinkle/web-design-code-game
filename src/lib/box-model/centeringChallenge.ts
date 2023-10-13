import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/centering.md?raw";
import { calculateOffsets, isUsingBoxModel } from "../validation";
import catcss from "./css/cat.css?raw";
import maincss from "./css/main.css?raw";
const CAT_SIZE = 30;
const BOX_SIZE = 70;
const ROOM_SIZE = 200;

export const centeringChallenge: ChallengeDefinition = {
  title: "Cat in Box",
  language: "css",
  height: 200,
  instructions,
  html: `
    <div class="room">
      <div class="box">
        <div class="cat"></div>
      </div>
    </div>
  `,
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: "</main>",
  hiddenCSSBefore:
    catcss +
    "\n" +
    maincss +
    "\n" +
    `
    main { 
      background-color: #222;
      width: 100vw;
      height: 100vh;      
    }
    
    .box {            
      background-color: beige;      
    }

    .room {            
      background-color: #0022a0;;      
    }
  `,
  css: `
.cat {
  width: ${CAT_SIZE}px;
  height: ${CAT_SIZE}px;      
}
.box {
  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
}
.room {
  width: ${ROOM_SIZE}px;
  height: ${ROOM_SIZE}px;
}
WORK
  `,
  starterCode: `
    .box {
      
    }

    .room {
      
    }
  `,
  solution: `  
    .room {      
      box-sizing: border-box;
      padding-left: ${(ROOM_SIZE - BOX_SIZE) / 2}px;
      padding-top: ${(ROOM_SIZE - BOX_SIZE) / 2}px;      
    }
    .box {
      box-sizing: border-box;
      padding-top: ${(BOX_SIZE - CAT_SIZE) / 2}px;
      padding-left: ${(BOX_SIZE - CAT_SIZE) / 2}px;
    }

    .cat {      
    }
  `,
  validate(contentWindow) {
    let roomElement = contentWindow.document.querySelector(
      ".room"
    ) as HTMLDivElement;
    let boxElement = roomElement.querySelector(".box") as HTMLDivElement;
    let catElement = boxElement.querySelector(".cat") as HTMLDivElement;

    let items: ValidationItem[] = [];
    let isSolved = true;

    const boxOffsets = calculateOffsets(roomElement, boxElement);
    const catOffsets = calculateOffsets(boxElement, catElement);
    if (!isUsingBoxModel(boxElement, contentWindow)) {
      items.push({
        name: "Use the box model, Luke!",
        message:
          "Your .box element is using something other than the box model",
        isValid: false,
      });
    }
    if (!isUsingBoxModel(roomElement, contentWindow)) {
      items.push({
        name: "Use box model for room!",
        message:
          "Your .room element is using something other than the box model",
        isValid: false,
      });
    }
    // Validate box centering
    if (
      Math.abs(boxOffsets.left - boxOffsets.right) > 5 ||
      Math.abs(boxOffsets.top - boxOffsets.bottom) > 5
    ) {
      items.push({
        name: "Box Centering",
        message: "Ensure the box is centered within the room.",
        isValid: false,
      });
      isSolved = false;
    }

    // Validate cat centering
    if (
      Math.abs(catOffsets.left - catOffsets.right) > 5 ||
      Math.abs(catOffsets.top - catOffsets.bottom) > 5
    ) {
      items.push({
        name: "Cat Centering",
        message: "Ensure the cat is centered within the box.",
        isValid: false,
      });
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
