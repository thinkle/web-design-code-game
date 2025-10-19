import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  isElementRotated,
  isUsingBoxModel,
  validateSpaceBetweenElementsLR,
} from "../validation";
import type { ValidationItem } from "../../types/validation";
export const idChallenge: ChallengeDefinition = {
  title: "Highlander Kitty",
  language: "css",
  height: 240,
  instructions: `
# Make the Highlander Kitty Spin!

Go ahead and select the kitty with the id=highlander
and make it spin by adding

\`animation: spin 1s infinite;\`

## IDs

In addition to classes, you can also add IDs to any element.

IDs are meant to be *unique* on a page. They are the 
*highlander kitty*, <a href="https://imgflip.com/i/82ed5g" target="_blank">_there can be only one_</a>.

You select an ID by using the hashtag (\`#\`).

\`\`\`html
<h1 id="primary-header">
  First Header...
</h1>
\`\`\`
\`\`\`css
#primary-header {
  font-size: 90px;
  color: red;
}
\`\`\`
  `,
  html: `
  <room>
    <basket>
      <cat></cat>
    </basket>
    <basket>
      <cat id="highlander"></cat>
      <div>⚔️⚔️⚔️</div>
    </basket>
    <basket>
      <cat class="tired">
      </cat>
    </basket>
  </room>
  `,
  hiddenCSSBefore: catcss,
  css: `   
    WORK 
    
    @keyframes spin {
      0% {
        rotate: 0deg;
        scale: 1;
      }
      50% {
        rotate: 360deg;
        scale: 1.2;
      }
      100% {
        rotate : 720deg;
        scale: 1
      }
    }
  `,
  starterCode: `
    /* Make the kitty with id=highlander spin */
    FIXME {
      animation: spin 1s infinite; 
    }    
  `,
  solution: `  
  #highlander {
    animation: spin 1s infinite;
  }
  `,
  validate(contentWindow) {
    let pc = new PropertyChecker(contentWindow);
    const items = [
      pc.checkOne(
        "#highlander",
        { "animation-name": "spin" },
        () => "Make the highlander spin!",
        "Highlander spins!"
      ),
      pc.checkAllBut(
        "cat",
        { "animation-name": "none" },
        ["#highlander"]
        //() => "There can be only one!!!",
        //"Other cats stay still"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
