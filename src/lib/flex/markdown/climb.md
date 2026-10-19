# Climbing Wall

Climbing builds strong cats! 💪 This climbing wall has three holds, and
each cat wants to perch on one.

The wall is already a flex **column** with its cats centered left to right.
Now spread the cats out from top to bottom.

## space-around

`space-between` pushed the first and last items all the way to the edges.
`space-around` gives **every item the same space on both sides** instead.
That means there's a little space at the edges too: half as much as between
two items, because in the middle, two items' spaces add up.

```css
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
```

Remember: in a **column**, `justify-content` works from top to bottom!

## Goal

Put one cat on each climbing hold, like the Target.
