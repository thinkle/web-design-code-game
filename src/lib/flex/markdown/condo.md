# Cat Condos

The builders put the cat condos together all wrong! 🏗️ The condos are piled
on top of each other, and the cats are lying on their sides.

Fix it so the condos **stand side by side** along the street, with each
condo's cats **stacked up** inside it, like the Target.

## Two containers, two directions

There are two kinds of flex containers here, one inside the other:

- the `.street` arranges its children: the **condos**
- each `.condo` arranges *its* children: the **cats**

Each container only arranges its own **direct children**, and each one gets
its own `flex-direction`. For example, a page header might run in a row
while the menu inside it runs in a column:

```css
.header {
  display: flex;
  flex-direction: row;
}

.header .menu {
  display: flex;
  flex-direction: column;
}
```

Remember from the Cat Tower: when you change a container's direction,
`justify-content` and `align-items` swap axes along with it.

## Goal

Make the condos stand side by side, with the cats stacked up at the bottom of
each condo, like the Target. Ask yourself, for each container: *which way
should its children line up?*
