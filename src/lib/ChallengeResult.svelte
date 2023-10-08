<script lang="ts">
  import type {ChallengeDefinition} from '../stores';
  export let challenge : ChallengeDefinition;
  export let solution : string;
  import CodeResult from "./CodeResult.svelte";

  let filledTemplate = '';
  let js = '';
  let css = '';
  let html = '';

  $: {
    filledTemplate = challenge.template.replace('WORK',solution);
    js = challenge.js;
    css = challenge.css;
    html = challenge.html;
    if (challenge.language == 'js') {
      js += filledTemplate;
    } else if (challenge.language == 'css') {
      css += filledTemplate;
    } else if (challenge.language == 'html') {
      html += filledTemplate;
    }
  }
  
</script>
<CodeResult
  {html} {css} {js}
/>
