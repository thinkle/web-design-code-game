# Cat Yoga

Time for yoga class! 🧘 Four cats have rolled out their mats in the
**middle** of the studio, but they're squished together. Every cat needs
**24px** of elbow room between it and the next cat, so nobody's mat gets
bumped mid-stretch. 😼

## gap

`gap` puts space **between** flex items (but not at the edges of the
container):

```css
.buttons {
  display: flex;
  gap: 16px;
}
```

`gap` is much easier than putting margins on every item: you set it once,
on the container, and only the spaces *between* items get it.

## Goal

Keep the class together in the middle of the studio, with 24px between
neighbors, like the Target.
