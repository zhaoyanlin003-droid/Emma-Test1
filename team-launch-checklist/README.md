# Team Launch Checklist

A single-file web app for running a product or feature launch. One HTML file, no
dependencies, no build step, no server required.

> **Note:** this repo also contains an earlier checklist app at
> [`launch-checklist/`](../launch-checklist/). This is a separate, standalone version —
> the two keep their progress in different browser storage keys and do not affect
> each other.

## Sections

The default template ships with 25 tasks across four sections, each tagged with a
suggested owner:

| Section | What it covers |
| --- | --- |
| **Planning** | Brief, scope, target date, owners, metrics, rollback plan |
| **Content** | Product copy, docs, blog post, assets, email, support material |
| **Approvals** | Legal, security, brand, engineering, finance, exec go / no-go |
| **Launch day** | The runbook for the day itself |

## Features

- Name the launch and set a target date
- Check tasks off — per-section tallies, an overall count, and a progress bar update
  instantly (the bar turns green at 100%)
- Add tasks to any section (type and press <kbd>Enter</kbd>, or click **Add**) and
  remove any task with the **×** button
- Progress saves automatically to `localStorage`, so it survives a refresh
- **Export JSON** to hand the checklist to a teammate, **Import JSON** to load theirs
- **Print** for a clean paper or PDF copy — buttons and inputs are hidden
- **Reset to template** to start a new launch

## Open it locally

### Option 1 — open the file directly (simplest)

Clone the repo and open the HTML file. Nothing to install.

```bash
git clone https://github.com/zhaoyanlin003-droid/Emma-Test1.git
cd Emma-Test1/team-launch-checklist
```

Then double-click `index.html`, or open it from a terminal:

```bash
start index.html      # Windows (PowerShell / cmd)
open index.html       # macOS
xdg-open index.html   # Linux
```

### Option 2 — serve it over http://localhost

The app works fine from `file://`, but if your browser is configured strictly, serve
the folder instead:

```bash
python -m http.server 8000   # Python 3
npx serve .                  # or Node.js
```

Then open <http://localhost:8000>.

## Notes

- Progress is stored **per browser, per device** under the key
  `team-launch-checklist-app:v1`. It is not synced between people — use **Export JSON**
  and **Import JSON** to pass state around, or commit an exported file if you want it
  versioned.
- Clearing your browser's site data clears the checklist. Export first if that matters.
- Opening the page from `file://` and from `http://localhost` counts as two different
  origins, so each keeps its own saved progress.
- To change the default tasks, edit the `TEMPLATE` array near the top of the `<script>`
  block in `index.html`, then click **Reset to template** to pick up the changes.
