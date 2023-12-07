import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/query2.md?raw";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
export const query2Challenge: ChallengeDefinition = {
  title: "More Queries",
  language: "js",
  instructions,
  height: 150,
  hiddenCSSBefore: catcss,
  html: `
    <div class="container">            
      <cat id="kim"></cat>
      <cat id="miguel"></cat>
      <cat id="marisol"></cat>
    </div>
    <div>
      Use JavaScript to change Miguel
      into night-time colors by adding
      the CSS filter property to him!
    </div>
  
  `,
  js: `
  WORK
  `,
  starterCode: `    
  // From the document (the DOM)
  document
    // Select the cat with id="miguel"
    .querySelector(
      "#miguel"
    )
    // and in its CSS style...
    .style
    // set its "filter" to "invert(1)
    .filter = 'invert(1)';

    // Set Kim's filter to
    // drop-shadow(4px 4px 4px green)
    FIXME

    // Set Marisol's filter to hue-rotation(270deg)
  `,
  solution: `  
  document
    .querySelector(
      '#miguel'
    )
    .style
    .filter = 'invert(1)';
  document.querySelector(
    '#kim'
  ).style.filter = 'drop-shadow(4px 4px 4px green)';
  document.querySelector(
    '#marisol'
  ).style.filter = 'hue-rotate(270deg)';
  `,
  validate: (contentWindow) => {
    let pc = new PropertyChecker(contentWindow);
    let miguel = contentWindow.document.querySelector(
      "#miguel"
    ) as HTMLDivElement;
    let kim = contentWindow.document.querySelector("#kim") as HTMLDivElement;
    let marisol = contentWindow.document.querySelector(
      "#marisol"
    ) as HTMLDivElement;
    let items = [
      pc.checkCSSProperty(
        miguel,
        "filter",
        "invert(1)",
        () => `Miguel's filter should be invert(1)`
      ),
      pc.checkCSSProperty(
        kim,
        "filter",
        "drop-shadow(4px 4px 4px green)",
        () => `Kim's filter should be drop-shadow(4px 4px 4px green)`
      ),
      pc.checkCSSProperty(
        marisol,
        "filter",
        "hue-rotate(270deg)",
        () => `Marisol's filter should be hue-rotate(270deg)`
      ),
    ];
    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
