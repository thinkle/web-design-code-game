import type { ChallengeDefinition } from "../types/challenge";

var paddingChallenge: ChallengeDefinition = {
  language: "css",
  instructions: "Move the kitten away from the edge of the box",
  html: '<div class="box"><div class="cat"></div></div>',
  hiddenCSSBefore: `
    .cat {
      background-color: orange;
      position: relative;
    }
    .cat::before {
      top : -20px;
      left  : 0;
      content : "▲"
      color: orange;
      font-size: 32px;
    }
    .cat::after {
      top : -20px;
      right  : 0;
      content : "▲"
      color: orange;
      font-size: 32px;
    }
    .box {
      background-color: beige;
    }
  `,
  css: `
  WORK

  .cat {
    width: 30px;
    height: 30px;
  }
  `,
  starterCode: `
    .box {
      width: 200px;
      height: 200px;
    }
  `,
  solution: `
    .box {
      width: 200px;
      height: 200px;
      padding: 30px;
    }
  `,
}; 

export let challenges : ChallengeDefinition[] = [
  paddingChallenge
]

