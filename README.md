# Web Design Code Game

An interactive, browser-based coding challenge platform for teaching web design fundamentals to beginners. Inspired by [Flexbox Froggy](https://flexboxfroggy.com/), this project provides hands-on lessons where students write real CSS and JavaScript to solve fun, cat-themed puzzles with instant visual feedback.

## Challenge Tracks

The game currently includes three tracks:

| Track | Theme | Concepts Covered |
|-------|-------|-----------------|
| **Cats in Boxes** | Box Model | `padding`, `margin` (including `auto`), `border`, `box-sizing`, `display: inline-block`, per-side and `-block`/`-inline` properties, centering |
| **Find the Cats!** | CSS Selectors | Element, class, ID, descendant, child (`>`), sibling (`+`, `~`), pseudo-classes (`:hover`, `:nth-child`), pseudo-elements (`::before`, `::first-line`, `::first-letter`), comma-separated selectors |
| **Disco Cats** | Vanilla JavaScript | `document.querySelector`, DOM manipulation, `let` variables, functions, `event.target`, `addEventListener`, `for...of` loops |

Each track has 6–22 progressive challenges that scaffold from basic concepts to a capstone exercise. Student work is saved in the browser (localStorage), so it survives Back/Next and page reloads.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (included with Node.js)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL printed in your terminal (usually `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Type Checking

```bash
npm run check
```

`svelte-check` currently reports a number of pre-existing errors; changes shouldn't add new ones.

## Project Structure

```
src/
├── lib/
│   ├── box-model/        # Box Model challenge definitions & lesson markdown
│   ├── selectors/        # CSS Selectors challenge definitions
│   ├── vanilla-js/       # JavaScript challenge definitions & lesson markdown
│   ├── challenges.ts     # Master list that assembles all three tracks
│   ├── boxModelOverlay.ts # "Show the box model" hover overlay (box track)
│   ├── loopGuard.ts      # Stops infinite loops in student JavaScript
│   └── validation.ts     # Shared validation helpers
├── components/           # Svelte UI components (editor, result pane, etc.)
├── types/                # TypeScript type definitions
├── App.svelte            # Root application component
└── stores.ts             # Svelte stores for app state
```

### Adding a New Challenge

1. Create a new `.ts` file in the appropriate `src/lib/<track>/` folder.
2. Export a `ChallengeDefinition` object with `title`, `instructions`, `html`, `css`/`js`, `starterCode`, `solution`, and a `validate` function.
3. (Optional) Write lesson instructions in a `.md` file under `markdown/` and import it with `?raw`.
4. Import and add your challenge to the relevant array in `src/lib/challenges.ts`.

## Tech Stack

- **[Svelte](https://svelte.dev/)** — UI framework
- **[TypeScript](https://www.typescriptlang.org/)** — type safety
- **[Vite](https://vitejs.dev/)** — build tool & dev server
- **[CodeMirror 6](https://codemirror.net/6/)** — in-browser code editor
- **[markdown-it](https://github.com/markdown-it/markdown-it)** — lesson instruction rendering

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Contributing

Contributions are welcome! See [AGENTS.md](AGENTS.md) for coding conventions and guidance. Proposed pedagogical improvements are tracked in [PROPOSED_REVISIONS.md](PROPOSED_REVISIONS.md).

If you'd like to add a new challenge, fix a bug, or improve lesson content, feel free to open a pull request.
