# Find Your Center

Breathe in... and find your center. 🧘 Three cats, three boxes of different
sizes: every cat wants to sit right in the **middle** of its box.

## Centering both ways with flexbox

In the Sun Salutation, `justify-content: center` put the cats in the middle
from **left to right**. To center from **top to bottom** too, add
`align-items: center`. (It works in the other direction: more about that
soon!)

```css
.button {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Or: the grid shortcut

Centering one thing in a box is so common that web designers memorize a
two-line shortcut. It uses **CSS Grid**, another layout system:

```css
.card {
  display: grid;
  place-content: center;
}
```

`place-content: center` centers the content both ways at once. Careful,
though: it only does that with `display: grid`. In a *flex* container,
`place-content: center` only centers one way!

## Goal

The `.shelf` is already a flex row (you can see it in the editor) that lines
the boxes up along the bottom. Leave it as it is, and put each cat in the
middle of its box, like the Target. Either way of centering works.
