# Team Launch Checklist

A simple, single-file web app for coordinating a product or feature launch. It organizes
work into four sections:

- 🗺️ **Planning** — goals, timeline, owners, and risks
- ✍️ **Content** — blog post, social, docs, and email
- ✅ **Approvals** — legal, brand, engineering, and go/no-go sign-off
- 🎉 **Launch day** — deploy, publish, monitor, and celebrate

## Features

- Check off tasks with live progress tracking (per-section counts and an overall progress bar)
- Add your own tasks to any section
- Remove tasks you don't need
- Progress is saved automatically in your browser (via `localStorage`)
- **Reset all** to restore the default checklist
- **Export JSON** to download a snapshot of your checklist
- No server, build step, dependencies, or internet connection required

## How to open it locally

This is a static app contained in a single `index.html` file.

### Option 1 — just double-click

1. Download or clone this repository.
2. Open the `team-launch-app` folder.
3. Double-click `index.html` to open it in your default web browser.

That's it — your progress is stored in that browser automatically.

### Option 2 — run a local web server (optional)

Any static file server works. For example, with Python installed:

```bash
cd team-launch-app
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Notes

- Data is stored per-browser via `localStorage`, so progress does not sync between
  different browsers or devices. Use **Export JSON** if you want to keep a copy.
- To clear everything and start fresh, click **Reset all**.
