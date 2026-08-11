# Team Launch Checklist

A small, single-file web app for tracking a product or feature launch across four sections:

1. **Planning** — brief, dates, metrics, owners, rollback plan
2. **Content** — copy, blog, docs, assets, email, support material
3. **Approvals** — legal, security, brand, engineering, finance, exec go/no-go
4. **Launch day** — the runbook for the day itself

## Features

- Check items off; per-section counts and an overall progress bar update instantly
- Add or remove tasks in any section
- Progress is saved automatically in your browser (`localStorage`), so it survives refreshes
- **Export JSON** to share the checklist state with a teammate; **Import JSON** to load theirs
- **Print** for a clean paper/PDF copy (buttons and inputs are hidden)
- **Reset to template** to start a new launch from scratch

There is no build step, no dependencies, and no server required.

## Open it locally

### Option 1 — just open the file (simplest)

Clone or download this repo, then double-click `launch-checklist/index.html`, or open it from a terminal:

```bash
git clone https://github.com/zhaoyanlin003-droid/Emma-Test1.git
cd Emma-Test1/launch-checklist

# macOS
open index.html

# Windows (PowerShell)
start index.html

# Linux
xdg-open index.html
```

### Option 2 — serve it over http://localhost

Some browsers restrict `file://` pages. If anything misbehaves, run a tiny local server from the `launch-checklist` folder and visit the printed URL:

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then open <http://localhost:8000>.

## Notes

- Data lives only in the browser you use it in — it is **not** synced between people or devices. Use **Export JSON** / **Import JSON** to hand state around, or check the exported file into the repo if you want it versioned.
- Clearing your browser's site data will clear the checklist. Export first if that matters.
- Editing the `TEMPLATE` array near the top of the `<script>` block in `index.html` changes the default tasks for future launches (click **Reset to template** afterwards to pick up the changes).
