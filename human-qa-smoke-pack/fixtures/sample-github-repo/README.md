# Code Tab QA Sample App

This disposable repo fixture is for human QA of Code Tab's GitHub/repo workflows.

## What it is

A static feature-request dashboard with sample data in `data/feature-requests.csv`.

Filter cards by **priority** and **status**. Both dropdowns compose, their options are
built from the data, active filters are shown as chips, and **Reset filters** clears them.

## How to run

Open `src/index.html` in a browser.

Browsers block `fetch` on `file://` pages, so opening the file directly falls back to a
built-in copy of the sample data (the dashboard says which source it used). To load
`data/feature-requests.csv` for real, serve the repo root over HTTP:

```bash
python -m http.server 8000   # or: npx serve .
```

Then open <http://localhost:8000/src/index.html>.

## QA task

Ask Code Tab to review the repo and add a status filter while preserving the existing priority filter.
