import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validatePseudoSelector,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const pseudoChallenge: ChallengeDefinition = {
  title: "Pet Peeves",
  language: "css",
  height: 240,
  instructions: `
# Add cats to our list items!
Use a \`::before\` pseudoselector to create a *pseudoelement* before
each list item with a pouty cat!

## About pseudoselectors

You can create new content using CSS by using the \`::before\` and \`::after\`
pseudoselectors. For example, to add the word "hello" after each link, you could
write:

\`\`\`css
a::after {
  content: " hello!";
}
\`\`\`

More typically, you can use pseudoselectors for all kinds of
effects on elements like headings, sections or list items.

\`\`\`css
/* Display blue dashes before list items */
li.item::before {
  content : "-";
  color: blue;
}
li.item {
  list-style: none;
}
\`\`\`

  `,
  hiddenHTMLBefore: "<article style='display:flex;''>",
  hiddenHTMLAfter: "</article>",
  html: `
  <section>
    <div class="title">List of Pet Peeves</div>
    <ul>
      <li>
        Vacuum Cleaners
      </li>
      <li>
        Spray Bottles
      </li>
      <li>
        Car rides
      </li>
      <li>
        Electric Guitars
      </li>
    </ul>
  </section>
  <section class="center">
    <cat></cat>
  </section>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
    li:nth-child(even) {
      background-color: #eef;      
    }
    li:nth-child(odd) {
      background-color: #ffe;
    }
    .center {
      display: grid;
      place-content: center;
      width: 50%;
    }
    .title {
      font-family: cursive;
      font-weight: bold;
      text-decoration: underline;
    }
  `,
  starterCode: `
  /* Add pouty cat before each item */
   FIXME {
      content: "😾";
      font-size: 16px;
      display: grid;
      place-content: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      height: 100%;
    }
    /* Make items into flex containers */
    ANDME {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 32px;      
      min-height: 32px;
    }
  `,
  solution: `  
    li::before {
      content: "😾";
      font-size: 16px;
      display: grid;
      place-content: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      height: 100%;
    }
    li {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 32px;      
      min-height: 32px;
    }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    let items = [
      validatePseudoSelector(
        contentWindow,
        "li::before",
        {
          "font-size": "16px",
          display: "grid",
          position: "absolute",
        },
        "Add pseudo-element before list items!"
      ),
      pc.checkOne(
        "li",
        { "padding-left": "32px" },
        (expected, actual) =>
          `Put 32 pixels of padding on list items to make room for kitty`,
        "Pad list items"
      ),
      pc.checkOne(
        "li",
        { position: "relative" },
        (expected, actual) => `Set position: relative on list items`,
        "Set up positioning on list items"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
