# Cats in a Row

Three cats want to look out the window, but they're stacked on top of each other like a cat tower! 🙀 Help them sit **side by side** on the windowsill.

## Meet Flexbox

**Flexbox** is a way to lay out a group of elements. You turn the **parent** element into a *flex container*:

```css
.toolbar {
  display: flex;
}
```

Every **direct child** of a flex container becomes a *flex item*. Flex items line up in a **row**, left to right, instead of stacking up like normal `<div>`s do.

Flexbox always works on a parent and its direct children: you put `display: flex` on the *container*, not on the things inside it.

## Goal

Make the cats sit in a row on the windowsill, like the Target.
