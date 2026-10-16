# Stretching Room

A good stretch takes space! Cats need room to reach their paws out. 😾
These three cats want **one cat on each fence post**: one at each end,
and one in the middle.

## Spreading items out: space-between

So far, `justify-content` has bunched the cats up together. It can also
**spread them out**, sharing the leftover space between them. With
`space-between`, all the leftover space goes *between* the items: the first
item goes all the way to the start, and the last one all the way to the
end.

```css
nav {
  display: flex;
  justify-content: space-between;
}
```

That's handy for a navigation bar with a logo at one end and a menu at
the other.

## Goal

Put one cat on each fence post, like the Target.
