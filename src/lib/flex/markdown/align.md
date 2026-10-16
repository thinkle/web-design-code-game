# Grounding Pose

Every yoga pose starts with your paws planted firmly on the ground. But something strange is going on in this room: the cats, the scratching post and the plant are all floating up by the ceiling! 👻 Bring everything down so it stands on the floor.

## The other direction: align-items

You used `align-items: center` to find your center. Here's what's going on:
a flex container has two directions, called **axes**:

- The **main axis** is the direction the items line up in. In a row, that's left ↔ right. `justify-content` works on the main axis.
- The **cross axis** goes across it. In a row, that's top ↕ bottom. `align-items` works on the cross axis.

```css
.header {
  display: flex;
  align-items: center;
}
```

`align-items` takes values like `start`, `center` and `end`. It matters most when the items are different heights, like in this room. (The default, `stretch`, makes items without a set height stretch to fill the container.)

## Goal

Make everything in the room stand on the floor, like the Target. Leave the spacing as it is.
