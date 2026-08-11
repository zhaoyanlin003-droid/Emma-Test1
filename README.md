# Emma-Test1

A small collection of static planning artifacts plus a zero-dependency dashboard that visualizes them.

## Contents

| File | What it is |
|---|---|
| `roadmap-dashboard.html` | Static single-file dashboard for the Q3 roadmap: summary cards, milestone table, risks and launch readiness. |
| `Q3-Roadmap.md` | Source of truth for the milestones, risks and launch readiness shown in the dashboard. |
| `Personal_Budget_2023.csv` | Sample monthly budget data (income, expenses, savings). |

## Run it locally

No build step, no server, no dependencies. Open the file in a browser:

```
start roadmap-dashboard.html     # Windows
open roadmap-dashboard.html      # macOS
xdg-open roadmap-dashboard.html  # Linux
```

## Status filter

The milestone table can be narrowed by status:

- Click a status chip (**All**, **On track**, **At risk**, **Blocked**) or one of the summary cards. Clicking the active filter again clears it.
- The risks list follows the same filter, so you only see risks for the milestones currently in view.
- The optional search box narrows further by milestone name or owner.
- The active filter is stored in the URL hash (e.g. `roadmap-dashboard.html#status=at-risk`), so a filtered view can be bookmarked or shared.

Milestone data is embedded in `roadmap-dashboard.html` so the page works from `file://`. When `Q3-Roadmap.md` changes, update the `MILESTONES`, `RISKS` and `READINESS` constants at the bottom of the HTML to match.