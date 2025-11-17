<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  export let onWindowLoaded: ((w: Window) => void) | null;
  export let onJsError: ((message: string) => void) | null = null;
  export let js = '';
  export let css = '';
  export let html = '';
  export let height : number;

  let iframe: HTMLIFrameElement;
  let frameKey: string = "";
  
  const updateIframe = () => {
    if (!iframe || !iframe.contentWindow) {
      console.log('No iframe?');
      return;
    }    
    const win = iframe.contentWindow;
    const doc = win.document;

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
            // Forward errors to the parent window
            window.onerror = function (message, source, lineno, colno, error) {
              try {
                window.parent.postMessage(
                  {
                    type: 'student-js-error',
                    message: String(message),
                    source,
                    lineno,
                    colno
                  },
                  '*'
                );
              } catch (e) {
                // Swallow any cross-origin or serialization issues
              }
            };
          </scr` + `ipt>
          <scr` + `ipt>
              ${js}
          </scr` + `ipt>
      </body>
      </html>
    `);
    doc.close();

    if (onWindowLoaded && iframe && iframe.contentWindow) {
      onWindowLoaded(iframe.contentWindow);
    }
  };

  const handleMessage = (event: MessageEvent) => {
    const data = event.data as any;
    if (!data || data.type !== "student-js-error") return;
    if (onJsError) {
      const { message, lineno, colno, source } = data;
      let formatted = String(message ?? "Unknown error");
      if (lineno != null) {
        // Adjust for lines we inject before the student's code
        const lineOffset = 2;
        const adjustedLine =
          typeof lineno === "number" && lineno > lineOffset
            ? lineno - lineOffset
            : lineno;
        formatted = `Line ${adjustedLine}${
          colno != null ? ":" + colno : ""
        } — ${formatted}`;
      }
      if (source) {
        formatted = `${formatted} (${source})`;
      }
      onJsError(formatted);
    }
  };

  // Recreate the iframe whenever the student's code or markup changes
  $: frameKey = `${html}/*sep*/${css}/*sep*/${js}`;

  // Whenever we have an iframe and code, (re)write the document into it
  $: if (iframe) {
    updateIframe();
  }

  onMount(() => {
    window.addEventListener("message", handleMessage);
  });

  onDestroy(() => {
    window.removeEventListener("message", handleMessage);
  });
</script>

{#key frameKey}
  <iframe style:--height={`${height}px`} bind:this={iframe}></iframe>
{/key}

<style>
  iframe {
    width: 100%;
    height: var(--height,400px);
    border: none;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
