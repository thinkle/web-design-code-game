<script lang="ts">
  import { onMount } from "svelte";
  import ChallengeMenu from "./ChallengeMenu.svelte";

  import Challenge from "./components/Challenge.svelte";
  import PopupMenu from "./components/PopupMenu.svelte";
  import { challengeSets, type ChallengeSetId } from "./lib/challenges";
  import type { ChallengeDefinition } from "./types/challenge";

  let challengeId: ChallengeSetId = "box";
  let challengeSet = challengeSets[challengeId];

  let challenges = challengeSet.challenges;
  let idx = 0;
  let theChallenge = challenges[idx];

  $: {
    challengeSet = challengeSets[challengeId];
    challenges = challengeSet.challenges;
    idx = 0;
    theChallenge = challenges[0];
  }

  function nextChallenge() {
    idx++;
  }
  function lastChallenge() {
    idx--;
  }

  function setChallenge(idx) {
    if (idx < 0) {
      idx = 0;
    }
    if (idx >= challenges.length) {
      idx = 0;
      completed = true;
    } else {
      theChallenge = challenges[idx];
      completed = false;
    }
    showIndexChangePopup = false;
  }

  $: setChallenge(idx);
  let showIndexChangePopup: boolean;
  let showChallengeChangePopup: boolean;

  let challengePopupOptions = Object.keys(challengeSets).map(
    (key: ChallengeSetId) => {
      let cs = challengeSets[key];
      return {
        value: key,
        html: `<span class="name">${cs.name}</span>: <span class="concept">${cs.concept} (${cs.challenges.length} challenges)`,
      };
    }
  );

  let completed: boolean;
  let popupOptions: { html: string; value: number }[] = [];
  function getPopupOptions(cc: ChallengeDefinition[]) {
    return cc.map((c, i) => ({
      html: `<span class="number">${i + 1}</span> <span class="name">${
        c.title
      }</span>`,
      value: i,
    }));
  }

  $: popupOptions = getPopupOptions(challenges);

  let loaded: boolean;
  onMount(() => {
    function handleHashChange() {
      // Extracting the hash (without #) and updating challengeId
      let possibleId = window.location.hash.substring(1);
      if (["box", "selectors"].includes(possibleId)) {
        challengeId = possibleId as ChallengeSetId;
      }
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Initial check in case the app is loaded with a hash in the URL
    handleHashChange();
    loaded = true;
    // Cleanup: remove the event listener when the component is destroyed
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  });

  $: {
    if (loaded) {
      window.location.hash = challengeId;
    }
  }
</script>

<main>
  <header>
    <div>
      {#if theChallenge != challenges[0]}
        <button on:click={lastChallenge} class="back">Back</button>
      {/if}
    </div>
    <div class="title-box">
      <h1>
        {#if showChallengeChangePopup}
          <PopupMenu
            onClose={() => (showChallengeChangePopup = false)}
            options={challengePopupOptions}
            onSelected={(id) => {
              challengeId = id;
              showChallengeChangePopup = false;
            }}
          />
        {/if}
        <button
          on:click={() => (showChallengeChangePopup = true)}
          class="subtle">✎</button
        >
        {challengeSet.name}:
        {theChallenge.title}
      </h1>
      <h3>Learn the {challengeSet.concept}</h3>
    </div>

    <div class="count">
      Step
      <button
        class="subtle border"
        on:click={() => (showIndexChangePopup = true)}>{idx + 1}</button
      >
      of {challengeSet.challenges.length}
      {#if showIndexChangePopup}
        <PopupMenu
          onClose={() => (showIndexChangePopup = false)}
          options={popupOptions}
          onSelected={(i) => (idx = i)}
        />
      {/if}
    </div>
  </header>
  {#if completed}
    <section class="win">
      <h1>You won!</h1>
      <p>
        You've completed all the steps for {challengeSet.name} ({challengeSet.concept})!
      </p>
      <ul>
        <li>
          My Challenges:
          <ul>
            {#each Object.keys(challengeSets) as key}
              {@const cs = challengeSets[key]}
              <li>
                <a href={`#${key}`}>{cs.name}: {cs.concept}</a>
              </li>
            {/each}
          </ul>
        </li>
        <li>
          Other Challenges
          <ul>
            <li>
              <a href="https://flukeout.github.io/">
                CSS Selectors with Sushi!
              </a>
            </li>
            <li>
              <a href="https://flukeout.github.io/"> Flexbox Froggy </a>
            </li>
            <li>
              <a href="https://cssgridgarden.com/"> Grid Garden </a>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  {:else}
    <Challenge challenge={theChallenge} onNext={nextChallenge} />
  {/if}
</main>

<style>
  .win {
    display: grid;
    place-content: center;
    min-height: 50vh;
    text-align: center;
    line-height: 1.8;
  }
  .win ul {
    width: 20em;
    margin: auto;
    text-align: left;
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
  .subtle {
    background-color: transparent;
    color: inherit;
    margin-left: 3px;
    margin-right: 3px;
    padding-left: 3px;
    padding-right: 3px;
  }
  .subtle.border {
    border: 1px solid var(--white);
  }
  h1 {
    display: flex;
    align-items: center;
  }
  .subtitle {
    font-weight: normal;
    font-style: italic;
    font-size: 1.1rem;
    display: flex;
    align-self: bottom;
  }
</style>
