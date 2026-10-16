# Stretching Room

A good stretch takes space! Cats need room to reach their paws out. 😾

- On the **fence**, the cats want one cat on each fence post: one at each end and one in the middle.
- On the **floor**, each cat wants its own cushion.

## Spreading items out with justify-content

`justify-content` can also spread items out along the row, using the leftover space:

| value | what happens to the leftover space |
|-------|-------------------------------------|
| `space-between` | goes *between* the items. The first and last items touch the edges. |
| `space-around` | goes *around* each item: every item gets the same space on its left and right, so the edges get half as much space as the gaps between items. |
| `space-evenly` | is split evenly: the edges get exactly as much space as the gaps between items. |

For example, a navigation bar might spread its links out like this:

```css
nav {
  display: flex;
  justify-content: space-evenly;
}
```

## Goal

Look carefully at the Target: which kind of spreading does the fence need, and which does the floor need?
