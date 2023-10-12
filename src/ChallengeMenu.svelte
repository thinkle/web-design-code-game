<script lang="ts">
  import Challenge from "./components/Challenge.svelte";
  import { challengeSets } from "./lib/challenges";

  let defaultSet: "box" = "box";
  let challengeSet = challengeSets[defaultSet];
  let challenges = challengeSet.challenges;
  let idx = 0;
  let theChallenge = challenges[idx];

  function nextChallenge() {
    idx++;
    theChallenge = challenges[idx];
    if (!theChallenge) {
      idx--;
      completed = true;
    }
  }
  function lastChallenge() {
    idx--;
    theChallenge = challenges[idx];
    completed = false;
  }
  let completed: boolean;
</script>

<div class="menu" />

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
  .title-box {
    text-align: center;
  }
  .title-box h3 {
    color: var(--light-text);
    font-size: small;
  }
  header div:first-child,
  header div:last-child {
    width: 10%;
  }
  .count {
    font-size: small;
    display: flex;
    justify-content: end;
    align-items: center;
  }
  header {
    border-bottom: 3px solid var(--dark);
    background-color: var(--dark);
    color: var(--white);
    padding-right: 8px;
    padding-left: 8px;
  }
</style>
