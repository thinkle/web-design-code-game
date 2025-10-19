import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const childSelectorChallenge: ChallengeDefinition = {
  title: "Lineup Order",
  language: "css",
  height: 240,
  instructions: `
# Style elements based on their *position* in their container

The \`:first-child\`, \`:last-child\`, and \`:nth-child()\` selectors let you select elements **based on order**, not classes.

\`\`\`css
p:first-child {
  color: red;
}
p:last-child {
  color: blue;
}
p:nth-child(odd) {
  background: pink;
}
p:nth-child(even) {
  background: lightblue;
}
\`\`\`

## Challenge: Cat & Dog Lineup

👉 In the lineup below:
- The **first animal** should have a **green border**.  
- The **last animal** should have a **red border**.  
- All **odd animals** should have a **light yellow background**.  
- All **even animals** should have a **light blue background**.
  `,
  html: `
  <lineup>
    <cat></cat>
    <dog></dog>
    <dog></dog>
    <cat></cat>
    <cat></cat>
    <dog></dog>
    <cat></cat>
  </lineup>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    lineup {
      display: flex;
      gap: 12px;
      padding: 20px;
    }
    cat, dog {
      padding: 8px;
      border: 2px solid transparent;
    }

    WORK
  `,
  starterCode: `
    /* First animal green border */
    FIXME {
      border-color: green;
    }

    /* Last animal red border */
    ANDME {
      border-color: red;
    }

    /* Odd animals light yellow */
    ANDME {
      background: lightyellow;
    }

    /* Even animals light blue */
    ANDME {
      background: lightblue;
    }
  `,
  solution: `
    lineup :first-child {
      border-color: green;
    }
    lineup :last-child {
      border-color: red;
    }
    lineup :nth-child(odd) {
      background: lightyellow;
    }
    lineup :nth-child(even) {
      background: lightblue;
    }
  `,
  validate(contentWindow) {
    const pc = new PropertyChecker(contentWindow);
    const items: ValidationItem[] = [
      pc.checkOne(
        "lineup :first-child",
        { "border-color": "green" },
        () => "First animal should have green border",
        "First child"
      ),
      pc.checkOne(
        "lineup :last-child",
        { "border-color": "red" },
        () => "Last animal should have red border",
        "Last child"
      ),
      pc.checkAll(
        "lineup :nth-child(odd)",
        { background: "lightyellow" },
        () => "Odd animals should have light yellow background",
        "Odd children"
      ),
      pc.checkAll(
        "lineup :nth-child(even)",
        { background: "lightblue" },
        () => "Even animals should have light blue background",
        "Even children"
      ),
    ];
    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
