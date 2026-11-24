# Team Launch Checklist

A single-file checklist app for running a product or feature launch. It covers four phases:

1. **Planning** — goals, dates, owners, risks
2. **Content** — messaging, blog, social, docs, assets
3. **Approvals** — product, legal, brand, security, go/no-go
4. **Launch Day** — smoke test, release, announcements, monitoring, recap

Each item has a checkbox and an owner field. A progress bar at the top shows overall completion, and every section shows its own count.

The layout adapts to smaller screens. **Export checklist** downloads a readable JSON snapshot containing all four sections, task names, checkmarks, and owners. **Print / PDF** opens your browser's print dialog with a clean, button-free layout.

## How to open it locally

No build step, no dependencies — it's one HTML file.

**Option 1: double-click**

1. Clone or download this repo, then go to the `team-launch-checklist/` folder.
2. Open `index.html` in your browser (double-click it, or right-click → Open with → your browser).

**Option 2: from the command line**

```powershell
git clone https://github.com/zhaoyanlin003-droid/Emma-Test1.git
Set-Location Emma-Test1\team-launch-checklist
Start-Process .\index.html
```

From inside the app folder on macOS or Linux:

```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

**Option 3: local web server** (optional — useful if your browser restricts local files)

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then visit http://localhost:8000/index.html

## Saving your progress

Checkmarks and owner names are saved to your browser's `localStorage` under the key `team-launch-checklist-v1`. That means:

- Progress persists when you close and reopen the file on the same browser and machine.
- Progress is **not** shared between people, browsers, or devices.
- "Reset all" clears every checkmark and owner.
- If browser storage is blocked or the saved data cannot be read, an error message appears. You can still use the app and export a snapshot before closing.
- Export is a backup or handoff snapshot, not automatic GitHub synchronization. The app has no import or live collaboration feature.

## Customizing the checklist

Open `index.html` and edit the `SECTIONS` array near the top of the `<script>` block. Add, remove, or reword items and sections — the UI and progress math update automatically.
