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
  import Markdown from "./Markdown.svelte";
  import type { ValidationResult } from "../types/validation";
  import Feedback from "./Feedback.svelte";
  
  $: $studentWork = challenge.starterCode;

  let resultWindow : Window;
  function onIframeLoad (event : {detail : Window}) {
    console.log('iframe loaded!',event.detail)
    resultWindow = event.detail;
  }

  

  let result : ValidationResult | null;
  function updateResult (contentWindow : Window, work : any) {
    if (contentWindow) {
      result = challenge.validate(contentWindow)
    } else {
      result = null;
    }
  }

  $: updateResult(resultWindow,$studentWork);
  
</script>

<ThreeColumn>
  <div slot="left">
    <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
  </div>
  <div slot="center">    
    <h2>Result</h2>        
    <ChallengeResult {challenge} solution={$studentWork}
      on:loaded={onIframeLoad}
    />
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
    {#if result}<Feedback {result}/>{/if}
    <h2>Target</h2>
    <ChallengeResult {challenge} solution={challenge.solution}/>
    <h2>Instructions</h2>
    <Markdown markdown={challenge.instructions}/>
  </div>
</ThreeColumn>
