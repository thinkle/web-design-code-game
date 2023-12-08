<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let container: HTMLDivElement;

  let hasScrolledToBottom = false;
  let leftPosition = 0;

  function scrollOnePageDown() {
    container.scrollBy(0, window.innerHeight - 120);
  }

  function checkScroll() {
    console.log("Check scroll!");
    leftPosition =
      container.getBoundingClientRect().left + container.clientWidth - 120;
    console.log("Got element", container, "at", leftPosition);
    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight
    ) {
      console.log(
        "Still have ",
        container.scrollHeight - container.scrollTop,
        "px to go!"
      );
      hasScrolledToBottom = true;
    } else {
      hasScrolledToBottom = false;
    }
  }

  onMount(() => {
    if (container) {
      container.addEventListener("scroll", checkScroll);
      leftPosition =
        container.getBoundingClientRect().left + container.clientWidth - 120;
      console.log("Got element", container, "at", leftPosition);
    }
  });
  $: if (container) {
    container.addEventListener("scroll", checkScroll);
    leftPosition = container.getBoundingClientRect().left;
    console.log("Got element", container, "at", leftPosition);
  }

  onDestroy(() => {
    container.removeEventListener("scroll", checkScroll);
  });
</script>

{#if !hasScrolledToBottom}
  <div style:--left="{leftPosition}px" on:click={scrollOnePageDown}>
    <slot>Read more!</slot>
  </div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 0;
    left: var(--left);
    margin-left: 32px;
    padding: 8px 16px;
    width: 100px;
    border-radius: 0.5rem 0.5rem 0 0;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    background-color: var(--accent-color);
    color: var(--white);
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 1;
    box-shadow: 4px 4px 3px #ccca;
  }
  div::after {
    content: "⬇";
    background-color: var(--light-text);
    opacity: 0.5;
    z-index: -1;
  }
</style>
