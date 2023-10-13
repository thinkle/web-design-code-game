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

<section>
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
  section {
    margin: 1em;
    padding: 1em;
    border-radius: 8px;
    background-color: #f8f8f8;
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
