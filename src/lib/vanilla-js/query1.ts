import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/query1.md?raw";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
export const query1Challenge: ChallengeDefinition = {
  title: "Query Selector",
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
      "FIXME"
    )
    // and in its CSS style...
    .style
    // set its "filter" to "invert(1)
    .filter = 'invert(1)';
  `,
  solution: `  
  document
    .querySelector(
      '#miguel'
    )
    .style
    .filter = 'invert(1)';
  `,
  validate: (contentWindow) => {
    let pc = new PropertyChecker(contentWindow);
    let miguel = contentWindow.document.querySelector(
      "#miguel"
    ) as HTMLDivElement;
    let items = [pc.checkCSSProperty(miguel, "filter", "invert(1)")];
    return {
      isSolved: items.every((item) => item.isValid),
      items,
    };
  },
};
