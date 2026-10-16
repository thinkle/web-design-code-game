# Cozy Cat Nap Challenge

Our cat wants to take a cozy nap, but there are a number of problems.

1. Our bed needs a headboard and a footboard! Add a brown headboard and
   footboard to the bed at the top and the bottom!
2. Our cat likes to sleep on the righthand side of the bed to leave room
   for its owner on the left. Make sure the cat is on the right side of the 
   bed.
3. Our cat needs to sleep on its own circular blanket, snuggled up right
   on the bullseye!
4. Our cat likes to drag its blanket up onto the top part of the bed so
   it can sleep right next to the pillow.


## Hints

- Use `margin` to control the space outside elements.
- Use `padding` to control the space between the content of the element and its border.
- A `margin` can be negative, but padding can't be!

## Shortcut: `-block` and `-inline`

Need the same thing on the top *and* bottom? Instead of writing
`border-top` and `border-bottom`, you can set both at once:

```css
selector {
  border-block: 1px solid #ccc; /* top and bottom */
  padding-inline: 16px; /* left and right */
}
```

`-block` means top and bottom, and `-inline` means left and right (for
English, where lines of text run left to right and stack top to bottom).
They work with `margin`, `padding` and `border`.

Let's make it a cozy nap time for the cat!
