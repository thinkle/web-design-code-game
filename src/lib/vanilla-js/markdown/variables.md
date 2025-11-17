# Saving Work with `let`

So far each time we want to change an element, we've been typing
`document.querySelector(...)` and then chaining.

Sometimes, you want to make several changes to the same element.
In that case, it can get tedious to keep repeating the same
selection over and over, like...

```js
document.querySelector(".status").style.color = "white";
document.querySelector(".status").style.backgroundColor = "midnightblue";
```

## `let` creates a variable

You can "save" any value in JavaScript by declaring a variable. For example, we can save
the element we want to change like this:

```js
let status = document.querySelector(".status");
```

You can read this like:

- “Let `status` be the result of `document.querySelector(".status")`.”
- After this line runs, the name `status` _remembers_ the `.status` element.

Once we've saved it, we can reuse it:

```js
status.textContent = "It's night-time for the cats!";
status.style.color = "white";
status.style.backgroundColor = "midnightblue";
```

Now we only had to write `document.querySelector(".status")` **once**.

## Your Turn: Night Mode for Cats 🌙

On this page there's a paragraph with the class `.status` describing the scene.

In the JavaScript:

1. Use `let` to save the `.status` element in a variable named `status`.
2. Using that same `status` variable, make _several_ changes at once:
   - Change the text to a _night-time_ description for the cats.
   - Change the styles so it _looks_ like night (a dark background and light text).

Focus on:

- Using `let` **once** to store your selection.
- Reusing the `status` variable instead of repeating `document.querySelector(...)`.

## About Variable Names

Note: there is nothing "magic" about the word `status` -- you could change that to just the
letter `s` or to `myStatusParagraph` or to `theThingIWantToChange` -- as long as you use the same name
when you declare it with `let` and when you use it later.

However, it's good practice to use descriptive names that help you remember what the variable represents.

### Rules for Variable Names

Variable names in JavaScript:

- Can only contain letters, numbers, underscores `_`, and dollar signs `$`
- Cannot start with a number
- Cannot be the same as certain reserved words which are part of the language (like `let`, `function`, `for`, `if`, etc.)
