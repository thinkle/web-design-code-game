<script lang="ts">
  import { studentWork } from "../stores";  
  import CodeHighlighter from './CodeHighlighter.svelte';
  import ThreeColumn from "./ThreeColumn.svelte";
  import type { ChallengeDefinition } from "../stores";
  
  export let challenge: ChallengeDefinition = {
    language: "css",
    starter : `
    div {
      width: 100px; 
      border: 100px;      
    }
    `,
    template:
      `
      div {
        background-color: #77034a;
      }

      WORK
             
      `,
    instructions: "Turn the div into a circle",
    solution: `
    border-radius: 50%; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    color: white;`,
    html : '<div><section class="cat"></section></div>',
    js : '',
    css : `
    section.cat {
          background-color: green;
          border-radius: 50%;
          width: 50px;
          height: 50px;
        }
    `    
  };
  import CodeMirror from "svelte-codemirror-editor";
  import { css } from "@codemirror/lang-css";
  import { javascript } from "@codemirror/lang-javascript";
  import { html } from "@codemirror/lang-html";


  function getLanguage(challenge: ChallengeDefinition) {
    if (challenge.language == "js") {
      return javascript();
    } else if (challenge.language == "css") {
      return css();
    } else {
      return html();
    }
  }

  
  import ChallengeResult from './ChallengeResult.svelte';  
  
  $: $studentWork = challenge.starter;

  function fillTemplate(
    challenge: ChallengeDefinition,
    mode: "student" | "solution" = "student"
  ) {
    let value = challenge.template.replace(
      "WORK",
      (mode == "student" && $studentWork) || challenge.solution
    );
    return value
  }


  
</script>

<ThreeColumn>
  <div slot="left">
    <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
  </div>
  <div slot="center">
    <h2>Result</h2>        
    <ChallengeResult {challenge} solution={$studentWork}/>
    <CodeHighlighter template={challenge.template} insertion={$studentWork}/>
  </div>
  <div slot="right">
    <h2>Target</h2>
    <ChallengeResult {challenge} solution={challenge.solution}/>
    <h2>Instructions</h2>
    {@html challenge.instructions}
  </div>
</ThreeColumn>
