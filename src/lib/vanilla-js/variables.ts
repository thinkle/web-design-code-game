import type { ChallengeDefinition } from "../../types/challenge";
import instructions from "./markdown/variables.md?raw";
import catcss from "./css/cat.css?raw";
import {
  PropertyChecker,
  contrastRatio,
  isTransparent,
  relativeLuminance,
} from "../validation";

export const variablesChallenge: ChallengeDefinition = {
  title: "Saving Work with let",
  language: "js",
  instructions,
  height: 160,
  hiddenCSSBefore: catcss,
  html: `
    <div class="scene">
      <p class="status">
        It's daytime for the cats. The sun is out and everyone is napping in a warm sunbeam. 🌞
      </p>
      <div class="container">
        <cat id="kim"></cat>
        <cat id="miguel"></cat>
        <cat id="marisol"></cat>
      </div>
    </div>
  `,
  js: `
  WORK
  `,
  starterCode: `
  // Use a variable with \`let\` so we
  // don't have to repeat our selector.
  // Make all of your changes using
  // the same \`status\` variable.

  let status = document.querySelector(".status");

  // 1. Change the text to a night-time
  //    description for the cats.

  // 2. Change the background color to a
  //    dark night color (like midnightblue).

  // 3. Change the text color to something
  //    light (like white) so it shows up.
  `,
  solution: `
  let status = document.querySelector(".status");
  status.textContent = "It's night-time for the cats. The stars are out and they are prowling the moonlit rooftops. 🌙";
  status.style.backgroundColor = "midnightblue";
  status.style.color = "white";
  `,
  validate: (contentWindow) => {
    let pc = new PropertyChecker(contentWindow);
    let status = contentWindow.document.querySelector(
      ".status"
    ) as HTMLParagraphElement;

    return new Promise((resolve) => {
      // Give student code a moment to run and apply styles
      setTimeout(() => {
        const textItem = {
          name: "Night-time message",
          isValid:
            /night|moon|star|sleep|dark|dream|evening|bed ?time|midnight/i.test(
              status.textContent || ""
            ),
          message:
            "Update the text so it clearly says it's night time for the cats.",
        };

        // Any dark background and readable light text will do
        const style = contentWindow.getComputedStyle(status);
        const bgItem = {
          name: "Dark background",
          isValid:
            !isTransparent(style.backgroundColor) &&
            relativeLuminance(style.backgroundColor) < 0.1,
          message:
            "Give the status a dark background color (like midnightblue) so it feels like night.",
        };

        const colorItem = {
          name: "Light text",
          isValid:
            relativeLuminance(style.color) > 0.4 &&
            contrastRatio(style.color, style.backgroundColor) >= 4.5,
          message:
            "Change the text color to something light (like white) so it shows up on the dark background.",
        };

        const items = [textItem, bgItem, colorItem];

        resolve({
          isSolved: items.every((item) => item.isValid),
          items,
        });
      }, 200);
    });
  },
};
