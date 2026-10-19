# Waiting at the Door

Yoga class is about to start! 🚪 The three cats want to be first in, so
they line up right **at the door**, at the far end of the hallway.

## Lining up at the end

Remember `justify-content` from the Sun Salutation? It can also bunch
everything up at the **end** of the row: on the right, in a normal row.

```css
.toolbar {
  display: flex;
  justify-content: center;
}
```

Both `end` and `flex-end` mean "at the end" (`flex-end` is the older
name, and you'll see both in real code).

## Goal

Line the cats up against the door, like the Target. Change the **hallway**
(the container), not the cats!
