import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const linkChallenge: ChallengeDefinition = {
  title: "Building a Menu",
  language: "css",
  height: 260,
  instructions: `
## Links

Now let's build a full menu with CSS!

- Use \`text-decoration: none\` to remove underlines from links
  in your menu while leaving underlines elsewhere.
- Use \`list-style: none;\` to remove bullets from list items
  in your menu
- Make sure to leave normal lists and links alone.
- Change the color of links in your button from the default blue.
  `,
  html: `
  <nav class="menu">
    <ul class="menu-list">
      <li class="button pink cat">
        <Cat></Cat>
        <a href="#Cats">Cats</a>
      </li>
      <li class="button blue dog">
        <Dog></Dog>
        <a href="#Cats">Dogs</a>        
      </li>
    </ul>
  </nav>
  <article>
    <p>Wow, here is a paragraph.</p>
    <p id="Cats">
      This paragraph is about
      <a href="#">Cats</a>
    </p>
    <p id="Dogs">
      This paragraph is about
      <a href="#">Dogs</a>.
      <ul>
        <li>Dogs bark</li>
        <li>Dogs fetch</li>
        <li>Dogs can't use a litter box</li>
      </ul>
    </p>
  </article>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
    .pink {
      background-color: #fa8a70;      
    }
    .blue {
      background-color: #9a99ef;
      
    }
    .menu-list {
      display: flex;
      gap: 4px;
    }
    .button {
      padding: 8px 16px;
      border-radius: 8px;      
      text-align: center;  
    }
  `,
  starterCode: `
    FIXME {
      text-decoration: none;    
    }
    FIX {
      list-style: none;
    }
    /* FIX: Why isn't this working??? */
    .pink  {
      color : #933; /* red */
      font-weight: bold;
    }
    /* FIX: Why isn't this working??? */
    .blue  {
      color: #ff4; /* yellow */
      font-weight: bold;
    }
  `,
  solution: `  
  .menu-list a {
    text-decoration: none;    
  }
  nav li {
    list-style: none;
  }
  .blue a {
    color: #ff4;
  }
  .pink a {
    color: #933;
  }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    const items = [
      pc.checkAll(
        ".menu-item a",
        { "text-decoration": "none" },
        () => "Remove underlines on menu items!",
        "Menu item links"
      ),
      pc.checkAll(
        ".pink a",
        { color: "#933" },
        () => "Hint: this challenge is all about links!",
        "Red text on pink button"
      ),
      pc.checkAll(
        ".blue a",
        { color: "#ff4" },
        () => "Hint, this challenge is all about links!",
        "Yellow text on blue buttons"
      ),
      pc.checkAll(
        "nav li",
        { "list-style": "none" },
        () => "Use list-style: none to remove bullets",
        "No bullets on nav items"
      ),
      pc.checkAllBut(
        "li",
        { "list-style": "disc" },
        ["nav li"],
        () => "Remember nested selectors!",
        "Leave bullets on lists elsewhere"
      ),
      pc.checkAllBut(
        "a",
        { "text-decoration-line": "underline" },
        ["nav a"],
        () => "Remember nested selectors",
        "Leave underline on links elsewhere"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
