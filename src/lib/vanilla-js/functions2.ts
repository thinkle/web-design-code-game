import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/functions2.md?raw";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
export const function2Challenge: ChallengeDefinition = {
  title: "Event Targets",
  language: "js",
  instructions,
  height: 150,
  hiddenCSSBefore: catcss,
  html: `
    <p>Make them spin Individually!</p>
    <div class="container">
      <cat  onclick="spin(event)" id="kim"></cat>
      <cat  onclick="spin(event)" id="miguel"></cat>
      <cat  onclick="spin(event)" id="marisol"></cat>
    </div>
  `,
  js: `
  WORK
  `,
  css: `
  cat {
    transition: all 1s linear;
  }
  cat.spin {
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
  
  `,
  starterCode: `    
  function spin (event) {
    // The "event" is the "click" event
    // that was triggered by the user.
    // Use event.target to refer to the 
    // cat that was clicked
    FIXME    
  }
  `,
  solution: `  
  function spin (event) {
    console.log('Spin!',event)
    event.target.classList.toggle('spin');        
  }
  `,
  validate: (contentWindow) => {
    let pc = new PropertyChecker(contentWindow);
    let div = contentWindow.document.querySelector("div") as HTMLDivElement;
    let button = contentWindow.document.querySelector(
      "cat"
    ) as HTMLButtonElement;
    return new Promise((resolve) => {
      for (let c of contentWindow.document.querySelectorAll("cat")) {
        c.addEventListener("click", checkSpin);
      }
      function checkSpin(e: MouseEvent) {
        let items = [
          {
            name: "Click to Spin",
            isValid: e.target.classList.contains("spin"),
            message: "The container should have the class 'spin' after click",
          },
        ];
        setTimeout(() => {
          resolve({
            isSolved: items.every((item) => item.isValid),
            items,
          });
        }, 500);
      }
    });
  },
};
