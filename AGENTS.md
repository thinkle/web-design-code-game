# AGENTS.md — Coding Guidelines for Web Design Code Game

This file documents conventions and best practices for AI agents (and human contributors) working on this repository.

## Repository Overview

This is a **Svelte + TypeScript + Vite** application that presents interactive web-design coding challenges in the browser. Students write CSS or JavaScript in a CodeMirror editor and see the results rendered live in an iframe.

## Key Concepts

- **ChallengeDefinition** (`src/types/challenge.ts`) — the core type. Each challenge specifies HTML, CSS/JS, starter code, a solution, lesson instructions (markdown), and a `validate` function that programmatically checks student work.
- **Challenge tracks** are assembled in `src/lib/challenges.ts`, which exports a `challengeSets` object with three tracks: `box` (Box Model), `selectors` (CSS Selectors), and `vanilla` (JavaScript).
- **Lesson markdown** lives in `src/lib/<track>/markdown/` and is imported with `?raw` for rendering.
- **Validation helpers** live in `src/lib/validation.ts` and provide reusable checks (element offsets, CSS property comparison, border detection, pseudo-selector validation, etc.).

## Tech Stack & Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | Run `svelte-check` for type errors |

## File Organization

```
src/
├── lib/
│   ├── box-model/          # Box Model challenges
│   │   ├── css/            # Shared CSS for box-model challenges
│   │   ├── markdown/       # Lesson instructions (*.md)
│   │   └── *.ts            # Challenge definitions
│   ├── selectors/          # CSS Selectors challenges (same structure)
│   ├── vanilla-js/         # JavaScript challenges (same structure)
│   ├── challenges.ts       # Master challenge registry
│   ├── codemirror/         # CodeMirror editor setup
│   └── validation.ts       # Shared validation utilities
├── components/             # Svelte components
├── types/                  # TypeScript interfaces
├── App.svelte              # Root component
├── ChallengeMenu.svelte    # Track/challenge picker
└── stores.ts               # Svelte stores
```

## Coding Conventions

### TypeScript / JavaScript
- Use `import type` for type-only imports.
- Challenge definitions should export a `const` (preferred) or `var` of type `ChallengeDefinition`.
- Validate functions can return a `ValidationResult` directly or a `Promise<ValidationResult>`.

### Challenge Content
- **Instructions** are written in Markdown and imported via `?raw` suffix.
- Inline instructions (template literals in `.ts` files) are also used for simpler challenges.
- Use fenced code blocks (` ```css `, ` ```js `, ` ```html `) in markdown for syntax-highlighted examples.
- Always close code blocks properly — a missing ` ``` ` will break rendering.

### CSS-in-Challenges
- Challenge CSS templates use `WORK` as a placeholder marker to separate hidden/immutable styles from student-editable styles.
- Starter code uses `FIXME` (and sometimes `ANDME`, `ALSOFIX`, `FIX`) as placeholder tokens that students replace.

### HTML in Challenges
- `hiddenHTMLBefore` / `hiddenHTMLAfter` wrap the student-visible HTML. Ensure opening and closing tags are properly matched and nested.

### Validation
- Use `PropertyChecker` from `validation.ts` for CSS property checks.
- Use helpers like `isElementRotated`, `calculateOffsets`, `validateSpaceBetweenElementsLR/TB`, `hasVisibleBorder`, and `validatePseudoSelector` from the same file.
- Validation messages should be short, friendly, and hint at the solution without giving it away.

## Adding a New Challenge

1. Create `src/lib/<track>/yourChallenge.ts`.
2. (Optional) Create `src/lib/<track>/markdown/yourChallenge.md` for lesson instructions.
3. Export a `ChallengeDefinition` with all required fields.
4. Import and add it to the correct array in `src/lib/challenges.ts`.
5. Run `npm run build` to verify there are no type or build errors.

## Pedagogical Notes

- Challenges are designed for high-school beginners learning web design for the first time.
- Instructions should be concise, friendly, and use examples before asking students to code.
- Avoid jargon without explanation; define technical terms on first use.
- See [PROPOSED_REVISIONS.md](PROPOSED_REVISIONS.md) for detailed pedagogical improvement suggestions.

## Quality Checklist

Before submitting changes:

- [ ] `npm run build` succeeds with no new errors
- [ ] `npm run check` passes (Svelte type checking)
- [ ] All markdown code blocks are properly opened and closed
- [ ] `hiddenHTMLBefore` / `hiddenHTMLAfter` tags are properly nested
- [ ] Typos have been checked in lesson text and validation messages
- [ ] New challenges are registered in `src/lib/challenges.ts`
