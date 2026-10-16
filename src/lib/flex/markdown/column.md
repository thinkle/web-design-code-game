# Cat Tower

Climbing builds strong cats! 💪 This cat tower has three platforms: one at the top, one in the middle and one at the bottom. 🐾 Put one cat on each platform.

## Columns: flex-direction

By default, a flex container lines its items up in a row. To stack them in a **column** instead, use `flex-direction`:

```css
.sidebar {
  display: flex;
  flex-direction: column;
}
```

In a column, the **axes swap**:

| | `row` (the default) | `column` |
|---|---|---|
| main axis: `justify-content` | left ↔ right | top ↕ bottom |
| cross axis: `align-items` | top ↕ bottom | left ↔ right |

So in a column, `justify-content` moves things **up and down**, and `align-items` moves them **left and right**.

## Goal

Stack the cats on the tower's platforms, like the Target. You'll need all three: `flex-direction`, `justify-content` and `align-items`.
