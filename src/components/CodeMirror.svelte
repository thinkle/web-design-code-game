<script>
  import { onMount, onDestroy } from "svelte";
  import { EditorView } from "@codemirror/view";
  import { EditorState } from "@codemirror/state";
  import { basicSetup } from "codemirror";
  import {
    autocompletion,
    startCompletion,
    completeFromList,
  } from "@codemirror/autocomplete";

  export let value = "";
  export let lang;
  export let extensions = [];

  let editorContainer;
  let editorView;

  async function customAutocompleter(context) {
    const myItems = [
      { label: "room", type: "type", boost: 2 },
      { label: "cat", type: "type", boost: 2 },
      { label: "chair", type: "type", boost: 2 },
      { label: "box", type: "type", boost: 2 },
      { label: "basket", type: "type", boost: 2 },
      { label: "color", type: "variable", boost: 3 },
      { label: "orange", type: "value", boost: 3 },
    ];
    let cssCompleter = editorView.state.getHelpers(
      context.state,
      "autocomplete",
      lang
    );
    let defaultCompletions = [];
    if (cssCompleter) {
      defaultCompletions = cssCompleter(context);
    }

    // If there are no default completions, use completeFromList to create a completion function
    return [...completeFromList(myItems)(context), ...defaultCompletions];
  }

  const customAutocompleteExtension = autocompletion({
    override: [customAutocompleter],
  });

  // extensions = [...extensions, autocompletion(), customAutocompleteExtension];
  extensions = [...extensions];

  onMount(() => {
    editorView = new EditorView({
      parent: editorContainer,
      state: EditorState.create({
        doc: value,
        extensions: [basicSetup, lang, ...extensions],
      }),
      dispatch: (tr) => {
        if (tr.docChanged) {
          value = tr.newDoc.toString();
        }
        editorView.update([tr]);
      },
    });
    return () => {
      editorView.destroy();
    };
  });

  $: if (editorView && value !== editorView.state.doc.toString()) {
    const tr = {
      changes: { from: 0, to: editorView.state.doc.length, insert: value },
    };
    editorView.dispatch(tr);
  }

  function replaceFIXMEAndSetCursor() {
    const docContent = editorView.state.doc.toString();
    const fixmePos = docContent.indexOf("FIXME");

    if (fixmePos !== -1) {
      const transaction = editorView.state.update({
        //changes: { from: fixmePos, to: fixmePos + "FIXME".length, insert: "" },
        selection: { anchor: fixmePos, head: fixmePos + 5 },
      });
      editorView.dispatch(transaction);
      editorView.focus();
    }
  }

  $: value && editorView && replaceFIXMEAndSetCursor();
</script>

<div bind:this={editorContainer} />

<style>
  /* Your styles here */
</style>
