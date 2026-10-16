<script lang="ts">
  import type  { ChallengeDefinition } from "../types/challenge";
  export let challenge : ChallengeDefinition;
  export let solution : string;
  export let model : boolean = false;
  export let solved = false;
  import CodeResult from "./CodeResult.svelte";
  export let onWindowLoaded : null | ((w : Window)=>void) = null;
  export let boxModel = false;

  let filledTemplate = '';
  let js = '';
  let css = '';
  let html = '';
  export let onJsError: ((message: string) => void) | null = null;

  $: {
    //filledTemplate = challenge.template.replace('WORK',solution);
    js = challenge.js;
    css = challenge.css;
    html = challenge.html;    
    if (challenge.language == 'js') {
      js = challenge.js.replace('WORK',solution);
    } else if (challenge.language == 'css') {
      css = challenge.css.replace('WORK',solution);
    } else if (challenge.language == 'html') {
      html = challenge.html.replace('WORK',solution);
    }
    if (challenge.hiddenHTMLBefore) {
      html = challenge.hiddenHTMLBefore + html;
    }
    if (challenge.hiddenHTMLAfter) {
      html = html + challenge.hiddenHTMLAfter;
    }
    if (challenge.hiddenCSSBefore) {
      css = challenge.hiddenCSSBefore + css;
    }
  }
  // Applied to the <wrapper> in place, so solving doesn't reload the preview
  // (a reload would restart click/hover checks and re-run student JS).
  let wrapperClass = '';
  $: wrapperClass = [solved && 'solved', model && 'model'].filter(Boolean).join(' ');
  
</script>
<CodeResult
  {onWindowLoaded}
  {onJsError}
  height={challenge.height||600}
  {html} {css} {js} {wrapperClass} {boxModel}
/>
