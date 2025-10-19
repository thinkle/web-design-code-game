<script lang="ts">
  export let onNext = () => null;
  import type { ChallengeDefinition } from "../types/challenge";
  export let challenge: ChallengeDefinition;

  import { studentWork } from "../stores";
  import CodeHighlighter from "./CodeHighlighter.svelte";
  import ThreeColumn from "./ThreeColumn.svelte";

  //import CodeMirror from "svelte-codemirror-editor";
  import CodeMirror from "./CodeMirror.svelte";

  import ChallengeResult from "./ChallengeResult.svelte";
  import Feedback from "./Feedback.svelte";
  import Markdown from "./Markdown.svelte";

  //import { css } from "@codemirror/lang-css";
  import { css } from "../lib/codemirror/customCss";
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

  let resultWindow: Window;
  function onIframeLoad(w: Window) {
    console.log("iframe loaded!", w);
    resultWindow = w;
  }
  let focusInCodingWindow = false;
  let edited = false;
  let solved = false;
  let result: ValidationResult | null;
  let timeoutId: any; // for debouncing
  let studentIsCoding = false;

  $: edited =
    $studentWork.replace(/\s/g, "") != challenge.starterCode.replace(/\s/g, "");

  $: studentIsCoding = focusInCodingWindow && edited;

  function updateResult(contentWindow: Window, work: any) {
    // Clear the existing timeout, if there is one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      if (contentWindow) {
        let returnValue = challenge.validate(contentWindow, $studentWork);
        if (returnValue instanceof Promise) {
          returnValue.then((r: ValidationResult) => {
            result = r;
            solved = result.isSolved;
          });
        } else {
          result = returnValue;
          solved = result.isSolved;
        }
      } else {
        result = null;
      }
    }, 300); // 300ms delay
  }

  $: updateResult(resultWindow, $studentWork);
</script>

<ThreeColumn scrollReminderLeft={true}>
  <div slot="center" class="code">
    <div class="editor-label">
      {challenge.language} editor
    </div>
    {#if edited}
      <button
        class="reset"
        on:click={() => ($studentWork = challenge.starterCode)}>Restart</button
      >{/if}
    {#key challenge.language}
      <div
        on:focusin={() => (focusInCodingWindow = true)}
        on:focusout={() => (focusInCodingWindow = false)}
      >
        <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
      </div>
    {/key}
    {#if edited && challenge.requireHover && !result?.isSolved}
      <div class="emphasize">
        Hold your mouse over the target element to complete the challenge!
      </div>
    {/if}

    <h2>Code</h2>
    {#if challenge.html}
      <CodeHighlighter
        template={challenge.html}
        insertion={$studentWork}
        lang="html"
      />
    {/if}
    {#if challenge.css}
      <CodeHighlighter
        template={challenge.css}
        insertion={$studentWork}
        lang="css"
      />
    {/if}
    {#if challenge.js}
      <CodeHighlighter
        template={challenge.js}
        insertion={$studentWork}
        lang="js"
      />
    {/if}
  </div>
  <div slot="right">
    <div class="target-area">
      <h2>Target</h2>
      <ChallengeResult
        {challenge}
        solution={challenge.solution}
        solved={true}
        model={true}
      />
    </div>
    <div class="result-area" class:highlight={studentIsCoding}>
      <h2>Result</h2>
      <ChallengeResult
        {challenge}
        solution={$studentWork}
        {solved}
        onWindowLoaded={onIframeLoad}
      />
      {#if result && edited}
        <Feedback {result} />
      {/if}
    </div>
  </div>
  <div slot="left">
    {#if solved}
      <div style="display:flex;justify-content:end">
        <button class="next" on:click={onNext}>Next!</button>
      </div>
    {/if}
    <Markdown markdown={challenge.instructions} />
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
    top: -3px;
  }
  .code {
    position: relative;
  }
  .editor-label {
    font-size: small;
    background-color: var(--dark);
    color: var(--white);
    display: inline-block;
    padding: 3px;
    border-radius: 8px 8px 0 0;
  }
  .target-area {
    border: 2px dashed #b2b2b2;
    background: #fafafa;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }

  .target-area h2 {
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0;
    margin-bottom: 8px;
    color: #666;
  }

  .result-area {
    border: 2px solid #eee;
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    transition:
      box-shadow 0.3s ease,
      border-color 0.3s ease;
  }

  .result-area h2 {
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0;
    margin-bottom: 8px;
    color: #666;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(255, 179, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 179, 0, 0);
    }
  }

  .result-area.highlight {
    border-color: var(--accent-color);
    animation: pulse 1.6s ease-out 1;
  }

  .target-area::before,
  .result-area::before {
    position: absolute;
    top: -10px;
    left: 12px;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 4px;
  }

  .target-area::before {
    content: "Model";
    background: #fafafa;
    color: #666;
    border: 1px dashed #b2b2b2;
  }

  .result-area::before {
    content: "Your Work";
    background: #fff;
    color: #666;
    border: 1px solid #eee;
  }
  .target-area,
  .result-area {
    position: relative;
  }
  .target-area {
    opacity: 0.85;
  }
</style>
