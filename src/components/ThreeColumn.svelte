<!-- src/ThreeColumnLayout.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import ScrollReminder from "./ScrollReminder.svelte";

  let leftWidth = 33;
  let rightWidth = 33;

  let isResizingLeft = false;
  let isResizingRight = false;
  const handleMouseMove = (e) => {
    if (isResizingLeft) {
      leftWidth = (e.clientX / window.innerWidth) * 100;
    } else if (isResizingRight) {
      rightWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    }
  };

  const handleMouseUp = () => {
    isResizingLeft = false;
    isResizingRight = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDownLeft = () => {
    isResizingLeft = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDownRight = () => {
    isResizingRight = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  onMount(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  export let scrollReminderRight = false;
  export let scrollReminderLeft = false;
  export let scrollReminderCenter = false;
  let rightDiv: HTMLDivElement;
  let leftDiv: HTMLDivElement;
  let centerDiv: HTMLDivElement;
</script>

<div id="container">
  <div class="column" style="flex: {leftWidth};" bind:this={leftDiv}>
    <slot name="left" />
    {#if scrollReminderLeft}
      <ScrollReminder container={leftDiv} />
    {/if}
    <div class="resizer" on:mousedown={handleMouseDownLeft} />
  </div>
  <div
    class="column"
    style="flex: {100 - leftWidth - rightWidth};"
    bind:this={centerDiv}
  >
    <slot name="center" />
    {#if scrollReminderCenter}
      <ScrollReminder container={centerDiv} />
    {/if}
  </div>
  <div class="column" style="flex: {rightWidth};" bind:this={rightDiv}>
    <div class="resizer" on:mousedown={handleMouseDownRight} />
    <slot name="right" />

    {#if scrollReminderRight}
      <ScrollReminder container={rightDiv} />
    {/if}
  </div>
</div>

<style>
  #container {
    display: flex;
    height: calc(100vh - var(--header-height, 0));
  }
  .column {
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .resizer {
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 2;
    border: 1px dotted #ccc;
    cursor: ew-resize;
    background-color: transparent;
    width: 8px;
    height: 100%;
  }

  .resizer::before,
  .resizer::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 4px;
    height: 30px;
    background-color: #666;
    border-radius: 2px;
  }

  .resizer::before {
    top: 30px;
    transform: translateX(-50%);
  }

  .resizer::after {
    bottom: 30px;
    transform: translateX(-50%);
  }

  .column:last-child .resizer {
    left: 0;
  }
</style>
