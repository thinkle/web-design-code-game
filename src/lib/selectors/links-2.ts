import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";

export const linkChallengeMedium: ChallengeDefinition = {
  title: "Differentiating Link Styling",
  language: "css",
  height: 260,
  instructions: `
## Styling Links

This time, let's make two rulesets, one for
links in our menu (no underline + white), and
one for links in our article (underlined and 
pale blue).

Remember, you can make more specific selectors
by combining parent and child, such as...

\`\`\`css

nav li {
  /* Style list items inside a nav */
}
\`\`\`
  `,
  html: `
  <nav class="menu">
    <ul class="navbar">
      <li><a href="#">Tuna Treats</a></li>
      <li><a href="#">Catnip Toys</a></li>
      <li><a href="#">Cozy Beds</a></li>
      <li><a href="#">Scratching Posts</a></li>
    </ul>
  </nav>
  <article>
    <h1>Kitten Paradise</h1>
    <p>Watch some amazing videos on
    new innovations in
    <a href="#scratching">
      scratching posts
    </a> or advanced techniques for
    <a href="#mice">
      catching mice
    </a>.
    <room>
      <cat></cat>
      <cat></cat>
      <cat></cat>
    </room>
  </article>    
  `,
  hiddenCSSBefore: catcss,
  css: `  
    WORK 
    body {
      color: white;
      background-color: black;
    }
    ul {
      display: flex;
      justify-content: space-between;
      max-width: 400px;
      padding: 8px;
      gap: 8px;
      border-bottom: 1px solid #ccc;
    }
    li {
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 8px;
      list-style: none;
      text-align: center;
    }
  `,
  starterCode: `
    FIXME {
      text-decoration: none;
      color: white;
    }
    ALSOFIX {
      color: lightblue;
    }
    
  `,
  solution: `  
    a {
      text-decoration: none;
      color: white;
    }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    const items = [
      pc.checkAll(
        "nav a",
        { color: "white" },
        () => "Make links white",
        "Menu link color"
      ),
      pc.checkAll(
        "nav a",
        { "text-decoration-style": "none" },
        () => "Set text-decoration to none",
        "Remove underline in menu"
      ),
      pc.checkAll(
        "article a",
        { color: "lightblue" },
        () => "Make links white",
        "Menu link color"
      ),
      pc.checkAll(
        "article a",
        { "text-decoration-style": "underline" },
        () => "Leave other links underlined",
        "Normal links underlined"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
