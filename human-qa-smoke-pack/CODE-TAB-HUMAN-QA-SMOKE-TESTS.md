# Code Tab Human QA Smoke Pack

## Purpose

This is a minimal manual QA pass for Code Tab. It is intentionally small and scenario-balanced: text-only create, iteration, revert, file upload, M365/WorkIQ grounding, GitHub/repo context, and handoff/export behavior.

## Best way to run this with QA testers

Use this as a **scripted exploratory pass**, not a rigid automation suite.

1. Assign each tester the same ordered cases below.
2. Ask testers to save the generated artifact after every case and capture a screenshot of the final canvas.
3. Have testers record only two core scores:
   - **Does it work?** The artifact runs/opens and key interactions function.
   - **Is it what was asked for?** The content/features match the prompt and supplied context.
4. Ask testers to paste output links, screenshots, bugs, and notes into `RESULTS-TEMPLATE.csv`.
5. Run create -> iterate -> revert in one continuous session for the revert scenario, because revert quality depends on version history.
6. For M365 cases, use either the prepared QA fixture data below or the future seeded Code Tab eval tenant. Do not use sensitive personal or customer data.
7. For GitHub cases, use a disposable test repo created from `fixtures/sample-github-repo/`.

## Fixture setup

### File upload fixture

Use:

```text
fixtures/Personal_Budget_2023.csv
```

### M365 fixture

Use:

```text
fixtures/m365-fixtures/M365-FIXTURE-SETUP.md
fixtures/m365-fixtures/Q3-Roadmap.md
fixtures/m365-fixtures/Project-Nebula-Launch-Approval.md
```

Before testing M365 cases, create/upload those artifacts in the tester's M365 account or the shared QA/eval tenant:

1. Upload `Q3-Roadmap.md` to OneDrive as `Documents/CodeTabQA/Q3-Roadmap.md`.
2. Upload `Project-Nebula-Launch-Approval.md` to OneDrive as `Documents/CodeTabQA/Project-Nebula-Launch-Approval.md`.
3. Send or draft the email described in `M365-FIXTURE-SETUP.md`.
4. Create the calendar event described in `M365-FIXTURE-SETUP.md`.

### GitHub/repo fixture

Use:

```text
fixtures/sample-github-repo/
```

Create a disposable internal GitHub repo from this folder, for example:

```text
codetab-qa-sample-app-<tester-alias>
```

Then connect/open that repo in Code Tab. Do not use a production repo for the smoke pass.

## Score labels

| Label | Meaning |
|---|---|
| Pass | Works and satisfies the prompt with no meaningful issues |
| Partial | Main flow works, but there are noticeable missing details or manual fixes needed |
| Fail | Artifact does not run/open, wrong artifact type, missing core requirement, or grounding is clearly wrong |
| Blocked | Product/test environment prevents the case from running |

## Minimal smoke cases

### CT-QA-001 — Text-only create: dashboard

**Scenario:** Create a static app from natural language only.

**Setup:** No files or M365 context.

**Prompt:**

```text
Build a weekly signup dashboard for a growth analyst. Include KPI cards for total signups, paid conversions, churn risk, and activation rate. Include a simple chart, a table of weekly data, and filters for region and channel.
```

**Expected checks:**

- Creates a working dashboard artifact, ideally HTML/static app.
- Includes KPI cards, chart, table, and filter controls.
- Interactions update visible content or are clearly represented.
- No fake source-data claims.

### CT-QA-002 — Text-only iterate: add feature

**Scenario:** Iterate on the prior artifact in the same session.

**Setup:** Continue from CT-QA-001.

**Prompt:**

```text
Add a Q2-only view, highlight the best performing channel, and add a short executive summary at the top.
```

**Expected checks:**

- Preserves prior dashboard.
- Adds Q2 view/filter.
- Highlights best channel.
- Adds executive summary.

### CT-QA-003 — Revert

**Scenario:** Revert the prior change.

**Setup:** Continue from CT-QA-002.

**Prompt:**

```text
Revert the last change and go back to the previous dashboard version before the Q2-only view and executive summary.
```

**Expected checks:**

- Restores the CT-QA-001 version.
- Removes Q2-only view and executive summary.
- Does not destroy the whole project or produce an unrelated artifact.

### CT-QA-004 — File upload create: budget tracker

**Scenario:** Build an app grounded in an uploaded CSV.

**Setup:** Upload `fixtures/Personal_Budget_2023.csv`.

**Prompt:**

```text
Use the uploaded Personal_Budget_2023.csv to build a personal budget tracker. Show income, expenses by category, monthly surplus, savings rate, and a simple warning if recurring expenses are too high. Include the original rows in a table.
```

**Expected checks:**

- Uses the uploaded CSV values.
- Shows income, categories, surplus, and savings rate.
- Includes a row table.
- Does not invent unrelated categories or values.

### CT-QA-005 — File upload iterate: add goal

**Scenario:** Iterate using the same uploaded file.

**Setup:** Continue from CT-QA-004.

**Prompt:**

```text
Add a savings goal widget. Let me enter a target amount and calculate how many months it would take based on the monthly savings in the file.
```

**Expected checks:**

- Adds a savings goal input.
- Calculation uses file-derived monthly savings.
- Prior budget tracker still works.

### CT-QA-006 — M365/WorkIQ docs: roadmap dashboard

**Scenario:** Use M365 document grounding.

**Setup:** Upload/create `Q3-Roadmap.md` in OneDrive as described above.

**Prompt:**

```text
Search my work files for the Q3 Roadmap and create a dashboard that shows the milestones, owners, risks, and launch-readiness status. Include source/context details from the file you found.
```

**Expected checks:**

- Finds the prepared Q3 Roadmap file or asks a clarifying question if multiple files match.
- Summarizes milestones, owners, risks, and status from the fixture.
- Includes source/context details.
- Does not invent milestones not present in the file.

### CT-QA-007 — M365/WorkIQ email/calendar: action tracker

**Scenario:** Use mail/calendar grounding and create a task tracker.

**Setup:** Create the email and calendar event described in `fixtures/m365-fixtures/M365-FIXTURE-SETUP.md`.

**Prompt:**

```text
Find the Project Nebula launch approval email and my Code Tab QA sync meeting. Create an action item tracker with owner, due date, source, and status. Call out anything that appears blocked.
```

**Expected checks:**

- Uses both email and calendar context if available.
- Produces an action tracker with owner, due date, source, and status.
- Marks blocked items from the fixture.
- Does not mix in unrelated personal mail/calendar items without explanation.

### CT-QA-008 — GitHub/repo open: summarize and modify existing repo

**Scenario:** Open existing repo context and make a targeted change.

**Setup:** Push/import `fixtures/sample-github-repo/` to a disposable GitHub repo and open/connect it in Code Tab.

**Prompt:**

```text
Review this repo and explain what the app does. Then add a feature request status filter to the dashboard. Keep the app static and easy to run locally.
```

**Expected checks:**

- Correctly identifies the existing app purpose.
- Modifies the existing repo files rather than starting from scratch.
- Adds a working status filter.
- Keeps the app static/local.

### CT-QA-009 — GitHub/repo iterate: bug fix

**Scenario:** Iterate in repo context.

**Setup:** Continue from CT-QA-008.

**Prompt:**

```text
The status filter should preserve the current priority filter when I change status. Fix that and explain what changed.
```

**Expected checks:**

- Keeps both filters working together.
- Provides a concise explanation.
- Does not rewrite unrelated files.

### CT-QA-010 — Create then graduate/export to GitHub

**Scenario:** Create an app and save/push/export it to GitHub.

**Setup:** Use a new disposable GitHub repo or product-supported export flow.

**Prompt:**

```text
Create a simple team launch checklist app with sections for planning, content, approvals, and launch day. Then save or export it to my connected GitHub repo with a README that explains how to open it locally.
```

**Expected checks:**

- Creates a working checklist app.
- Saves/exports to GitHub if supported in the build being tested.
- README explains local usage.
- If GitHub export is unsupported/blocked, product gives a clear blocked message rather than pretending it succeeded.

## Evidence to capture per case

For each case, testers should capture:

1. Tester alias and environment/build.
2. Prompt used.
3. Final artifact link/path/repo URL.
4. Screenshot of final artifact.
5. `Does it work?` score.
6. `Is it what was asked for?` score.
7. Bugs filed, with links.
8. Notes on grounding/source correctness for M365 and file-upload cases.

