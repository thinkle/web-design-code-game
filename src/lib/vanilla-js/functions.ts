import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/functions.md?raw";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
export const functionChallenge: ChallengeDefinition = {
  title: "Functions",
  language: "js",
  instructions,
  height: 150,
  hiddenCSSBefore: catcss,
  html: `
    <button onclick="spin()">Make them Spin!</button>
    <div class="container">
      <cat id="kim"></cat>
      <cat id="miguel"></cat>
      <cat id="marisol"></cat>
    </div>      
  `,
  js: `
  WORK
  `,
  css: `
  cat {
    transition: transform 1s linear;
  }
  .spin > cat {
    transform: rotate(360deg);
  }
  
  `,
  starterCode: `    
  function spin () {
    // Code *inside* this function will only
    // run when the button is clicked.
    FIXME
  }
  `,
  solution: `  
  function spin () {
    document.querySelector(
      '.container'
    ).classList.toggle('spin');    
  }
  `,
  validate: (contentWindow) => {
    let pc = new PropertyChecker(contentWindow);
    let div = contentWindow.document.querySelector("div") as HTMLDivElement;
    let button = contentWindow.document.querySelector(
      "button"
    ) as HTMLButtonElement;
    return new Promise((resolve) => {
      button.addEventListener("click", () => {
        setTimeout(() => {
          debugger;
          let items = [
            {
              name: "Click to Spin",
              isValid: div.classList.contains("spin"),
              message: "The container should have the class 'spin' after click",
            },
          ];
          resolve({
            isSolved: items.every((item) => item.isValid),
            items,
          });
        }, 500);
      });
    });
  },
};
