import type { ChallengeDefinition } from "../../types/challenge";

import catcss from "./css/cat.css?raw";

import type { ValidationItem } from "../../types/validation";
export const htmlChallenge: ChallengeDefinition = {
  title: "Kitten Class",
  language: "html",
  height: 250,
  instructions: `
# Your Challenge

Your challenge is use **HTML** to add classes to elements of the text
so that our fancy style rules will work correctly.

| class | style | element | 
|-------|-------|---------|
| kitten | Make it cuter and smaller | The word "kitten" |
| crazy | Make it look crazy | The word "crazy" |
| halloween | Add a halloween style | The paragraph about halloween |

&nbsp;

## How to Add Classes

In HTML, classes can be added like any other attribute to *any element* by
adding \`class="classname"\` where \`classname\` can be any word. For example:

\`\`\`html
<p class="fancy">
   This paragraph has a 
   fancy class.
   <a href="#start" class="magic">
     This link has the magic class
   </a>
</p>
\`\`\`

Remember, that in HTML the classname is just a word, whereas when you write
CSS you will have to use a dot (\`.\`) to prefix your classname.

For example:

_HTML_
\`\`\`html
<span class="caps">some text</span>
\`\`\`

_CSS_
\`\`\`css
.caps {
  font-variant: small-caps;
}
\`\`\`
  `,
  html: `
<div>
WORK
</div>
  `,
  hiddenCSSBefore: catcss,
  css: `   
.kitten {
  transform: scale(0.6);
  text-shadow: 3px 3px pink;
  text-decoration: underline 3px wavy #333;
  display: inline-block;  
}   
.halloween {
  color: orange;  
  background-color: black;
  padding: 4px;
  text-shadow: 3px 3px #eee3;
  box-shadow: 3px 3px #999;
}
.crazy {
  animation: crazy 4s ease-in-out infinite;  
  display: inline-block;
  font-variant: small-caps;
  transform: scale(0.7)translate(-8px, -8px)rotate(-5deg);
  color: orange;
}
@keyframes crazy {
  0% {
    transform: scale(0.7)translate(-8px, -8px)rotate(-5deg);
    color: red;
  }
  20% {
    transform: scale(1.2)translate(5px, 5px)rotate(5deg);
    color: orange;
  }
  35% {
    transform: scale(0.7)translate(-8px, -12px)rotate(-18deg);
    color: green;
  } 
  55% {
    transform: scale(0.7)translate(-8px, -8px)rotate(-5deg);
    color: red;
  }  
  57% {
    transform: scale(0.7)translate(-8px, 8px)rotate(-5deg);
    color: red;
  }
  59% {
    transform: scale(0.7)translate(-8px, -8px)rotate(-5deg);
    color: red;
  }  
  61% {
    transform: scale(0.7)translate(-8px, 8px)rotate(-5deg);
    color: red;
  }
   63% {
    transform: scale(0.7)translate(-8px, -8px)rotate(-5deg);
    color: red;
  }  
  65% {
    transform: scale(0.7)translate(-8px, 8px)rotate(-5deg);
    color: red;
  }

}
  `,
  starterCode: `
  <!-- Add classes to style the elements -->
  <!-- kitten: make the word kitten cute -->
  <!-- crazy: make the word crazy look crazy -->
  <!-- halloween: style the paragraph about halloween -->
  <p>Once there was a 
    <span class="FIXME">kitten</span>
    <cat></cat>
  </p>
  <p>The kitten was feeling 
    <b>crazy!</b>
  </p>
  <p>So the kitten decided to
    dress as a 
    dog for halloween! 
    <dog></dog>
  </p>
  `,
  solution: `    
<p>Once there was a <span class="kitten">kitten</span>
<cat></cat>
</p>
<p>The kitten was feeling <b class="crazy">crazy!</b></p>
<p class="halloween">So the kitten decided to dress as a 
dog for halloween! <dog></dog></p>  
  `,
  validate(contentWindow) {
    const d = contentWindow.document;
    let items: ValidationItem[];

    items = [
      {
        name: "kitten",
        message: "Add the class 'kitten' to the word kitten!",
        isValid: !!d.querySelector(".kitten"),
      },
      {
        name: "crazy",
        message: "Add the class 'crazy' to the word crazy!",
        isValid: !!d.querySelector(".crazy"),
      },
      {
        name: "Halloween",
        message: "Add the class 'halloween' to a paragraph!",
        isValid: !!d.querySelector("p.halloween"),
      },
    ];

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
