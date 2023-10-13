# Put a fence around the kitty!

Oh no! The cat is worried the neighborhood dog might come
bother her. Use a border to put a fence around the kitty's
yard to protect her.

## About borders

Unlike padding and margins, which take only a single number,
borders have multiple properties you can set.

* `border-color` specifies the color of the border.
* `border-style` specifies the type of border (usually solid).
* `border-width` specifies how big the border is.

So, for example, you might specify:

```css
selector {
  border-width: 8px;
  border-style: solid;
  border-color: blue;  
}
```

You can use the shorthand `border` which lets you type all three properties (width, style, color) at once, like this:

```css
selector {
  border: 8px solid blue;
}
```
