<script>
  import { onMount } from 'svelte';
  
  export let js = '';
  export let css = '';
  export let html = '';
  
  let iframe;
  
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

  onMount(updateIframe);
  $: updateIframe();
</script>

<iframe bind:this={iframe}></iframe>

<style>
  iframe {
    width: 100%;
    border: none;
  }
</style>
