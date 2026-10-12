# 🚀 Team Launch Checklist

A simple, self-contained web app for coordinating a product or feature launch. It
organizes work into four sections — **Planning**, **Content**, **Approvals**, and
**Launch Day** — and tracks your progress as you check items off.

## Features

- Four preset sections with sensible starter tasks for each launch phase
- Check items off with live per-section and overall progress bars
- Add your own tasks or remove ones you don't need
- Progress is saved automatically in your browser (via `localStorage`)
- **Export** your checklist to a JSON file and **Import** it back later or on another machine
- **Reset to defaults** to start a fresh launch
- No build step, no dependencies, no server required — it's just HTML, CSS, and JavaScript

## How to open it locally

1. Clone or download this repository.
2. Open the `team-launch-app` folder.
3. Double-click **`index.html`** — it opens directly in your default web browser.

That's it. No install, no `npm`, no build.

### Optional: run with a local web server

Opening the file directly works, but if your browser restricts `localStorage` on
`file://` pages, you can serve the folder over HTTP instead:

```bash
# from inside the team-launch-app folder
python -m http.server 8000
```

Then visit <http://localhost:8000> in your browser.

(If you prefer Node.js: `npx serve` from the same folder.)

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and layout |
| `styles.css` | Styling and progress bars |
| `app.js` | Checklist logic, saving, import/export |

## Saving your progress elsewhere

Your checklist lives in the browser you use. To move it or back it up, click
**Export JSON** to download a `team-launch-checklist.json` file, and use **Import JSON**
to load it on another device or browser.
