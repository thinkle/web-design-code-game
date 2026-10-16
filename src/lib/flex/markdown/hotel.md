# Cat Hotel

Welcome to the Cat Hotel! 🏨 Time to show off your flex. 💪 The hotel is full of cats, but nothing is in the right place yet. Use everything you've learned to lay out the whole hotel like the Target.

The HTML has boxes inside boxes. Each box is a flex container for **its own direct children** only:

- `.hotel` holds three floors: the `.roof`, the `.rooms` and the `.lobby`.
- `.rooms` holds three rooms (each one is a `.room`), and each `.room` holds one cat.
- `.roof` and `.lobby` hold cats.

## Checklist

1. **The hotel:** the roof at the very top, the lobby at the very bottom, and the rooms in between.
2. **The roof:** the rooftop cat sits in the middle.
3. **The rooms:** spread out across the floor.
4. **Each room:** its cat right in the middle, both ways.
5. **The lobby:** the two greeter cats stand on the floor at the right, with some space between them.

## Cheat sheet

| property | what it does |
|---|---|
| `display: flex` | makes an element a flex container |
| `flex-direction` | `row` (the default) or `column` |
| `justify-content` | places items along the main axis: `start`, `center`, `end`, `space-between`, `space-around`... |
| `align-items` | places items along the cross axis: `start`, `center`, `end`... |
| `gap` | space between items |

Remember: in a `column`, the main axis goes top ↕ bottom.
