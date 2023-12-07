import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/functions3.md?raw";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
export const function3Challenge: ChallengeDefinition = {
  title: "Event Listeners",
  language: "js",
  instructions,
  height: 150,
  hiddenCSSBefore: catcss,
  html: `
    <p>Click to spin a cat!</p>
    <div class="container">
      
    </div>
  `,
  js: `
  // Create a lot of cats...
  var div = document.querySelector('.container');
  for (let i=0; i<100; i++) {
    let cat = document.createElement('cat');    
    div.appendChild(cat);
  }

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
    event.target.classList.toggle("spin");    
  }

  for (let cat of document.querySelectorAll("cat")) {
    // For each cat in the document, add an event listener
    FIXME
  }
  `,
  solution: `  
  function spin (event) {
    event.target.classList.toggle("spin");    
  }

  for (let cat of document.querySelectorAll("cat")) {
    // For each cat in the document, add an event listener
    cat.addEventListener("click", spin);
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
            message: "The cat should have the class 'spin' after click",
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
