# Disco Cats

Use JavaScript to dress "Miguel" in his disco colors by setting his filter to invert(1).

# Reaching Into the DOM

The first step to using JavaScript to change a webpage is reaching into the HTML to select an element.

We can *reach into the document* by calling a special
*method* of document called `querySelector`. In JavaScript, you *call* a function by writing its name
and then parentheses, and *handing* it "arguments." 

For example, to select a <div> and set its border to
red, we could write:

```javascript
document
  .querySelector('div')
  .style
  .border = '1px solid red';
```

## Calling functions
When you see a parentheses in JavaScript, it is 
taking an action, so the line `querySelector('div')`
is asking JavaScript to look for a div.

## Chaining: `.` 
The `.` characters between symbols in JavaScript help us *chain* together logic -- we can think of it like the word "of" or "from" in English, so I would read the above as "the border *of* the style *of* the result
of *querySelector('div')* *from* the document.

## Selecting Miguel

In the code on the left, I've already written the code
to set the filter property to "invert" colors. Update the *argument* of the *querySelector* call so that it 
successfully selects the cat with id="miguel"

**Remember, IDs are selected with the # symbol. So to 
select an item with id="joe" I would write "#joe"**