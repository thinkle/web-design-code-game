<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { attachBoxModelOverlay } from "../lib/boxModelOverlay";
  import { addLoopGuards, loopGuardRuntime } from "../lib/loopGuard";
  export let onWindowLoaded: ((w: Window) => void) | null;
  export let onJsError: ((message: string) => void) | null = null;
  export let js = '';
  export let css = '';
  export let html = '';
  export let wrapperClass = '';
  /** Show devtools-style box model highlighting on hover */
  export let boxModel = false;
  export let height : number;

  let iframe: HTMLIFrameElement;
  let frameKey: string = "";
  let overlayLayer: HTMLDivElement;
  let tipLayer: HTMLDivElement;
  let detachOverlay: (() => void) | null = null;

  // Called when the checkbox changes *and* directly after every iframe
  // (re)write. (A reactive dependency on the loaded document isn't enough:
  // when the challenge changes, the iframe is replaced after this component's
  // reactive statements have already run, so the overlay never re-attached.)
  function syncOverlay(enabled: boolean) {
    if (detachOverlay) {
      detachOverlay();
      detachOverlay = null;
    }
    if (enabled && iframe && overlayLayer) {
      detachOverlay = attachBoxModelOverlay(iframe, overlayLayer, tipLayer);
    }
  }
  $: syncOverlay(boxModel);
  
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
  .frame-wrap {
    position: relative;
  }
  .box-model-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .box-model-tips {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }
  .box-model-tips :global(.box-model-tip) {
    position: absolute;
    z-index: 1;
    background: #242424;
    color: #f5f5f5;
    font:
      11px/1.35 ui-monospace,
      monospace;
    padding: 4px 6px;
    border-radius: 4px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  .box-model-tips :global(.box-model-tip strong) {
    color: #ffd27f;
  }
  .box-model-tips :global(.box-model-tip i) {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 5px;
    border: 1px solid #fff8;
  }
              ${css}
          </style>
      </head>
      <body>
          <wrapper class="${wrapperClass}">${html}</wrapper>
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
          </scr` + `ipt><scr` + `ipt>${loopGuardRuntime}</scr` + `ipt>
          <scr` + `ipt>
              ${addLoopGuards(js || "")}
          </scr` + `ipt>
      </body>
      </html>
    `);
    doc.close();
    syncOverlay(boxModel);

    if (onWindowLoaded && iframe && iframe.contentWindow) {
      onWindowLoaded(iframe.contentWindow);
    }
  };

  const handleMessage = (event: MessageEvent) => {
    const data = event.data as any;
    if (!data || data.type !== "student-js-error") return;
    if (onJsError) {
      const { message, lineno, colno, source } = data;
      if (event.source && iframe && event.source !== iframe.contentWindow) {
        return; // from the other preview
      }
      // Drop browser-internal wording: student code runs via document.write
      let formatted = String(message ?? "Unknown error").replace(
        "Failed to execute 'write' on 'Document': ",
        ""
      );
      if (lineno != null) {
        // Adjust for lines we inject before the student's code
        const lineOffset = 2;
        const adjustedLine =
          typeof lineno === "number" && lineno > lineOffset
            ? lineno - lineOffset
            : lineno;
        // (No column: loop guards inserted into the code would skew it)
        formatted = `Line ${adjustedLine} — ${formatted}`;
      }
      const pageUrl = window.location.href.split("#")[0];
      if (source && source.split("#")[0] !== pageUrl) {
        formatted = `${formatted} (${source})`;
      }
      onJsError(formatted);
    }
  };

  $: if (iframe && iframe.contentDocument) {
    const wrapper = iframe.contentDocument.querySelector("body > wrapper");
    if (wrapper) wrapper.className = wrapperClass;
  }

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
    if (detachOverlay) detachOverlay();
  });
</script>

<div class="frame-wrap">
  {#key frameKey}
    <iframe style:--height={`${height}px`} bind:this={iframe}></iframe>
  {/key}
  <div class="box-model-layer" bind:this={overlayLayer}></div>
  <div class="box-model-tips" bind:this={tipLayer}></div>
</div>

<style>
  .frame-wrap {
    position: relative;
  }
  .box-model-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .box-model-tips {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }
  .box-model-tips :global(.box-model-tip) {
    position: absolute;
    z-index: 1;
    background: #242424;
    color: #f5f5f5;
    font:
      11px/1.35 ui-monospace,
      monospace;
    padding: 4px 6px;
    border-radius: 4px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  .box-model-tips :global(.box-model-tip strong) {
    color: #ffd27f;
  }
  .box-model-tips :global(.box-model-tip i) {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 5px;
    border: 1px solid #fff8;
  }
  iframe {
    width: 100%;
    height: var(--height,400px);
    border: none;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
