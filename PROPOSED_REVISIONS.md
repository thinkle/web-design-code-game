# Proposed Revisions — Web Design Code Game

This document contains suggested improvements to the lesson flow, content, and pedagogy of the three course tracks: **Box Model**, **CSS Selectors**, and **Vanilla JavaScript**. These recommendations are written with high-school beginners in mind.

Suggestions are split into two categories:
- **Framework Improvements** — changes to the platform/UI that would benefit all tracks.
- **Lesson-by-Lesson Suggestions** — content tweaks, reordering, and wording changes for individual challenges.

> **Status update (October 2026).** This review was written in February 2026. Since then, PRs #4, #5 and #6 reworked much of the content. Items that have since been addressed are marked **Done (#N)**, items that no longer apply as written are marked **Superseded**, and everything else is still open. Lesson orders below reflect the current `src/lib/challenges.ts`.

---

## General Observations

### Strengths
- **Cat theme is engaging.** The playful cat/animal scenarios keep lessons lighthearted and approachable for younger learners.
- **Instant visual feedback.** Students see CSS/JS changes rendered live alongside the editor — an excellent constructivist approach that is already built into the framework.
- **Success animations.** The platform already celebrates correct solutions with animations, providing positive reinforcement.
- **Progressive disclosure.** Concepts generally build on each other within each track.
- **Low floor, high ceiling.** Early challenges are accessible; later ones stretch capable students.
- **Visual reference tools (added since this review).** The box model track has a devtools-style "Show the box model" hover overlay (#4), and the Target can show "where the cats go" as ghost cats (#6).

---

## Framework Improvements

These are platform-level changes that would benefit all tracks.

| # | Suggestion | Rationale |
|---|-----------|-----------|
| 1 | **Add learning objectives to each challenge.** A one-line "By the end of this challenge you will be able to…" statement helps students self-assess. | Research on metacognition (Bransford et al., *How People Learn*) shows explicit goals improve retention. |
| 2 | **Provide a "Key Vocabulary" sidebar or tooltip system.** Many students encounter terms like *selector*, *property*, *value*, *element*, *class*, *function*, and *argument* for the first time. | A small, always-visible glossary would reduce cognitive overload without cluttering the main instructions. |
| 3 | **Add a "What I Learned" reflection prompt after each challenge.** Even a single sentence the student writes (or selects from options) reinforces encoding. | This is especially powerful for high-schoolers who may rush through challenges without pausing to consolidate. |
| 4 | **Include "Try It" mini-experiments.** After the main challenge, suggest a quick, optional tweak ("Now try changing the border color to your favorite color"). | Supports exploratory learning and student agency beyond the validated solution. |
| 5 | **Add intro/overview screens for each track** with a visual reference (box model diagram, selector syntax diagram, JS-DOM relationship). *Partly addressed for the box model track by the "Show the box model" overlay (#4); no intro screens yet.* | Advance organizers (Ausubel) give students a mental model *before* hands-on practice, improving transfer. |
| 6 | **Flag language-switching challenges more prominently.** Some challenges (Kitten Class, Classy HTML) switch from CSS to HTML editing. The editor bar already shows a small "html editor" / "css editor" label; an explicit banner ("For this challenge, you're editing the HTML, not CSS!") would be harder to miss. | Alternating between HTML and CSS without warning increases extraneous cognitive load. |

---

## Lesson-by-Lesson Suggestions

### Box Model Track — "Cats in Boxes"

#### Current Lesson Order
1. Cat in a Corner (padding)
2. Fighting Cats (margin)
3. Beach Cat (margin-top/bottom)
4. Beach Cat 2 (`margin: auto`; reworked in #5)
5. Fence in the Cat (border)
6. Timmy's Raft (box-sizing; added in #5)
7. Cats in Line (inline-block)
8. Cat on a Line (sides — padding/margin/border per-side)
9. Cat in Box (centering with box model)
10. Cat Nap (capstone — combines border, margin, padding, negative margin, `-block`/`-inline` shorthands)

#### Suggested Changes

| # | Suggestion | Rationale |
|---|-----------|-----------|
| 1 | **Done (#6).** ~~**padding-1.md: Add a visual before/after hint.**~~ The Target preview is now shown at half size by default next to the Result, and "Show where the cats go" overlays ghost cats on the Result. Show a small diagram or screenshot of the expected result. | Novices often don't know what "success" looks like. Providing a visual target reduces trial-and-error frustration. |
| 2 | **Still open.** **margin-1.md: Clarify margin vs. padding.** margin-1.md now says margin is the space *between* two elements, but doesn't contrast it with padding. Add a single sentence: *"Padding pushes content away from its own border; margin pushes elements away from their neighbors."* | Students often confuse the two. An explicit contrast early on prevents misconceptions from becoming entrenched. |
| 3 | **Superseded (#5).** Beach Cat 2 now teaches `margin: auto` rather than multi-direction margins, so the track goes shorthand (Fighting Cats) → single side (Beach Cat) → `auto` (Beach Cat 2). Original suggestion: ~~**Beach Cat / Beach Cat 2: Consider reordering** so that `margin-top`/`margin-bottom` (single-direction) comes *before* the general `margin` shorthand, or teach shorthand earlier and reference it.~~ | Scaffolding principle — move from simple (one direction) to complex (shorthand for all four). |
| 4 | **Already present.** border-1.md already says "Unlike padding and margins, which take only a single number, borders have multiple properties" and shows the width/style/color longhands and shorthand. ~~**border-1.md: Mention that `border` is the first property with *three sub-values*.**~~ Call out that this is different from padding/margin to set expectations. | Highlighting differences prevents the "why doesn't this work like padding?" confusion. |
| 5 | **Done (#5).** inlineBlock.md now explains that boxes normally stack on their own lines and that an `inline-block` box keeps its size, padding and margin but sits in a line like words in a sentence. ~~**inlineBlock.md: Briefly explain what `display: block` vs `display: inline` means first.**~~ Add 2–3 sentences: *"By default, `<div>` elements are `display: block` — they stack vertically. `display: inline` makes elements flow like text. `display: inline-block` combines both: block boxes that sit side by side."* | Without this context, students are memorizing a magic incantation rather than understanding *why* it works. |
| 6 | **Still open.** **sides.md: Provide a concrete example of the shorthand** `margin: top right bottom left` (clockwise). | This is a frequently tested concept and a natural extension of the per-side lesson. |
| 7 | **Partly done (#5).** `box-sizing` is now taught in its own challenge (Timmy's Raft) earlier in the track; centering.md could still remind students of it. **centering.md: Add a hint about `box-sizing: border-box`.** | Centering is notoriously tricky; extra scaffolding reduces frustration. |
| 8 | **Mostly superseded.** catnap.md already numbers the four sub-tasks, and the validation feedback lists each check. Giving estimated pixel values runs against the #5 direction of having students read sizes off the Target (with the box model overlay). Original suggestion: ~~**Cat Nap (capstone): Add an explicit checklist in the instructions** … with estimated pixel values.~~ | Capstone challenges should feel achievable, not overwhelming. Breaking it into visible sub-goals supports self-regulation. |
| 9 | **Still open.** **Consider adding one more challenge between "Cats in Line" and "Cat on a Line"** that practices `border-left`, `border-right` etc. before combining all per-side properties at once. | The jump from "just set `display: inline-block`" to "precisely position a cat using per-side padding, margin, and border" is the steepest difficulty spike in the track. |

---

### CSS Selectors Track — "Find the Cats!"

#### Current Lesson Order
1. Flip the Cats! (element selectors)
2. Flip the Chair! (element selectors)
3. Jumping on Beds (descendant selectors)
4. Classy Paragraphs (class selectors)
5. Kitten Class (adding classes in HTML)
6. Nested Classes (descendant + class)
7. Shady Cats (combining two classes)
8. Classy HTML (multiple classes on one element)
9. Highlander Kitty (ID selectors)
10. Basic Link Styling (tag selector on `<a>`)
11. Differentiating Link Styling (descendant selectors with links)
12. Building a Menu (complex link/list styling)
13. Hover Magic (`:hover` pseudo-class)
14. Pet Peeves (`::before` pseudo-element)
15. Party Time (comma-separated selectors)
16. Cats on the Bed Only (child combinator `>`)
17. Spooked Cats (adjacent sibling `+`)
18. Full Bed Panic (general sibling `~`)
19. Dear Diary (`::first-line`)
20. Opening Lines (`::first-letter` + combinator)
21. Lineup Order (`:nth-child`, `:first-child`, `:last-child`)
22. CatBlog Polish (capstone)

#### Suggested Changes

| # | Suggestion | Rationale |
|---|-----------|-----------|
| 1 | **Still open.** **Challenges 1 and 2 teach the same concept (element selectors).** Consider merging them or making Challenge 2 slightly harder (e.g., selecting two different element types) to avoid repetition. | Repetition without added complexity can feel tedious and reduce motivation. |
| 2 | **Still open.** **Challenges 7 and 8 both involve multiple classes** but approach them differently (CSS combination vs. HTML attribute). Consider placing 8 (adding classes in HTML) before 7 (selecting combined classes in CSS), since understanding the HTML side first makes the CSS side clearer. | The principle of *concrete before abstract* — see the HTML first, then select it with CSS. |
| 3 | **Still open.** **Links block (Challenges 10–12): The difficulty jumps sharply.** Challenge 10 is straightforward, but Challenge 12 ("Building a Menu") introduces list-style, specificity issues, and debugging — all at once. Consider adding a bridging challenge. | Gradual complexity increase prevents the "I was doing fine, then I hit a wall" experience. |
| 4 | **Still open.** **Challenge 12 ("Building a Menu") — the FIX comments "Why isn't this working???"** are pedagogically interesting, but students need more scaffolding. Add a hint: *"Remember, the color property on `.pink` applies to the `<li>`, but the link `<a>` has its own default color. How can you target the link inside `.pink`?"* | Debugging is a great skill to teach, but unguided debugging often leads to frustration in beginners. |
| 5 | **Done (#5).** Hover Magic now shows an interaction prompt ("Now hold your mouse over the cat in the Result to check your work!"), and stale hover feedback was fixed. ~~**Challenge 13 (Hover Magic) — test validation requires the student to hover in the result pane.** Make this requirement more prominent.~~ | Students who don't read to the end will miss this and think their code is broken. |
| 6 | **Still open.** **Pseudo-elements block (Challenges 14, 19, 20): These are scattered.** Consider grouping `::before`, `::first-line`, and `::first-letter` together, since they share the `::` syntax. | Grouping related concepts reinforces the pattern and reduces confusion with pseudo-*classes* (`:hover`, `:nth-child`). |
| 7 | **Still open.** (The broken code block in this lesson was fixed in #5.) **Challenge 15 (Comma-separated selectors) includes a long explanation of border-triangles** that may distract from the comma concept. Consider shortening the border-triangles section or moving it to a "Did you know?" sidebar. | Extraneous material during instruction can split attention (Mayer's coherence principle). |

---

### Vanilla JavaScript Track — "Disco Cats"

#### Current Lesson Order
1. Query Selector (selecting by ID)
2. More Queries (multiple querySelector calls)
3. Saving Work with `let` (variables)
4. Functions (defining and calling; onclick)
5. Event Targets (event.target; reusable handlers)
6. Event Listeners (addEventListener; for loops)

#### Suggested Changes

| # | Suggestion | Rationale |
|---|-----------|-----------|
| 1 | **Still open.** **query1.md is very long** (~400 words of instruction for a single querySelector call). Consider splitting it into two sections: a short "Try it" intro, and a collapsible "Deep Dive" for students who want more. | Beginners can be overwhelmed by walls of text. Chunking improves processing (Miller's Law). |
| 2 | **Still open.** **query1.md discusses error handling and null checks** ("Cannot read properties of null"). While valuable, this is advanced for a first lesson. Consider moving the debugging/error discussion to a dedicated "Debugging Tips" sidebar that appears after the student makes their first error. | Just-in-time learning is more effective than front-loaded theory for procedural skills. |
| 3 | **Still open.** variables.md already stresses using `let` **once** to store a selection; a "common mistake" box would make it explicit. **variables.md is excellent.** Consider adding a small "common mistake" box: *"Remember: `let` only needs to appear once, the first time you create the variable."* | Beginners often write `let x = ...` on every line, causing re-declaration errors. |
| 4 | **Already present.** functions.md already walks through the chain step by step (select the element, grab its `classList`, call `toggle`) before showing the combined code. ~~**functions.md: Break the `classList.toggle("spin")` chain down step by step.**~~ | Long chains are hard for beginners to parse; explicit decomposition builds understanding. |
| 5 | **Still open.** **functions2.md: The word "event" is used in many senses** (the `event` parameter, the click event, the `onclick` attribute). Add a small glossary or color-code the different usages. | Polysemy (same word, different meanings) is a known source of confusion in programming education. |
| 6 | **Still open.** **functions3.md: The `for...of` loop is introduced without explanation.** Add 2–3 sentences: *"A `for...of` loop runs the same code for each item in a collection. Here, `document.querySelectorAll('cat')` returns a collection of all `<cat>` elements, and the loop runs the code inside `{ }` once for each cat."* | Students who haven't seen loops before will be lost without this context. |
| 7 | **Still open.** **Consider adding a 7th challenge** that introduces `textContent` or `innerHTML` manipulation, since the track currently only covers style changes and classList. A challenge like "Click a cat to show its name in a paragraph" would reinforce DOM manipulation with a different property. | Broadens the repertoire of DOM manipulation techniques while reinforcing querySelector and event handling. |

---

## Summary of Top-Priority Changes

### Framework
1. Add intro/overview screens for each track with a visual reference.
2. Add explicit banners when challenges switch between CSS and HTML editing.
3. Add a key vocabulary sidebar or tooltip system.

### Lesson Content
1. Smooth difficulty spikes in the Selectors track (Challenges 10→12) and Box Model track (Cats in Line → Cat on a Line).
2. Chunk query1.md into a short intro + collapsible deep dive.
3. Add brief `for...of` loop explanation in functions3.md.
4. Add a margin-vs-padding clarification sentence in margin-1.md.

These changes would improve accessibility for struggling learners while preserving the experience for advanced students.
