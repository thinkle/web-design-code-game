# Warm-Up Stretch

Welcome to cat yoga! 🧘 Before class, three cats want to warm up with a stretch on the windowsill, but they're stacked on top of each other like a cat tower! 🙀 Help them sit **side by side** on the windowsill.

## Meet Flexbox

**Flexbox** is the most *flexible* way to lay out a group of elements in CSS: it can bend a row into a column, stretch things out, and spread them apart. You turn the **parent** element into a *flex container*:

```css
.toolbar {
  display: flex;
}
```

Every **direct child** of a flex container becomes a *flex item*. Flex items line up in a **row**, left to right, instead of stacking up like normal `<div>`s do.

Flexbox always works on a parent and its direct children: you put `display: flex` on the *container*, not on the things inside it.

## Goal

Make the cats sit in a row on the windowsill, like the Target.
