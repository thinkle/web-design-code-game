# Balancing Act

Time to work on balance! 🪨 Four cats are crossing the pond on stepping
stones, and each cat needs to balance on its own stone.

## space-evenly

Here are three ways to spread items out:

| value | the space at the edges is... |
|-------|------------------------------|
| `space-between` | nothing: the first and last items touch the edges |
| `space-around` | half as much as the space between items |
| `space-evenly` | exactly the same as the space between items |

```css
.gallery {
  display: flex;
  justify-content: space-around;
}
```

## Goal

Look closely at the stones in the Target. Is the space at the edges of the
pond the same as the space between stones? Put one cat on each stone.
