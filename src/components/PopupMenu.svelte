<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let options: {
    html?: string;
    text?: string;
    value: any;
  }[];
  export let onSelected: (any) => void;
  export let onClose: () => void;

  let target: HTMLDivElement;
  let outerContainer: HTMLDivElement;
  let menu: HTMLDivElement;
  function popup(node: HTMLDivElement) {
    outerContainer = document.createElement("div");
    menu = node;
    outerContainer.appendChild(menu);
  }

  $: if (menu && target && outerContainer) {
    setupPopup();
  }

  function setupPopup() {
    console.log("Set me up!");
    outerContainer.style.position = "absolute";
    document.body.appendChild(outerContainer);
    outerContainer.appendChild(menu);

    function positionMenu() {
      const targetRect = target.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const { innerWidth } = window;

      let left = targetRect.left;
      if (left + menuRect.width > innerWidth) {
        left = innerWidth - menuRect.width - 10; // 10px padding from right edge
      }

      outerContainer.style.top = `${targetRect.bottom}px`;
      outerContainer.style.left = `${left}px`;
    }

    function handleOutsideClick(event: Event) {
      if (!outerContainer.contains(event.target as Node)) {
        onClose(); // Trigger the onClose method when a click outside the popup occurs
      }
    }

    positionMenu();
    //animateIn(outerContainer);

    setTimeout(() => window.addEventListener("click", handleOutsideClick), 100);
    window.addEventListener("resize", positionMenu);

    onDestroy(() => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("click", handleOutsideClick);
      outerContainer.removeChild(menu);
      document.body.removeChild(outerContainer);
    });
  }

  function animateIn(menu: HTMLDivElement) {
    menu.style.transform = "scale(0)";
    menu.style.opacity = "0";
    requestAnimationFrame(() => {
      menu.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      menu.style.transform = "scale(1)";
      menu.style.opacity = "1";
    });
  }
</script>

<div bind:this={target} />
<div use:popup>
  <slot>
    <ul>
      {#each options as option}
        <li on:click={() => onSelected(option.value)}>
          {#if option.html}
            {@html option.html}
          {:else if option.text}
            {option.text}
          {:else}
            {option.value}
          {/if}
        </li>
      {/each}
    </ul>
  </slot>
</div>

<style>
  :root {
    --white: #ffffff;
    --off-white: #f9f9f9;
    --dark: #333333;
    --border: #cccccc;
    --accent-color: #007bff;
    --text-color: #000000;
  }

  div {
    position: absolute;
    z-index: 1000;
    background-color: var(--white);
    border: 1px solid var(--border);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style-type: none;
    width: 200px;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  li:nth-child(odd) {
    background-color: var(--off-white);
    color: var(--text-color);
  }

  li:nth-child(even) {
    background-color: var(--white);
    color: var(--text-color);
  }

  li:hover {
    background-color: var(--accent-color);
    color: var(--white);
  }
</style>
