// Protect the page from infinite loops in student JavaScript.
//
// Student code runs in a same-origin iframe, i.e. on the same thread as the
// game itself: a loop like `for (let i = 0; i < 10; i--)` would freeze the
// whole tab, editor included, so the student couldn't even fix it. We add a
// guard call at the top of every loop body; a loop that keeps running for
// more than a second is stopped and reported as an error.

const LOOP_TIMEOUT_MS = 1000;
export const LOOP_GUARD_NAME = "__loopGuard";

/**
 * Script that defines the guard; run it before the student's code. Kept on
 * one line so it doesn't shift the line numbers in error messages.
 */
export const loopGuardRuntime = (`
window.${LOOP_GUARD_NAME} = (function () {
  var started = {};
  function guard(id) {
    var now = Date.now();
    if (started[id] === undefined) {
      started[id] = now;
      /* reset once the current script or event handler has finished */
      Promise.resolve().then(function () { delete started[id]; });
      return false;
    }
    if (now - started[id] > ${LOOP_TIMEOUT_MS}) {
      delete started[id];
      return true;
    }
    return false;
  }
  guard.message = "This loop ran for more than a second, so we stopped it. Check its condition: will it ever become false? (e.g. i-- instead of i++)";
  return guard;
})();
`).replace(/\n\s*/g, " ");

/**
 * Insert `if (__loopGuard(id)) throw ...` at the start of every braced
 * `for`, `while` and `do` loop body. Strings, template literals and
 * comments are skipped. Insertions never add newlines, and the error is
 * thrown from the loop itself, so it reports the loop's line number.
 */
export function addLoopGuards(code: string): string {
  let out = "";
  let i = 0;
  let loopId = 0;
  // Positions (in `code`) of `{` that open a loop body
  const guardAt = new Set<number>();

  const isIdent = (c: string | undefined) => !!c && /[\w$]/.test(c);

  // First pass: find loop bodies
  while (i < code.length) {
    const c = code[i];
    // skip comments
    if (c === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    // skip strings
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(code, i);
      continue;
    }
    if (isIdent(c) && !isIdent(code[i - 1])) {
      const word = code.slice(i).match(/^[\w$]+/)![0];
      if (word === "for" || word === "while") {
        let j = skipSpace(code, i + word.length);
        if (code[j] === "(") {
          j = skipSpace(code, matchParen(code, j) + 1);
          if (code[j] === "{") guardAt.add(j);
        }
      } else if (word === "do") {
        const j = skipSpace(code, i + 2);
        if (code[j] === "{") guardAt.add(j);
      }
      i += word.length;
      continue;
    }
    i++;
  }

  // Second pass: copy, inserting guards
  for (i = 0; i < code.length; i++) {
    out += code[i];
    if (guardAt.has(i)) {
      out += ` if (${LOOP_GUARD_NAME}(${loopId++})) throw new Error(${LOOP_GUARD_NAME}.message);`;
    }
  }
  return out;
}

function skipSpace(code: string, i: number): number {
  while (i < code.length) {
    if (/\s/.test(code[i])) {
      i++;
    } else if (code[i] === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
    } else if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? code.length : end + 2;
    } else {
      break;
    }
  }
  return i;
}

function skipString(code: string, i: number): number {
  const quote = code[i];
  i++;
  while (i < code.length && code[i] !== quote) {
    if (code[i] === "\\") i++;
    else if (quote !== "`" && code[i] === "\n") break; // unterminated
    i++;
  }
  return i + 1;
}

/** Index of the `)` matching the `(` at position i (or end of code). */
function matchParen(code: string, i: number): number {
  let depth = 0;
  for (; i < code.length; i++) {
    const c = code[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(code, i) - 1;
    } else if (c === "(") {
      depth++;
    } else if (c === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return code.length;
}
