import type { ChallengeDefinition } from "../../types/challenge";
import { PropertyChecker } from "../validation";
import type { ValidationItem } from "../../types/validation";
import catCss from "./css/cat.css?raw";
export const commaChallenge: ChallengeDefinition = {
  title: "Party Time with Cat and Dog",
  language: "css",
  height: 140,
  instructions: `
## Using Commas in CSS
You can apply the same styles to multiple selectors by separating them with commas. For example:
\`\`\`css
selector1, selector2 {
  property: value;
}
\`\`\`

Remember, a *space* in a selector selects a descendant, but a *comma* adds a brand new selector.

\`\`\`css
nav a { /* Select <a> inside <nav> */
  text-decoration: none;
}
ul,ol { /* Select <ul> *and* </ol> */
  margin: 0;
  padding: 0;
}
nav a,.menu a {
  /* Select <a> in <nav> AND <a> in <* class="menu> */
  text-decoration: none;  
}

# Party Time! Give the Koala and the Tiger party hats
Cat is throwing a party! The cat and its party guests, the koala
and the tiger, need to put on pink party hats!


\`\`\`

## About Border-Triangles

Because the 4 borders of a rectangular element are joined at an angle, you
can use borders to draw triangles. And because you can *round* the borders,
you can also use them to draw circles, ovals, and other basic shapes.

You can check out some crazy uses of this trick at this
<a href="https://css-tricks.com/the-shapes-of-css/" target="_blank">CSS Tricks Page</a>

  `,
  html: `
  <room>
    <div>
      <frog>
        <hat></hat>
      </frog>
      <cat>
        <hat></hat>
      </cat>
      <tiger>
        <hat></hat>
      </tiger>
      <dog>
        <hat></hat>
      </dog>
      <koala>
        <hat></hat>
      </koala>
      <mouse>
        <hat></hat>
      </mouse>
    </div>

  </room>
  `,
  css: `    
    div > * {
      margin-top: 32px;
      position: relative;
      margin-left: 8px;
      margin-right: 8px;
    }
    hat {
      position: absolute;
      top:-18px;
      left: 0;      
      border-bottom: 0;
      border-width: 16px;
      border-top-width: 6px;
      border-style: solid;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
      border-color: navy;      
      width: 0;
      display: block;
    }
    /* Brim of hat */
    hat::after {
      display: block;
      border-bottom: 3px solid navy;
      width: 42px;
      content: " ";
      margin-left: -20px;
      position: relative;
      bottom: -16px;
    }
    WORK
  `,
  hiddenCSSBefore: catCss,
  starterCode: `
    /* Give cat, tiger, and koala party hats */
    cat hat, FIXME {
      border: 16px solid transparent;
      border-bottom: 30px solid pink;
      top: -42px;
    }
    cat hat::after, FIX {
      border-color: transparent; /* No brim */
    }
  `,
  solution: `
    cat hat, tiger hat, koala hat {
      border: 16px solid transparent;
      border-bottom: 30px solid pink;
      top: -42px;
    }
    cat hat::after, tiger hat::after, koala hat::after {
      border-color: transparent; /* No brim */
    }
  `,
  validate(contentWindow, work: string) {
    let items: ValidationItem[] = [];

    let catHat = contentWindow.document.querySelector("cat hat");
    let dogHat = contentWindow.document.querySelector("dog hat");
    let mouseHat = contentWindow.document.querySelector("mouse hat");
    let pc = new PropertyChecker(contentWindow);
    items.push(
      pc.checkOne(
        "cat hat",
        { "border-bottom-color": "pink" },
        () => "Expected a pink bottom border bottom for hat",
        "Cat's hat"
      )
    );
    items.push(
      pc.checkOne(
        "koala hat",
        { "border-bottom-color": "pink" },
        () => "Give the koala a pink hat",
        "Koala's hat"
      )
    );
    items.push(
      pc.checkOne(
        "tiger hat",
        { "border-bottom-color": "pink" },
        () => "Expected a pink bottom border bottom for hat",
        "Tiger's hat"
      )
    );
    items.push(
      pc.checkOne(
        "dog hat",
        { "border-bottom-color": "navy" },
        () => "Expected no pink hat on dog",
        "Dog's hat"
      )
    );
    items.push({
      name: "Uses commas!",
      isValid: work.indexOf(",") > -1,
      message: "Not finding any commas in work!",
    });
    items.push({
      name: "DRY (Don't repeat yourself!)",
      isValid: work.length < 250,
      message: `Keep the code nice and short! 
        Yours is ${work.length - 250} characters too long!`,
    });

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
