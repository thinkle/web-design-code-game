<script lang="ts">
  export let onNext = ()=>null;
  import type { ChallengeDefinition } from "../types/challenge";
  export let challenge: ChallengeDefinition 

  import { studentWork } from "../stores";  
  import CodeHighlighter from './CodeHighlighter.svelte';
  import ThreeColumn from "./ThreeColumn.svelte";    
  import CodeMirror from "svelte-codemirror-editor";
  
  import ChallengeResult from './ChallengeResult.svelte';  
  import Feedback from "./Feedback.svelte";
  import Markdown from "./Markdown.svelte";
  
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

  
  import type { ValidationResult } from "../types/validation";
  
  
  $: $studentWork = challenge.starterCode;

  let resultWindow : Window;
  function onIframeLoad (w : Window) {
    console.log('iframe loaded!',w)
    resultWindow = w;
  }

  let edited = false;
  let solved = false;
  let result : ValidationResult | null;
  let timeoutId : any; // for debouncing

  $: edited = $studentWork.replace(/\s/g,'') != challenge.starterCode.replace(/\s/g,'');
 
  function updateResult(contentWindow: Window, work: any) {
    // Clear the existing timeout, if there is one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      if (contentWindow) {
        result = challenge.validate(contentWindow);
        solved = result.isSolved;
      } else {
        result = null;
      }
    }, 300); // 300ms delay
  }

  $: updateResult(resultWindow,$studentWork);
  
</script>

<ThreeColumn>
  <div slot="left" class="code">
    <button class="reset"
      on:click={()=>$studentWork=challenge.starterCode}
    >Restart</button>
    <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)}
      styles={{
              "&": {
                backgroundColor: '#fefefe',
                color: '#333',                                                      
              },
          }}
    />
  </div>
  <div slot="center">    
    <h2>Result</h2>        
    <ChallengeResult {challenge} solution={$studentWork} {solved}
      onWindowLoaded={onIframeLoad}
    />
    {#if challenge.html}
    <CodeHighlighter template={challenge.html} insertion={$studentWork} lang='html'/>
    {/if}
    {#if challenge.css}
    <CodeHighlighter template={challenge.css} insertion={$studentWork} lang='css'/>
    {/if}
    {#if challenge.js}
    <CodeHighlighter template={challenge.js} insertion={$studentWork} lang='js'/>
    {/if}
  </div>
  <div slot="right"> 
    {#if solved}
      <div 
        style="display:flex;justify-content:end">
        <button class='next' on:click={onNext}>Next!</button>
      </div>
    {/if}   
    <Markdown markdown={challenge.instructions}/>
    {#if result && edited}<Feedback {result}/>{/if}
    <h2>Target</h2>
    <ChallengeResult {challenge} solution={challenge.solution} solved={true} model={true}/>    
  </div>
</ThreeColumn>


<style>
  button {    
    box-shadow: 4px 4px #ccc9;
    z-index: 1;
  }
  .next {
    position: fixed;
    top: 64px;
    right: 64px;    
  }
  .reset {
    position: absolute;
    right: 8px;
    top: 8px;
  }
  .code {
    position: relative;
    padding-top: 32px;
  }
</style>