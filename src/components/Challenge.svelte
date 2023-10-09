<script lang="ts">
  import type { ChallengeDefinition } from "../types/challenge";
  export let challenge: ChallengeDefinition 

  import { studentWork } from "../stores";  
  import CodeHighlighter from './CodeHighlighter.svelte';
  import ThreeColumn from "./ThreeColumn.svelte";    
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
  
  $: $studentWork = challenge.starterCode;


  
</script>

<ThreeColumn>
  <div slot="left">
    <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
  </div>
  <div slot="center">
    <h2>Result</h2>        
    <ChallengeResult {challenge} solution={$studentWork}/>
    {#if challenge.html}
    <CodeHighlighter template={challenge.html} insertion={$studentWork}/>
    {/if}
    {#if challenge.css}
    <CodeHighlighter template={challenge.css} insertion={$studentWork}/>
    {/if}
    {#if challenge.js}
    <CodeHighlighter template={challenge.js} insertion={$studentWork}/>
    {/if}
  </div>
  <div slot="right">
    <h2>Target</h2>
    <ChallengeResult {challenge} solution={challenge.solution}/>
    <h2>Instructions</h2>
    {@html challenge.instructions}
  </div>
</ThreeColumn>
