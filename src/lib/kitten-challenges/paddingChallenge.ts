import type { ChallengeDefinition } from "../../types/challenge";
import type { ValidationItem } from "../../types/validation";
import instructions from "./markdown/padding-1.md?raw";

const CAT_WIDTH = 30;
const CAT_HEIGHT = 30;
const PADDING = 20;
const BOX_SIZE = 70;
const threshhold = 5;

export var paddingChallenge: ChallengeDefinition = {
  language: "css",
  instructions,
  html: '\n<div class="box">\n  <div class="cat"></div>\n</div>',
  hiddenCSSBefore: `
    .cat {
      background-color: orange;
      position: relative;
    }
    .cat::before {
      position: absolute;
      top : -12px;
      left  : 0;
      content : "▲";
      color: orange;
      font-size: 12px;
    }
    .cat::after {
      position: absolute;
      top : -12px;
      right  : 0;
      content : "▲";
      color: orange;
      font-size: 12px;
    }
    .box {
      background-color: beige;
    }
  `,
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
      if (Math.abs(offset - PADDING) > threshhold) {
        items.push({
          name: `Space on ${sides[index]}`,
          isValid: false,
          message: `Needs correct padding on the ${sides[index]}!`,
        });
        isSolved = false;
      } else {
        items.push({
          name: `Space on ${sides[index]}`,
          isValid: true,
          message: `Has correct padding on the ${sides[index]}!`,
        });
      }
    });

    // Validate Box Size
    if (
      boxRect.width !== BOX_SIZE + 2 * PADDING ||
      boxRect.height !== BOX_SIZE + 2 * PADDING
    ) {
      items.push({
        name: "Box size",
        isValid: false,
        message: "The box size is incorrect!",
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
    if (catStyle.position !== "static" || catStyle.display !== "block") {
      items.push({
        name: "Cat Positioning",
        isValid: false,
        message:
          "Ensure the cat is using the box model (position: static, display: block)!",
      });
      isSolved = false;
    }

    // Validate Positioning of .box
    if (boxStyle.position !== "static" || boxStyle.display !== "block") {
      items.push({
        name: "Box Positioning",
        isValid: false,
        message:
          "Ensure the box is using the box model (position: static, display: block)!",
      });
      isSolved = false;
    }

    return {
      isSolved,
      items,
    };
  },
};
