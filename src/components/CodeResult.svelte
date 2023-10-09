<script lang="ts">
  import { onMount } from 'svelte';      

  // ... [Rest of the Code]

  const dispatch = (name, detail) => {
    console.log('Fire away!',name,detail);
    iframe.dispatchEvent(new CustomEvent(name, { detail }));
  };

  export let js = '';
  export let css = '';
  export let html = '';
  export let height : number;

  let iframe : HTMLIFrameElement;
  
  const updateIframe = () => {
    if (!iframe || !iframe.contentWindow) {
      console.log('No iframe?');
      return;
    }    
    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              ${css}
          </style>
      </head>
      <body>
          ${html}
          <scr` + `ipt>
              ${js}
          </scr` + `ipt>
      </body>
      </html>
    `);
    doc.close();
  };

  $: js && updateIframe();
  $: css && updateIframe();
  $: html && updateIframe();

  onMount(()=>{
    updateIframe();
    iframe.addEventListener('load',
    ()=>{
      dispatch('loaded',iframe.contentWindow);
    })
  });
  
</script>

<iframe style:--height={`${height}px`} bind:this={iframe}></iframe>

<style>
  iframe {
    width: 100%;
    height: var(--height,400px);
    border: none;
  }
</style>
