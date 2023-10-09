<!-- src/ThreeColumnLayout.svelte -->
<script>
  import { onMount } from 'svelte';

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDownLeft = () => {
      isResizingLeft = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDownRight = () => {
      isResizingRight = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

  onMount(() => {
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<div id="container">
  <div class="column" style="flex: {leftWidth};">
    <slot name="left"></slot>
    <div class="resizer" on:mousedown={handleMouseDownLeft}></div>
  </div>
  <div class="column" style="flex: {100 - leftWidth - rightWidth};">
    <slot name="center"></slot>
  </div>
  <div class="column" style="flex: {rightWidth};">
    <div class="resizer" on:mousedown={handleMouseDownRight}></div>
    <slot name="right"></slot>
  </div>
</div>

<style>
  #container {
    display: flex;
    height: 100vh;
  }
  .column {
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }
  .resizer {
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background-color: #ccc;
    z-index: 2;
  }
  .column:last-child .resizer {
    left: 0;
  }
</style>
