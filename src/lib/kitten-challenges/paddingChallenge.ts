import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";

import instructions from "./markdown/padding-1.md?raw";
import maincss from "./css/main.css?raw";
import catcss from "./css/cat.css?raw";
import { isUsingBoxModel } from "../validation";
const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const PADDING = 20;
const BOX_SIZE = 70;
const threshhold = 5;

export var paddingChallenge: ChallengeDefinition = {
  language: "css",
  height: 90,
  instructions,
  html: '\n<div class="box">\n  <div class="cat"></div>\n</div>',
  hiddenHTMLBefore: "<main>",
  hiddenHTMLAfter: `</main>
  `,
  hiddenCSSBefore: maincss+'\n'+catcss,
  css: `
  WORK

  .cat {
    width: ${CAT_WIDTH}px;
    height: ${CAT_HEIGHT}px;
  }
  `,
  starterCode: `
    .box {
      box-sizing: border-box; 
      width: ${BOX_SIZE}px;
      height: ${BOX_SIZE}px;

    }
  `,
  solution: `
    .box {      
      box-sizing: border-box; 
      width: ${BOX_SIZE}px;
      height: ${BOX_SIZE}px;
      padding: ${PADDING}px;
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
    let catRect = catElement.getBoundingClientRect();
    if (catRect.width !== CAT_WIDTH || catRect.height !== CAT_HEIGHT) {
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
      if (offset < PADDING - threshhold) {
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
    if (boxRect.width < BOX_SIZE || boxRect.height < BOX_SIZE) {
      items.push({
        name: "Box size",
        isValid: false,
        message: "Don't shrink the box!",
      });
      isSolved = false;
    }

    // Validate box-sizing
    if (boxStyle.boxSizing !== "border-box") {
      items.push({
        name: "Box-sizing",
        isValid: false,
        message: "The box-sizing should be border-box!",
      });
      isSolved = false;
    }    
    // Validate Positioning of .cat
    if (!isUsingBoxModel(catElement,contentWindow)) {
      items.push({
        name: "Use the box!",
        isValid: false,
        message: "Only use the box model to move the kitty!",
      });
      isSolved = false;
    }

    // Validate Positioning of .box
    if (!isUsingBoxModel(boxElement,contentWindow)) {
      items.push({
        name: "Box Positioning",
        isValid: false,
        message:
          "Ensure the box is using the box model!"
      });
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
