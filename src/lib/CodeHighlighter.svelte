<script lang="ts">
  import { onMount } from "svelte";
  import hljs from "highlight.js";

  import prettier from "prettier/standalone";
  import parserBabel from "prettier/parser-babel";

  export let template = "<div>Hello WORK World</div>";
  export let insertion = "<b>Bold</b>";
  let transformed = "";
  let start = "◆◆start◆◆";
  let end = "▲▲end▲▲";
  $: format(template, insertion);

  async function formatCode(value: string) {
    try {
      let prettyValue = await prettier.format(value, {
        parser: parserBabel,
        plugins: ["babel"],
      });
      return prettyValue;
    } catch (err) {
      //console.log("Ugly!!!!", err);
      return value;
    }
  }

  async function format(template: string, insertion: string) {
    let temp = template.replace("WORK", start + insertion + end);

    temp = await formatCode(temp);
    // Step 1: Use highlight.js to highlight transformed code
    temp = hljs.highlightAuto(temp).value;

    // Step 2: Replace start with <span class="my-code-segment">
    temp = temp.replace(start, '<span class="my-code-segment">');

    // Step 3: Replace end with </span>
    temp = temp.replace(end, "</span>");
    transformed = temp;
  }
</script>

<code>
  <pre>
  
    {@html transformed}
  </pre>
</code>

<style>
  code :global(.my-code-segment) {
    background-color: yellow;
  }
</style>
