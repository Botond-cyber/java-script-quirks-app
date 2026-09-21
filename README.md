# JavaScript is weird — Interactive WTFJS Notebook

An interactive, Jupyter/Colab-style notebook built for a **live classroom presentation** about the
surprising behavior of JavaScript. Show a snippet, ask the class to guess the output, run the real
code in the browser, reveal the answer, and expand a short explanation.

Built with **React + Vite + TypeScript + Tailwind CSS**. Fully client-side — no backend, no
database, no authentication.

## Features

- Notebook / paper aesthetic with syntax-highlighted code cells and a terminal-style output area
- **Real** JavaScript execution in the browser (outputs are never hard-coded)
- Multiple-choice "guess the output" rounds with score tracking
- **Presentation Mode** with large type for projecting onto a classroom screen
- Keyboard controls: `→` next, `←` previous, `Space` run/reveal, `Esc` exit presentation
- A notebook overview to jump between sections
- A dramatic Final Boss round and a playful Banana round
- Deployable to GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:3000).

```bash
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build locally
```

## Editing the questions

All content lives in **`src/data/questions.ts`**. Each round is a plain object:

```ts
{
  id: "floating-point",
  title: "Floating Point Betrayal",
  code: "console.log(0.1 + 0.2);",
  choices: ["0.3", "0.30000000000000004", "0.31", "Error"],
  correctAnswer: 1,          // index into `choices`
  explanation: "...",
  // optional:
  note: "Compare with the last one...",
  bonusCode: "console.log(Number.isNaN(NaN));",
  finalBoss: true,           // dramatic styling
  banana: true,              // banana easter egg
  extra: true,               // "Extra Weirdness" (not counted in the main run)
}
```

The UI renders every question dynamically, so you can add, remove, or reorder rounds without
touching the components. The opening title puzzle lives in the same file as `titlePuzzle`.

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages on every push to `main`.

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be served at:

```
https://<your-username>.github.io/<repo-name>/
```

### The base path

Vite needs to know the sub-path the site is served from. The workflow sets it automatically from
the repository name via the `BASE_PATH` environment variable:

```
BASE_PATH=/<repo-name>/  npm run build
```

If you build manually and your repo is named something else, pass the matching path. When no
`BASE_PATH` is provided, production builds default to `/javascript-weird/` (see `vite.config.ts`),
and local dev always uses `/`.
