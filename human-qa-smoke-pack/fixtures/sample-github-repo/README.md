# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard with sample data in `data/feature-requests.csv`.

Filtering:

- **Priority** and **Status** filters compose — changing one preserves the other.
- Both dropdowns are built from the data in `src/app.js`, so new priority or status
  values show up automatically.
- Each option shows a contextual count of how many requests it would match given the
  other filter's current value.
- **Clear filters** resets both to All (disabled when nothing is filtered).
- The selected filters are remembered in `localStorage` across reloads.

## How to run

Open `src/index.html` in a browser — no build step, no dependencies, no server.

If your browser restricts `file://` pages, serve the folder instead:

```bash
cd src
python -m http.server 8000   # then open http://localhost:8000
```

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
