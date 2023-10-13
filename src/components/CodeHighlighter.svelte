<script lang="ts">
  import { onMount } from "svelte";
  import hljs from "highlight.js";

  import prettier from "prettier/standalone";
  import parserBabel from "prettier/parser-babel";

  export let template = "<div>Hello WORK World</div>";
  export let insertion = "<b>Bold</b>";
  export let lang = "html";
  let transformed = "";
  let start = "◆◆◆◆";
  let end = "▲▲▲▲";
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
    temp = hljs.highlight(lang, temp).value;
    //temp = hljs.highlightAuto(temp).value;

    // Step 2: Replace start with <span class="my-code-segment">
    temp = temp.replace(start, '<span class="my-code-segment">');

    // Step 3: Replace end with </span>
    temp = temp.replace(end, "</span>");
    transformed = temp;
  }
</script>

<div class="code-block">
  <div class="code-label">
    {lang}
  </div>
  <code>
    <pre>  
    {@html transformed}
  </pre>
  </code>
</div>

<style>
  code :global(.my-code-segment) {
    background-color: yellow;
  }
  .code-block {
    width: 90%;
    margin: 5%;
    box-shadow: 3px 3px #3337;
    border: 1px inset #eee;
    padding: 1em;
    position: relative;
  }
  .code-label {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px;
    font-size: small;
  }
</style>
