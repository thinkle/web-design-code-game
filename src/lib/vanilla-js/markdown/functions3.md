# Listening for Events

When we add an `onclick=` attribute in HTML, we are telling the **element** to **listen** for a **click** event.

You can also use JavaScript to set up an event listener rather than writing it directly in your HTML (in fact, that is usually the *preferred* way of doing it).

To add an event listener to an element, you can use the `addEventListener` method of an HTML Element. When you *call* `addEventListener`, you must give it the *name* of the event and the *function* to run, like this...

```javascript
document
  .querySelector("button")
  .addEventListener(
    "click",
    myFunctionToRunWhenTheyClick
  )
```

In the code I've set up for you, I've used a the `document.querySelectorAll` method to get *every* cat in the document (there are a hundred!). I've then used a *for loop* to run some code *for each cat* which will enable you to set all one hundred cats to listen for a click event, by writing:

```javascript
for (let cat of document.querySelectorAll("cat")) {
  cat.addEventListener("click",spin);
}
```

## Other Events

There are more events than just click. Try changing "click" to "mouseover" to make it so just moving the mouse over the cats make them spin!

Some other events you might want to play with are:

- click
- dblclick
- mouseover
- mouseout
- touchstart
- touchend
- mousewheel
- mouseup
