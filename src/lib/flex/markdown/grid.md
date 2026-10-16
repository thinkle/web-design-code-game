# Bonus: The Centering Shortcut

Three cats, three boxes of different sizes. 📦 Every cat wants to sit right in the **middle** of its box.

You already know how to do this with flexbox: `display: flex`, plus `justify-content` *and* `align-items`. But centering one thing in a box is so common that web designers memorize a two-line shortcut that uses **CSS Grid**, another layout system:

```css
.card {
  display: grid;
  place-content: center;
}
```

`place-content: center` centers the content both ways at once: left-right *and* top-bottom.

## Goal

Use the grid shortcut on the boxes to put each cat in the middle of its box, like the Target.
