# More Disco Colors

Let's keep practicing reaching into the document
and changing cats. Follow the pattern for Miguel and
let's set some properties on Kim and Marisol as well:
Kim will bring a glow-stick to the disco and Marisol
will dress in pink!

## Properties:

- Kim: set the filter property to `"drop-shadow(4px 4px 4px green);"` to give him a glowstick green glow!
- Marisol: set the *filter* style property to `"hue-rotate(270deg)"` to change her color to pink!

## Concepts

Remember we can grab an element by ID with

```javascript
document
  .querySelector("#ID")
```

We can then grab its *style* property using *dot chaining* with a `.style` and from there we can
set a CSS property using *assignment* with an `=` like...

```javascript
document
  .querySelector("#miguel")
  .style
  .filter = "invert(1)";
```

