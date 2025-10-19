import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker, validatePseudoSelector } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const finalSelectorsChallenge: ChallengeDefinition = {
  title: "CatBlog Polish",
  language: "css",
  height: 360,
  instructions: `
# 🎯 Final Challenge: CatBlog Polish

It's time to use **everything you've learned**.

### Your Tasks:
1. **Remove the space above the first \`h2\` in the header**  
   - You can't just target \`h2\`: there are more \`h2\`s below.

2. **Remove underlines from links in the nav menu** but **not** from main content links.  

3. **Alternate background colors** for menu items (\`odd\` / \`even\`).  

4. **Style the first line** of each day's **first paragraph** (bold + colored).  


You must complete all 6 tasks. There’s more than one way to do it, but the result must look right.
  `,
  html: `
  <div class="page">
    <header>
      <h1>CatBlog</h1>
      <h2>Welcome to the best site for cat content.</h2>
    </header>

    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Articles</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>

    <main>
        <h2>October 18th</h2>
        <p>Dear diary, today was a glorious day in the sunbeam.
        I toyed with a mouse, then took a long nap. Life is good.
        I can only dream of birds to make it better.</p>
            
        <h2>October 19th</h2>
        <p>Dear diary, the dog barked. I stared. He blinked first.
        Why, oh diary, do dogs smell so bad? I pondered this deeply
        before chasing my tail for a while.</p>
        <p>I think I will not understand why humans like dogs so much.
        They are loud and smelly. Cats are clearly superior.</p>
            
        <h2>October 20th</h2>
        <p>Dear diary, the humans gave me treats. A good day.</p>
    </main>
  </div>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    body {
      font-family: 'Georgia', serif;
      margin: 0;
      padding: 0;
    }
    header h2 {
      margin-top: 40px; /* default */
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 8px;
      padding: 0;
      margin: 0;
    }
    nav li {
      padding: 8px 12px;
    }
    nav a {
      text-decoration: underline;
      color: black;
      position: relative;
    }
    main {
      max-width: 400px;
      margin: 16px auto;
      padding: 8px;
    }

    WORK
  `,
  starterCode: `
    /* 1. Remove top space above the first header h2 */
    FIXME {
      margin-top: 0;
    }

    /* 2. Remove underline from nav menu links */
    ANDME {
      text-decoration: none;
    }

    /* 3. Alternate menu item backgrounds */
    ANDME {
      background: #f2f2f2;
    }
    ANDME {
      background: #ddd;
    }

    /* 4. Style first line of the first paragraph for
     each day's entry */
    ANDME {
      font-weight: bold;
      color: darkslateblue;
    }

  `,
  solution: `
    header h2:first-of-type {
      margin-top: 0;
    }
    nav a {
      text-decoration: none;
    }
    nav li:nth-child(odd) {
      background: #f2f2f2;
    }
    nav li:nth-child(even) {
      background: #ddd;
    }
    main h2 + p::first-line {
      font-weight: bold;
      color: darkslateblue;
    }

  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [];

    // 1. First header h2 margin-top removed
    items.push(
      pc.checkOne(
        "header h2",
        { "margin-top": "0px" },
        () => "Remove the space above the first header h2",
        "Header h2 spacing"
      )
    );

    // 2. Nav links have no underline
    items.push(
      pc.checkAll(
        "nav a",
        { "text-decoration-line": "none" },
        () => "Nav links should have no underline",
        "Nav link underline removal"
      )
    );

    // 3. Menu items alternating background colors
    items.push(
      pc.checkOne(
        "nav li:nth-child(odd)",
        { background: "rgb(242, 242, 242)" },
        () => "Odd menu items should have a light background",
        "Menu odd background"
      )
    );
    items.push(
      pc.checkOne(
        "nav li:nth-child(even)",
        { background: "rgb(221, 221, 221)" },
        () => "Even menu items should have a darker background",
        "Menu even background"
      )
    );

    // 4. First line styling
    items.push(
      validatePseudoSelector(
        contentWindow,
        "h2 + p::first-line",
        { "font-weight": "bold", color: "darkslateblue" },
        "The first line of each day's first paragraph should be styled"
      )
    );

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
