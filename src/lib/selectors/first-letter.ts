import type { ChallengeDefinition } from "../../types/challenge";
import catcss from "./css/cat.css?raw";
import { PropertyChecker, validatePseudoSelector } from "../validation";
import type { ValidationItem } from "../../types/validation";

export const firstLetterAfterHeaderChallenge: ChallengeDefinition = {
  title: "Opening Lines",
  language: "css",
  height: 300,
  instructions: `
# Style the first letter of only **certain** paragraphs

The \`::first-letter\` pseudo-element lets you style the **very first letter** of a block of text.  

\`\`\`css
p::first-letter {
  font-size: 2em;
  font-weight: bold;
}
\`\`\`

👉 But we don't want to style *every* paragraph — only those that **immediately follow** an \`<h2>\`.

You can combine \`+ p\` (adjacent sibling selector) with \`::first-letter\` to target *only those paragraphs that are right after a heading*.


  `,
  html: `
  <article>
    <h2>October 18th</h2>
    <p>Dear diary, the humans failed to deliver treats on time. Tragic.</p>
    <p>I am still processing the betrayal.</p>
    <p>Also, I knocked over a plant.</p>

    <h2>October 19th</h2>
    <p>Dear diary, today was better. I saw a squirrel.</p>
    <p>The dog barked. I was unbothered.</p>
  </article>
  `,
  hiddenHTMLBefore: "<room>",
  hiddenHTMLAfter: "</room>",
  hiddenCSSBefore: catcss,
  css: `
    article {
      max-width: 400px;
      font-family: Georgia, serif;
      line-height: 1.5;
      background: #fefefe;
    }
    h2 {
      margin-top: 20px;
      margin-bottom: 4px;
    }
    p {
      margin: 0 0 12px 0;
      padding: 8px;
    }

    WORK
  `,
  starterCode: `
    /* Make only the first letter of the opening diary line big and bold */
    FIXME {
      font-size: 2em;
      font-weight: bold;
      color: purple;
    }
  `,
  solution: `
    h2 + p::first-letter {
      font-size: 2em;
      font-weight: bold;
      color: purple;
    }
  `,

  validate(contentWindow) {
    const items: ValidationItem[] = [];

    // --- (A) Check if they styled ANY ::first-letter ---
    let hasFirstLetterRule = false;
    let hasH2PlusPRule = false;
    let hasCorrectH2PlusFirstLetter = false;

    const styleSheets = contentWindow.document.styleSheets;
    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules as any) {
          if (rule.type === CSSRule.STYLE_RULE) {
            const sel = (rule.selectorText || "").replace(/\s+/g, " ").trim();

            // detect any first-letter styling
            if (sel.includes("::first-letter")) {
              hasFirstLetterRule = true;
            }

            // detect any h2 + p rule (with or without first-letter)
            if (sel.startsWith("h2 + p")) {
              hasH2PlusPRule = true;
            }

            // detect correct h2 + p::first-letter
            if (
              sel === "h2 + p::first-letter" ||
              sel === "h2+p::first-letter"
            ) {
              const style = rule.style;
              const fontSize = style.fontSize;
              const fontWeight = style.fontWeight;
              const color = style.color;
            }
          }
        }
      } catch {}
    }

    // (A) Feedback if they styled the first letter at all
    items.push({
      name: "First-letter rule in place!",
      isValid: hasFirstLetterRule,
      message: hasFirstLetterRule
        ? "You styled the first letter!"
        : "You haven't styled any first letters yet.",
    });

    // (B) Feedback if they targeted the correct paragraph context
    items.push({
      name: "Styling the paragraph after an h2",
      isValid: hasH2PlusPRule,
      message: hasH2PlusPRule
        ? "You targeted the paragraph after an h2!"
        : "You haven't targeted the paragraph after an h2 yet.",
    });

    // (C) Final check for the exact rule
    // (C) exact rule + properties via your working helper
    items.push(
      validatePseudoSelector(
        contentWindow,
        "h2 + p::first-letter",
        { "font-size": "2em", "font-weight": "bold", color: "purple" },
        "Correct h2 + p::first-letter rule"
      )
    );

    return {
      items,
      isSolved: items.every((i) => i.isValid),
    };
  },
};
