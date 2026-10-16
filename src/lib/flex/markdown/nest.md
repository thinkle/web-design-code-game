# Family Photo

Mama Cat 👑 wants a family photo: Mama on the **left**, and her three kittens stacked up in a **column** on the **right**.

This time the CSS is already written. Look at it in the *Code* section: there's a rule for `.photo`, and a rule for a `.kittens` element... but nothing in the HTML has that class yet! Your job is to change the **HTML**.

## Flexbox only works on direct children

A flex container only arranges its **direct children**. Right now, Mama and all three kittens are direct children of `.photo`, so `.photo` lines all four of them up in one row.

To lay out *some* of the items differently, put them in a **container of their own**. That new container becomes one item in the outer row, and it can be a flex container itself, with its own direction:

```html
<nav class="menu">
  <a href="/">Home</a>
  <div class="links">
    <a href="/cats">Cats</a>
    <a href="/dogs">Dogs</a>
  </div>
</nav>
```

Here `.menu` arranges just two items: the Home link and the `.links` box. The `.links` box arranges the two links inside it.

## Goal

Wrap the kittens in an element with the class `kittens` so the photo looks like the Target.
