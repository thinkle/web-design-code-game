# Top and Bottom

Two cats like the top of the cat tree, and the other two want to nap down at the **bottom**. 💤 The tree is already a flex column, but all four cats are crowded at the top.

`justify-content` moves *all* the cats together, so it can't split them up. This time, you'll style one cat instead: the first napper, which has the class `sleepy`.

## Auto margins in flexbox

Remember `margin-left: auto` from *Beach Cat 2*? An `auto` margin takes up all the leftover space.

Inside a flex container, an `auto` margin on one item soaks up all the leftover space along the **main axis**. That pushes the item, *and every item after it*, all the way to the far end. Navigation bars use this all the time to push the last link (like "Log in") over to the right:

```css
.login {
  margin-left: auto;
}
```

That's a **row**, so the main axis goes left ↔ right. In a **column**, the main axis goes top ↕ bottom.

## Goal

Push the sleepy cat, and the cat after it, down to the bottom of the cat tree, like the Target. It should still work if the tree gets taller!
