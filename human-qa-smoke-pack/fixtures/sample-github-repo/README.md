# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard with sample data in `data/feature-requests.csv`.

It has **Priority** and **Status** filters that compose (changing one keeps the
other). Both dropdowns are built from the data at load time, so they stay in
sync with whatever values appear in the CSV — no hand-maintained option lists.

## How to run

Open `src/index.html` in a browser (double-click works).

When opened straight from disk (`file://`), browsers block `fetch`, so the app
falls back to an embedded copy of the CSV baked into `src/app.js`. Serve the
folder over http (for example `python -m http.server` from
`human-qa-smoke-pack/fixtures/sample-github-repo`) to have it read
`data/feature-requests.csv` directly. Keep the embedded copy in `app.js` in sync
if you edit the CSV.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
