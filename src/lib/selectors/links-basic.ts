import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";

export const linkChallengeEasy: ChallengeDefinition = {
  title: "Basic Link Styling",
  language: "css",
  height: 260,
  instructions: `
## Styling Links

By default, links are blue and underlined, but in
many designs, we don't want them that way.

# Make the links readable!

Use the \`a\` tag selector to fix the menu links
here by:
- Change the color of all links to white.
- Remove underlines from links.
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
    /* Make menu links white and remove underlines */
    FIXME {
      text-decoration: none;
      color: white;
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
        "a",
        { color: "white" },
        () => "Make links white",
        "Change link color"
      ),
      pc.checkAll(
        "a",
        { "text-decoration-style": "none" },
        () => "Set text-decoration to none",
        "Remove underline"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
