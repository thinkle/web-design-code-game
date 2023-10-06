<script lang="ts">
  import { studentWork } from "../stores";
  
  import Highlight from "svelte-highlight";
  import ThreeColumn from "./ThreeColumn.svelte";
  import type { Challenge } from "../stores";
  import 'highlight.js/styles/a11y-light.css'
  export let challenge: Challenge = {
    language: "html",
    template:
      `
      <style>
        WORK
      </style>
      <div style="
        background-color:black;
        width: 100px; 
        height: 100px;         
        ">
        Hi!
      </div>
      `,
    instruction: "Turn the div into a circle",
    solution: `
    border-radius: 50%; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    color: white;`,
  };
  import CodeMirror from "svelte-codemirror-editor";
  import { css } from "@codemirror/lang-css";
  import { javascript } from "@codemirror/lang-javascript";
  import { html } from "@codemirror/lang-html";

  import highlightJS from "svelte-highlight/languages/javascript";
  import highlightCSS from "svelte-highlight/languages/css";
  import highlightHTML from "svelte-highlight/languages/http";
  let highlightLang: any = highlightHTML;

  $: if (challenge.language === "js") {
    highlightLang = highlightJS;
  } else if (challenge.language === "css") {
    highlightLang = highlightCSS;
  } else {
    highlightLang = highlightHTML;
  }

  function getLanguage(challenge: Challenge) {
    if (challenge.language == "js") {
      return javascript();
    } else if (challenge.language == "css") {
      return css();
    } else {
      return html();
    }
  }

  import prettier from "prettier/standalone";
  import babelParser from "prettier/parser-babel";
  import CodeResult from './CodeResult.svelte';
  function fillTemplate(
    challenge: Challenge,
    mode: "student" | "solution" = "student"
  ) {
    let value = challenge.template.replace(
      "WORK",
      (mode == "student" && $studentWork) || challenge.solution
    );
    return value
  }

  async function formatCode (value : string) {
    try {
      let prettyValue = await prettier.format(value, {
        parser: "babel",
        printWidth: 60,
        plugins: [babelParser],
      });
      return prettyValue;
    } catch (err) {
      console.log("Ugly!!!!", err);
      return value;
    }
  }

  let formattedWork = '';
  $: if ($studentWork) { formatCode(fillTemplate(challenge,'student')).then((v)=>formattedWork=v)}  
</script>

<ThreeColumn>
  <div slot="left">
    <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
  </div>
  <div slot="center">
    <h2>Result</h2>        
    <CodeResult html={fillTemplate(challenge,'student',$studentWork)}/>
    <Highlight language={highlightLang} code={formattedWork} />
  </div>
  <div slot="right">
    <h2>Target</h2>
    <CodeResult html={fillTemplate(challenge,'solution')}/>
    <h2>Instructions</h2>
    {@html challenge.instruction}
  </div>
</ThreeColumn>
