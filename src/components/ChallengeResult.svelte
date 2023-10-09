<script lang="ts">
  import type  { ChallengeDefinition } from "../types/challenge";
  export let challenge : ChallengeDefinition;
  export let solution : string;
  export let model : boolean = false;
  export let solved = false;
  import CodeResult from "./CodeResult.svelte";
  export let onWindowLoaded : null | ((w : Window)=>void) = null;

  let filledTemplate = '';
  let js = '';
  let css = '';
  let html = '';

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
    let wrapperClasses = [];    
    if (solved) { wrapperClasses.push('solved') }
    if (model) {wrapperClasses.push('model')}
    html = `<wrapper class="${wrapperClasses.join(' ')}">${html}</wrapper>`            
  }
  
</script>
<CodeResult
  {onWindowLoaded}
  height={challenge.height||600}
  {html} {css} {js}
/>
