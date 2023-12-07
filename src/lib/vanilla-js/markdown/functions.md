# Functions

## Delaying Actions
So far, we've only used JavaScript to do things we
could have done with CSS anyway.

The real power of JavaScript is being able to write
a list of actions that run at a later time, so that we
can respond to user actions like clicking and scrolling.

JavaScript uses *functions* to group a set of commands
that can be *called* later on to run whenever we want.

## Calling A Function from onclick=

In the HTML on this page, we use the special *onclick* 
attribute to tell the webpage to run some JavaScript
whenever the user clicks:

```html
<button onclick="spin()">Spin!</button>
```

## Defining a Function

Now in our JavaScript, we need to *define* a function,
which we do like this...

```javascript

function nameOfFunction (arguments) {
  // Body of function
  // as many lines
  // as we like
  // go here
}
```

In our case, I've already set up some CSS to make the cats spin when we apply the class "spin" to the container div.

In order to make this work, we'll change the body of
the spin function to

1. Select the div from the document
2. Grab its `classList` property
3. Call its `toggle` method with the argument "spin"

That will make it so each time we click "spin" it either adds or removes the spin class.

```javascript
document
  .querySelector("div")
  .classList
  .toggle("spin");
```

