<script lang="ts">
  export let onNext = () => null;
  import type { ChallengeDefinition } from "../types/challenge";
  export let challenge: ChallengeDefinition;
  /** Offer the "Show the box model" overlay (box model lessons only) */
  export let boxModelTool = false;
  /** Offer "Show where the cats go" (dashed ghost cats on the Result) */
  export let ghostCatsTool = false;

  import {
    studentWork,
    showBoxModel,
    targetView,
    showGhostCats,
  } from "../stores";
  import { getContentRect } from "../lib/validation";
  import type { RectLike } from "../lib/validation";

  // Ghost cats: where the Target's cats are, drawn over the Result. Both
  // previews are laid out at the same width, so positions line up 1:1.
  let targetWindow: Window | null = null;
  let ghostCats: RectLike[] = [];
  function measureGhostCats(win: Window | null, enabled: boolean) {
    if (!enabled || !win || !win.document) {
      ghostCats = [];
      return;
    }
    ghostCats = Array.from(win.document.querySelectorAll(".cat, cat")).map(
      (cat) => getContentRect(cat)
    );
  }
  $: measureGhostCats(targetWindow, ghostCatsTool && $showGhostCats);
  const remeasure = () =>
    measureGhostCats(targetWindow, ghostCatsTool && $showGhostCats);
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

<svelte:window on:resize={remeasure} />

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
    <div class="target-area" class:small={$targetView === "small"}>
      <div class="target-header">
        <h2>Target</h2>
        <div class="target-view" role="group" aria-label="Target size">
          <button
            class:selected={$targetView === "small"}
            aria-pressed={$targetView === "small"}
            on:click={() => ($targetView = "small")}>Small</button
          >
          <button
            class:selected={$targetView === "full"}
            aria-pressed={$targetView === "full"}
            on:click={() => ($targetView = "full")}>Full size</button
          >
        </div>
      </div>
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
          onWindowLoaded={(w) => (targetWindow = w)}
        />
      </div>
    </div>
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
        {#each ghostCats as ghost}
          <div
            class="ghost-cat"
            aria-hidden="true"
            style:left={`${ghost.left}px`}
            style:top={`${ghost.top}px`}
            style:width={`${ghost.width}px`}
            style:height={`${ghost.height}px`}
          ></div>
        {/each}
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
      {#if boxModelTool || ghostCatsTool}
        <div class="preview-tools">
          {#if ghostCatsTool}
            <label>
              <input type="checkbox" bind:checked={$showGhostCats} />
              Show where the cats go
            </label>
          {/if}
          {#if boxModelTool}
            <label>
              <input type="checkbox" bind:checked={$showBoxModel} />
              Show the box model
            </label>
          {/if}
          {#if boxModelTool && $showBoxModel}
            <span class="legend">
              Hover the pictures:
              <i style="background:rgba(246, 178, 107, 0.66)"></i>margin
              <i style="background:rgba(255, 229, 153, 0.75)"></i>border
              <i style="background:rgba(147, 196, 125, 0.6)"></i>padding
              <i style="background:rgba(111, 168, 220, 0.6)"></i>content
            </span>
          {/if}
        </div>
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

  .target-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .target-header h2 {
    margin: 0;
  }
  .target-view {
    display: flex;
    gap: 4px;
  }
  .target-view button {
    font-size: 0.75rem;
    padding: 2px 8px;
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

  /* Small: a true half-size Target, with the header beside it. The frame
     is laid out at the Result's width (200% of a 50% box) so it matches
     the Result exactly, then scaled by half in both directions. */
  .target-area.small {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 12px;
  }
  .target-area.small .target-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .target-area.small .target-view {
    flex-direction: column;
  }
  .target-area.small .target-frame {
    flex: 0 0 50%;
    height: calc(var(--frame-height) / 2);
    position: relative;
    z-index: 2; /* box model tooltips may stick out over the label */
  }
  .target-area.small .target-frame > :global(.frame-wrap) {
    width: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
  }
  /* ...but keep box model tooltips readable */
  .target-area.small :global(.box-model-tip) {
    transform: scale(2);
    transform-origin: 0 0;
  }

  .result-frame {
    position: relative;
  }
  .ghost-cat {
    position: absolute;
    box-sizing: border-box;
    border: 2px dashed rgba(255, 255, 255, 0.95);
    outline: 2px dashed rgba(0, 0, 0, 0.55);
    border-radius: 6px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ghost-cat::after {
    content: "😺";
    font-size: 22px;
    opacity: 0.35;
  }

  .preview-tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 16px;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #444;
  }
  .preview-tools label {
    cursor: pointer;
  }
  .preview-tools .legend {
    font-size: 0.75rem;
    color: #666;
  }
  .preview-tools .legend i {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 3px 0 6px;
    vertical-align: middle;
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
