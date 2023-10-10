<script>
  import Challenge from "./components/Challenge.svelte";
  import {challenges} from './lib/challenges';
  let theChallenge = challenges[0];
  let idx = 0;
  function nextChallenge () {
    idx++;
    theChallenge = challenges[idx];
  }
  function lastChallenge () {
    idx--;
    theChallenge = challenges[idx]
  }

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
<Challenge challenge={theChallenge} onNext={nextChallenge}/>
</main>

<style>
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