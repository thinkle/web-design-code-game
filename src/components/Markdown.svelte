<script>
  import MarkdownIt from "markdown-it";
  import mdHighlightjs from "markdown-it-highlightjs";
  import "highlight.js/styles/default.css"; // Or another style of your choice

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(mdHighlightjs);

  export let markdown = "";
  $: compiledMarkdown = md.render(markdown);
</script>

<div>{@html compiledMarkdown}</div>

<style>
  div {
    line-height: 1.5;
  }
  div :global(code),
  div :global(code *) {
    background-color: var(--off-white);
    font-family: var(--code-font);
  }
</style>
