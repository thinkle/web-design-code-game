# Reusable Functions

You can use the same function in more than one place in your code. So in this example, *each cat* has an `onclick=` attribute setting it to spin, so we can click one cat at a time.

The `event` object is a special JavaScript object representing
what a user does. Events have a `target` property which points
to the HTML Element that "triggered" the event (i.e. the thing
the user clicked).

So where as before we might have written something like:

```javascript
document
  .querySelector("#miguel") // get Miguel
  .classList // get his list of classes
  .toggle("spin") // add or remove "spin"
```

Now in our even handler, we can target whatever element was
clicked by using `event.target` in place of `document.querySelector(...)`. Like so:

```javascript
function spin (event) {
  event
  .target
  .classList
  .toggle("spin");
}
```