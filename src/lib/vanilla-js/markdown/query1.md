# Selecting `id="miguel`

Use JavaScript to dress "Miguel" in his disco colors. The code to change his color is already in place: you just need to fix the selector passed to `querySelector` to match `<cat id="miguel">`

## Reaching Into the DOM

The first step to using JavaScript to change a webpage is reaching into the HTML to select an element.

We can _reach into the document_ by calling a special
_method_ of document called `querySelector`. In JavaScript, you _call_ a function by writing its name
and then parentheses, and _handing_ it "arguments."

For example, to select a `<div>` and set its border to
red, we could write:

```javascript
document.querySelector("div").style.border = "1px solid red";
```

Note that adding whitespace (spaces, tabs, newlines) does not change the meaning of the code -- I have added whitespace here to make it easier to read. You could write this all on one line if you wanted to:

```javascript
document.querySelector("div").style.border = "1px solid red";
```

## Calling functions

When you see a parentheses in JavaScript, it is
taking an action, so the line `querySelector('div')`
is asking JavaScript to look for a div.

## Chaining: `.`

The `.` characters between symbols in JavaScript help us _chain_ together logic -- we can think of it like the word "of" or "from" in English, so I would read the above as "the border _of_ the style _of_ the result
of _querySelector('div')_ _from_ the document.

### Chaining and Errors

Note that when we _chain_ calls together with `.`, if any part of the chain fails (for example, if `querySelector` doesn't find anything) then we will throw an error.

So, for example, when this example first runs with `document.querySelector("FIXME")`, we will get a confusing error. The error will actually happen at the _next_ step of the chain when we try to access `.style` of our element. It will say `"Cannot read properties of null"` because `querySelector` returned `null` (meaning it didn't find anything) and we can't read the `style` property of `null`.

There is a good rule of thumb in programming that often the _first_ place an error shows up is not the _actual_ source of the error, so when debugging, it's often good practice to "look up" because very often the actual error happens right _before_ the place where the error shows up.

## Strings

Note: when you see quotes (either double quotes or single quotes) in JavaScript, that means we are working with a _string_ -- a sequence of characters. In the case of `querySelector`, we are passing a string that describes what kind of element we want to select.

When you see text _without_ quotes, that means we are working with variables, properties, or functions, which are defined elsewhere in the code. In JavaScript, we work with numerous _objects_ which have _properties_ we access with "chaining" and which are built into the language. So, for example, any time you run JavaScript on a webpage, you can use the `document` object, and every time you select an element on a webpage, it will have numerous properties like `style` (representing it's CSS style) `classList` (representing the list of CSS classes applied to it), textValue (representing the text inside it), and many more.

An important difference between things in and out of quotes is that if you misspell something in quotes, JavaScript won't complain, but if you make an error with a variable or property name, JavaScript will throw an error.

## Selecting Miguel

In the code on the left, I've already written the code
to set the filter property to "invert" colors. Update the _argument_ of the _querySelector_ call so that it
successfully selects the cat with id="miguel"

**Remember, IDs are selected with the # symbol. So to
select an item with id="joe" I would write "#joe"**
