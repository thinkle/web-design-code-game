import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";

import type { ValidationItem } from "../../types/validation";
export const twoClassChallenge: ChallengeDefinition = {
  title: "Classy HTML",
  language: "html",
  height: 250,
  instructions: `
# Using multiple classes
Designers often use more than one class, separated by spaces, to create
a design "system" out of CSS.

Add the classes for \`card\`, \`centered\` and \`dark\` to the div to make an emo cat.

## About Multiple classes?

\`\`\`html
<p class="larger highlighted">
  An important paragraph.
</p>
<p>A normal paragraph with a 
  <span class="highlighted">highlighted item</span>
</p>
\`\`\`
  `,
  html: `
  WORK
  `,
  hiddenCSSBefore: catcss,
  css: `   
.dark {
  background-color: #120012;
  color: #dfefdf;  
}
.card {
  box-shadow: 3px 3px #2227;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 16px;
  height: 200px;
  width: 200px;
}
.centered {
   display: grid;
   place-content: center;
   text-align: center;
}   
  `,
  starterCode: `
    <div>
      <cat></cat>
    </div>
  `,
  solution: `  
  <div class="dark centered card">
    <cat></cat>
  </div>
  `,
  validate(contentWindow) {
    const d = contentWindow.document;
    const div = d.querySelector("div") as HTMLDivElement;
    const cat = d.querySelector("div cat") as HTMLDivElement;
    let items: ValidationItem[];

    if (div && cat) {
      items = [
        {
          name: "Has card class",
          message: "Add the class 'card' to the div!",
          isValid: div?.classList?.contains("card"),
        },
        {
          name: "Has dark class",
          message: "Add the class 'dark' to the div!",
          isValid: div?.classList?.contains("dark"),
        },
        {
          name: "Has centered class",
          message: "Add the class 'centered' to the div!",
          isValid: div?.classList?.contains("centered"),
        },
      ];
    } else {
      items = [
        {
          name: "Has <div> element",
          message: "You need a div!",
          isValid: div,
        },
        {
          name: "Has <cat></cat> inside <div>",
          message: "Put a cat in the div!",
          isValid: cat,
        },
      ];
    }

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
