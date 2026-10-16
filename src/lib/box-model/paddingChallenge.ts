import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";

import instructions from "./markdown/padding-1.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { getContentRect, isAboutSize, isUsingBoxModel } from "../validation";
const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const PADDING = 20;
const BOX_SIZE = 70;
const threshhold = 5;
// Any visible breathing room counts (the instructions' example uses 8px)
const MIN_ROOM = 8;

export var paddingChallenge: ChallengeDefinition = {
  title: "Cat in a Corner",
  language: "css",
  height: 140,
  instructions,
  html: '\n<div class="box">\n  <div class="cat"></div>\n</div>',
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: `</main>
  `,
  hiddenCSSBefore: maincss + "\n" + catcss,
  css: `
  WORK

  .cat {
    width: ${CAT_WIDTH}px;
    height: ${CAT_HEIGHT}px;
  }
  `,
  starterCode: `
    .box {      
      border: 2px solid brown;
      width: ${BOX_SIZE}px;
      height: ${BOX_SIZE}px;
      FIXME
    }
  `,
  solution: `
    .box {            
      border: 2px solid brown;
      width: ${BOX_SIZE}px;
      height: ${BOX_SIZE}px;
      padding: ${PADDING}px;
      box-sizing: border-box;
    }
  `,
  validate(contentWindow) {
    let catElement = contentWindow.document.querySelector(
      ".cat"
    ) as HTMLDivElement;
    let boxElement = contentWindow.document.querySelector(
      ".box"
    ) as HTMLDivElement;
    let items: ValidationItem[] = [];
    let isSolved = true;
    // Content box = where the cat is drawn. Compare sizes with a tolerance:
    // with browser zoom (common on Chromebooks) a 30px cat can measure 29.99px.
    let catRect = getContentRect(catElement);
    if (!isAboutSize(catRect, CAT_WIDTH, CAT_HEIGHT)) {
      items.push({
        name: "Cat left alone",
        isValid: false,
        message: "Don't change the cat!",
      });
      isSolved = false;
    }

    let boxStyle = contentWindow.getComputedStyle(boxElement);
    let catStyle = contentWindow.getComputedStyle(catElement);
    let boxRect = boxElement.getBoundingClientRect();

    let catOffsetLeft = catRect.left - boxRect.left;
    let catOffsetTop = catRect.top - boxRect.top;
    let catOffsetRight = boxRect.right - catRect.right;
    let catOffsetBottom = boxRect.bottom - catRect.bottom;

    // Validate Padding
    const offsets = [
      catOffsetLeft,
      catOffsetTop,
      catOffsetRight,
      catOffsetBottom,
    ];
    const sides = ["left", "top", "right", "bottom"];
    offsets.forEach((offset, index) => {
      if (offset < MIN_ROOM) {
        items.push({
          name: `Space on ${sides[index]}`,
          isValid: false,
          message: `Kitty needs room on the ${sides[index]}!`,
        });
        isSolved = false;
      } else {
        items.push({
          name: `Space on ${sides[index]}`,
          isValid: true,
          message: `Kitty has space on the ${sides[index]}!`,
        });
      }
    });

    // Validate Box Size
    if (boxRect.width < BOX_SIZE - 1 || boxRect.height < BOX_SIZE - 1) {
      items.push({
        name: "Box size",
        isValid: false,
        message: "Don't shrink the box!",
      });
      isSolved = false;
    }

    /* // Validate box-sizing
    if (boxStyle.boxSizing !== "border-box") {
      items.push({
        name: "Box-sizing",
        isValid: false,
        message: "The box-sizing should be border-box!",
      });
      isSolved = false;
    } */
    // Validate Positioning of .cat
    if (!isUsingBoxModel(catElement, contentWindow)) {
      items.push({
        name: "Use the box!",
        isValid: false,
        message: "Only use the box model to move the kitty!",
      });
      isSolved = false;
    }

    // Validate Positioning of .box
    if (!isUsingBoxModel(boxElement, contentWindow)) {
      items.push({
        name: "Box Positioning",
        isValid: false,
        message: "Ensure the box is using the box model!",
      });
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
