# Dog on the Sofa

Uh oh. The dog 🐶 has taken a cat's spot on the sofa, and that cat is stuck in the dog bed! Swap them: the dog belongs in the **dog bed**, and all three cats belong on the **sofa**.

The CSS is already done: the `.sofa` spreads out whatever is inside it, and the `.dog-bed` puts whatever is inside it in the middle of the bed. You need to change the **HTML**.

## Which container is in charge?

Where an element sits in the HTML decides which flex container lays it out. An element is a flex item of the container it is **directly inside of**, its parent.

```html
<header class="top-bar">
  <h1>Cat Café</h1>
  <a href="#menu">Menu</a>
</header>
<a href="#order">Order now</a>
```

The `<h1>` and the Menu link are inside `.top-bar`, so `.top-bar`'s flexbox arranges them. The "Order now" link comes *after* the closing `</header>` tag, so `.top-bar` doesn't control it at all.

## Goal

Move the elements so that the dog is in the dog bed and the three cats are on the sofa, like the Target.
