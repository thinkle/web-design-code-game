<script lang="ts">
  import type { ValidationResult } from "../types/validation";
  export let result: ValidationResult;

  const phrases = [
    "🎉 Huzzah! 🎉",
    "🌟 Gold Star! 🌟",
    "🚀 Awesome opossum! 🚀",
    "🌈 Incredible work! 🌈",
    "🎊 Go you! 🎊",
    "⚡ Holy Toledo! ⚡",
    "🐾 Pawsitively Purrfect! 🐾",
    "🔥 You're on Fire! 🔥",
    "🍀 Lucky Us, You're Amazing! 🍀",
    "🎯 Bullseye! 🎯",
    "🍪 Smart Cookie Alert! 🍪",
    "🏆 Sensational! 🏆",
    "🐝 Bee-utiful Job! 🐝",
    "🚴‍♂️ You're Rolling! 🚴‍♂️",
    "🔍 AMAZING! 🔍",
    "💀 Scarily Great! 💀",
    "🐰 Some-bunny's crushing it! 🐰",
    "👅 Taste of success! 👅",
    "🫃 Full of great ideas! 🫃",
    "🦶 Toe-tally awesome! 🦶",
    "🤤 Drool-worthy! 🤤",
    "🧱 You’re laying the foundation! 🧱",
  ];
  const animations = [
    "zoom-in",
    "fly",
    "spin",
    "pop",
    "slide",
    "bounce",
    "swing",
  ];

  let chosenPhrase = "";
  let chosenAnimation = "";

  $: if (result.isSolved) {
    chosenPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    chosenAnimation = animations[Math.floor(Math.random() * animations.length)];
  }
</script>

<section class:success={result.isSolved} class:error={!result.isSolved}>
  {#if result.isSolved}
    <h2 class={chosenAnimation}>
      {chosenPhrase}
    </h2>
  {:else}
    <h2>Something is off... 🤔</h2>
  {/if}

  <ul>
    {#each result.items as { name, isValid, message }}
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
  /*  section {
    margin: 1em;
    padding: 1em;
    border-radius: 8px;
    background-color: #f8f8f8;
  } */

  section {
    margin: 0;
    padding: 12px;
    background: #f8f8f8;
    border-top: 2px solid #eee;
    border-radius: 0 0 8px 8px;
    font-size: 0.9rem;
  }
  h2 {
    color: #333;
    animation-duration: 1s;
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
  section.success {
    border-top-color: #5cb85c;
    background: #f0fff0;
  }

  section.error {
    border-top-color: #d9534f;
    background: #fff5f5;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0.5em 0 0 0;
  }

  li {
    font-size: 0.85rem;
    margin-bottom: 0.25em;
  }
  .valid {
    color: #2e7d32;
  }
  .invalid {
    color: #d32f2f;
  }
  h2 {
    font-size: 0.95rem;
    margin-top: 0;
    margin-bottom: 0.5em;
    animation-duration: 1s;
    text-align: center;
  }
  h2:not(.zoom-in):not(.fly):not(.spin):not(.pop):not(.slide):not(.bounce):not(
      .swing
    ) {
    color: #666;
    font-weight: 500;
  }
  @keyframes feedback-slide {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  section {
    animation: feedback-slide 0.3s ease-out;
  }
  @keyframes zoom-in {
    0% {
      transform: scale(0);
    }
    80% {
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  }
  @keyframes swing {
    20% {
      transform: rotate(15deg);
    }
    40% {
      transform: rotate(-10deg);
    }
    60% {
      transform: rotate(5deg);
    }
    80% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @keyframes fly {
    0% {
      transform: translate(200px, 200px) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(100px, 50px) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
  }
  @keyframes pop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    60% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes slide {
    0% {
      transform: translateX(200%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .pop {
    animation-name: pop;
  }
  .slide {
    animation-name: slide;
  }

  .fly {
    animation-name: fly;
  }
  .zoom-in {
    animation-name: zoom-in;
  }
  .spin {
    animation-name: spin;
  }
  .bounce {
    animation-name: bounce;
  }
  .swing {
    animation-name: swing;
  }

  h2 {
    font-size: 1rem;
  }
</style>
