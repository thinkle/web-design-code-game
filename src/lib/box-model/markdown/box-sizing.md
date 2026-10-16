# Timmy's Raft

Timmy is special, so he gets a gold outline on his raft. But he's not
*that* special: his raft should be the same size as his friends' rafts!

Somebody already gave Timmy's raft a gold `border` and some `padding`,
but now his raft is bigger than everybody else's. Fix it so it's the same
size as the others, without taking away his gold outline.

## Why did the raft grow?

By default, `width` and `height` only measure the *content* of a box.
Padding and border get added on the *outside*, so a box that's
`width: 80px` with `8px` of padding and an `8px` border on each side
actually ends up `80 + 8 + 8 + 8 + 8 = 112px` wide!

The `box-sizing` property changes how `width` and `height` are measured:

- `box-sizing: content-box;` (the default): width and height measure just
  the content. Padding and border make the box bigger.
- `box-sizing: border-box;`: width and height measure the whole box,
  border and all. Padding and border squeeze the content inside instead.

```css
selector {
  box-sizing: border-box;
}
```

Lots of web developers find `border-box` so much easier to think about
that they put it on *every* element at the top of their stylesheets!

**Tip:** tick **Show the box model** and hover over the rafts to compare
their sizes.
