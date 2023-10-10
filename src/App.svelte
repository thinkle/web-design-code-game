<script lang="ts">
  import Challenge from "./components/Challenge.svelte";
  import {challenges} from './lib/challenges';
  
  let idx = 0;
  let theChallenge = challenges[idx];
  
  function nextChallenge () {
    idx++;
    theChallenge = challenges[idx];
    if (!theChallenge) {
      idx--;
      completed = true;
    }
  }
  function lastChallenge () {
    idx--;
    theChallenge = challenges[idx];
    completed = false;
  }
  let completed : boolean;
</script>
<main>
<header>
  <div>
    {#if theChallenge != challenges[0]}
      <button on:click={lastChallenge} class='back'>Back</button>
    {/if}
  </div>
  <h1>Cats in Boxes</h1>
  <div>

  </div>
</header>
{#if completed}
<section class="win">
<h1>You won!</h1>
<p>You've completed all my challenges so far!</p>
</section>
{:else}
<Challenge challenge={theChallenge} onNext={nextChallenge}/>
{/if}
</main>

<style>
  .win {
    display: grid;
    place-content: center;
    min-height: 50vh;
    text-align: center;
  }
  main {
    height: 100vh;
    --header-height: 64px;
  }
  header {
    height: 64px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
  }
  h1 {
    margin: 0;
  }

</style>