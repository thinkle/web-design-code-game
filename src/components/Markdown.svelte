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
  div :global(table) {
    border: 1px solid #999;
    border-collapse: collapse;
  }
  div :global(th),
  div :global(td) {
    border: 1px solid #999;
    padding: 0.5rem 1rem;
  }
</style>
