# Elbow Room

These four cats like to sit together in the **middle** of the mat, but not *too* close: they want exactly **24px** of space between each cat and the next. 😼

## gap

`gap` puts space **between** flex items (but not at the edges of the container):

```css
.buttons {
  display: flex;
  gap: 16px;
}
```

`gap` is much easier than putting margins on every item: you set it once, on the container, and only the spaces *between* items get it.

## Goal

Put the cats together in the middle of the mat with 24px between neighbors, like the Target.
