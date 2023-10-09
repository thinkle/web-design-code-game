<script lang="ts">
  import type { ValidationResult } from "../types/validation";
  export let result: ValidationResult;
</script>

<section>
  {#if result.isSolved}
    <h2>🎉 Great job! You solved the challenge! 🎉</h2>
  {:else}
    <h2>🤔 It looks like something is not quite right... 🤔</h2>
  {/if}

  <ul>
    {#each result.items as { name, isValid, message } (name)}
      <li class:valid={isValid} class:invalid={!isValid}>
        {#if isValid}
          ✔️ {name}
        {:else}
          ❌ {name}: {message}
        {/if}
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    margin: 1em;
    padding: 1em;
    border-radius: 8px;
    background-color: #f8f8f8;    
  }
  h2 {
    color: #333;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin-bottom: 0.5em;
  }
  .valid {
    color: green;
  }
  .invalid {
    color: red;
  }
</style>
