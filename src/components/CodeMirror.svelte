<script>
  import { onMount } from "svelte";
  import { EditorView } from "@codemirror/view";
  import { EditorState } from "@codemirror/state";
  import { basicSetup } from "codemirror";

  export let value = "";
  export let lang;
  export let extensions = [];

  let editorContainer;
  let editorView;

  // extensions = [...extensions, autocompletion(), customAutocompleteExtension];
  extensions = [...extensions];

  // This is code, not prose: ask spellcheck and grammar extensions
  // (Grammarly, LanguageTool, etc.) to leave the editor alone.
  const noGrammarCheck = EditorView.contentAttributes.of({
    spellcheck: "false",
    autocorrect: "off",
    autocapitalize: "off",
    translate: "no",
    "data-gramm": "false",
    "data-gramm_editor": "false",
    "data-enable-grammarly": "false",
    "data-lt-active": "false",
  });

  onMount(() => {
    editorView = new EditorView({
      parent: editorContainer,
      state: EditorState.create({
        doc: value,
        extensions: [basicSetup, lang, noGrammarCheck, ...extensions],
      }),
      dispatch: (tr) => {
        if (tr.docChanged) {
          value = tr.newDoc.toString();
        }
        editorView.update([tr]);
      },
    });
    replaceFIXMEAndSetCursor();
    return () => {
      editorView.destroy();
    };
  });

  $: if (editorView && value !== editorView.state.doc.toString()) {
    const tr = {
      changes: { from: 0, to: editorView.state.doc.length, insert: value },
    };
    editorView.dispatch(tr);
    // New starter code (new challenge or Restart): jump to the FIXME.
    // Only here, not on every keystroke, or the cursor would keep jumping
    // back to FIXME while the student types elsewhere.
    replaceFIXMEAndSetCursor();
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
</script>

<div bind:this={editorContainer} />

<style>
  /* Your styles here */
</style>
