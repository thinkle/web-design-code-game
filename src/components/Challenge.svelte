<script lang="ts">
  export let onNext = () => null;
  import type { ChallengeDefinition } from "../types/challenge";
  export let challenge: ChallengeDefinition;
  /** Offer the "Show the box model" overlay (box model lessons only) */
  export let boxModelTool = false;

  import { studentWork, showBoxModel, targetView } from "../stores";
  import type { TargetView } from "../stores";

  const targetViews: { value: TargetView; label: string; title: string }[] = [
    { value: "small", label: "Small", title: "Show a small Target" },
    { value: "full", label: "Full", title: "Show the Target full size" },
    {
      value: "overlay",
      label: "Overlay",
      title: "Lay a faded Target over your Result",
    },
  ];
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

  // Keep each challenge's code in this browser, so it survives Back/Next
  // and page reloads. (Best effort: storage can be unavailable.)
  const storageKey = (c: ChallengeDefinition) => `cat-game:work:${c.title}`;
  let loadedChallenge: ChallengeDefinition | null = null;

  function loadWork(c: ChallengeDefinition) {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey(c));
    } catch (e) {}
    $studentWork = saved ?? c.starterCode;
    loadedChallenge = c;
  }

  function saveWork(c: ChallengeDefinition, work: string) {
    if (loadedChallenge !== c) return;
    try {
      if (work === c.starterCode) {
        localStorage.removeItem(storageKey(c));
      } else {
        localStorage.setItem(storageKey(c), work);
      }
    } catch (e) {}
  }

  $: loadWork(challenge);
  $: saveWork(challenge, $studentWork);

  function restart() {
    if (
      confirm("Start this challenge over? Your code for it will be erased.")
    ) {
      $studentWork = challenge.starterCode;
    }
  }

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
  let jsError: string | null = null;
  // Interactive challenges (click/hover) validate asynchronously: the check
  // only finishes once the student interacts with the Result.
  let waitingForInteraction = false;
  let validationRun = 0;

  $: edited =
    $studentWork.replace(/\s/g, "") != challenge.starterCode.replace(/\s/g, "");

  $: studentIsCoding = focusInCodingWindow && edited;

  function updateResult(contentWindow: Window, work: any) {
    // Clear the existing timeout, if there is one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Reset JS error when we are about to re-run the student's code
    jsError = null;

    // Set a new timeout
    timeoutId = setTimeout(() => {
      const run = ++validationRun;
      waitingForInteraction = false;
      if (contentWindow) {
        let returnValue = challenge.validate(contentWindow, previewWork);
        if (returnValue instanceof Promise) {
          // The code changed, so any earlier verdict no longer applies.
          result = null;
          solved = false;
          waitingForInteraction = true;
          returnValue.then((r: ValidationResult) => {
            // Ignore answers from an older version of the student's code
            if (run !== validationRun) return;
            waitingForInteraction = false;
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
    }, 150); // the preview itself is already debounced
  }

  $: updateResult(resultWindow, previewWork);

  // Re-rendering the preview rebuilds the whole iframe (and re-formats the
  // code listings), so don't do it on every single keystroke: on slower
  // machines (Chromebooks) that work piles up and the preview lags behind.
  let previewWork = "";
  let previewTimeoutId: any;
  let previewChallenge: ChallengeDefinition | null = null;
  function schedulePreview(work: string) {
    clearTimeout(previewTimeoutId);
    if (
      !previewWork ||
      previewChallenge !== challenge ||
      work === challenge.starterCode
    ) {
      // New challenge or Restart: show it right away
      previewChallenge = challenge;
      previewWork = work;
    } else {
      previewTimeoutId = setTimeout(() => (previewWork = work), 150);
    }
  }
  $: schedulePreview($studentWork);

  function handleJsError(message: string) {
    jsError = message || "Unknown error in your JavaScript.";
  }
</script>

<ThreeColumn scrollReminderLeft={true}>
  <div slot="center" class="code">
    <div class="editor-bar">
      <div class="editor-label">
        {challenge.language} editor
      </div>
      {#if edited}
        <button class="reset" on:click={restart}>Restart</button>
      {/if}
    </div>
    {#key challenge.language}
      <div
        on:focusin={() => (focusInCodingWindow = true)}
        on:focusout={() => (focusInCodingWindow = false)}
      >
        <CodeMirror bind:value={$studentWork} lang={getLanguage(challenge)} />
      </div>
    {/key}

    <h2>Code</h2>
    {#if challenge.html}
      <CodeHighlighter
        template={challenge.html}
        insertion={previewWork}
        lang="html"
      />
    {/if}
    {#if challenge.css}
      <CodeHighlighter
        template={challenge.css}
        insertion={previewWork}
        lang="css"
      />
    {/if}
    {#if challenge.js}
      <CodeHighlighter
        template={challenge.js}
        insertion={previewWork}
        lang="js"
      />
    {/if}
  </div>
  <div slot="right">
    {#if boxModelTool}
    <label class="box-model-toggle">
      <input type="checkbox" bind:checked={$showBoxModel} />
      Show the box model
      <span class="legend">
        <i style="background:rgba(246, 178, 107, 0.66)"></i>margin
        <i style="background:rgba(255, 229, 153, 0.75)"></i>border
        <i style="background:rgba(147, 196, 125, 0.6)"></i>padding
        <i style="background:rgba(111, 168, 220, 0.6)"></i>content
      </span>
    </label>
    {#if $showBoxModel}
      <p class="box-model-hint">Hover over anything in the pictures below.</p>
    {/if}
    {/if}
    <div class="target-view" role="group" aria-label="How to show the Target">
      <span>Target:</span>
      {#each targetViews as view}
        <button
          class:selected={$targetView === view.value}
          aria-pressed={$targetView === view.value}
          title={view.title}
          on:click={() => ($targetView = view.value)}>{view.label}</button
        >
      {/each}
    </div>
    {#if $targetView !== "overlay"}
      <div class="target-area" class:small={$targetView === "small"}>
        <h2>Target</h2>
        <div
          class="target-frame"
          style:--frame-height={`${challenge.height || 600}px`}
        >
          <ChallengeResult
            {challenge}
            solution={challenge.solution}
            solved={true}
            model={true}
            boxModel={boxModelTool && $showBoxModel}
          />
        </div>
      </div>
    {/if}
    <div class="result-area" class:highlight={studentIsCoding}>
      <h2>Result</h2>
      <div class="result-frame">
        <ChallengeResult
          {challenge}
          solution={previewWork}
          {solved}
          onWindowLoaded={onIframeLoad}
          onJsError={handleJsError}
          boxModel={boxModelTool && $showBoxModel}
        />
        {#if $targetView === "overlay"}
          <!-- Faded Target on top; ignores the mouse so hover/click checks
               still reach the student's Result underneath -->
          <div class="target-ghost" aria-hidden="true">
            <ChallengeResult
              {challenge}
              solution={challenge.solution}
              solved={true}
              model={true}
            />
          </div>
        {/if}
      </div>
      {#if jsError}
        <div class="js-error-box">
          <h3>JavaScript error</h3>
          <p>{jsError}</p>
        </div>
      {/if}
      {#if waitingForInteraction && edited && challenge.interactionPrompt}
        <div class="try-it">
          👆 {challenge.interactionPrompt}
        </div>
      {:else if result && edited}
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
  .editor-bar {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  .reset {
    font-size: small;
    padding: 2px 8px;
    margin-bottom: 4px;
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

  .box-model-toggle {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 6px;
    font-size: 0.85rem;
    margin-bottom: 4px;
    cursor: pointer;
  }
  .box-model-toggle .legend {
    font-size: 0.75rem;
    color: #666;
  }
  .box-model-toggle .legend i {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 3px 0 6px;
    vertical-align: middle;
  }
  .box-model-hint {
    font-size: 0.75rem;
    color: #666;
    margin: 0 0 12px 0;
  }

  .target-view {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 12px;
  }
  .target-view span {
    margin-right: 2px;
  }
  .target-view button {
    font-size: 0.8rem;
    padding: 2px 10px;
    box-shadow: none;
    border: 1px solid #ccc;
    background: #fff;
    color: #333;
  }
  .target-view button.selected {
    background: var(--dark, #333);
    border-color: var(--dark, #333);
    color: #fff;
  }

  /* Small: lay the Target out at full width (so it matches the Result),
     then shrink it to half size */
  .target-area.small .target-frame {
    height: calc(var(--frame-height) / 2);
    overflow: hidden;
  }
  .target-area.small .target-frame > :global(.frame-wrap) {
    width: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
  }

  .result-frame {
    position: relative;
  }
  .target-ghost {
    position: absolute;
    inset: 0;
    opacity: 0.5;
    /* Darken-only blend, so the student's own work stays fully visible
       instead of being washed out by the Target's backgrounds */
    mix-blend-mode: multiply;
    pointer-events: none;
  }
  .target-ghost :global(iframe) {
    box-shadow: none;
  }

  .try-it {
    margin-top: 8px;
    padding: 10px 12px;
    border-radius: 6px;
    background: #fff8e1;
    border: 1px solid #ffd54f;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .js-error-box {
    margin-top: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #f5c2c7;
    background: #fff5f5;
    font-size: 0.85rem;
    color: #842029;
  }

  .js-error-box h3 {
    margin: 0 0 4px 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #b02a37;
  }

  .js-error-box p {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
