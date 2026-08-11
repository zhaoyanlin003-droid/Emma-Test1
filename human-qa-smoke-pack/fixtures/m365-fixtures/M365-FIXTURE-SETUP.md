# M365 Fixture Setup for Code Tab Human QA

Use only non-sensitive synthetic content. These fixtures are safe to create in a QA account or the dedicated Code Tab eval tenant.

## OneDrive files

Upload these files:

| Local file | Suggested OneDrive path |
|---|---|
| `Q3-Roadmap.md` | `Documents/CodeTabQA/Q3-Roadmap.md` |
| `Project-Nebula-Launch-Approval.md` | `Documents/CodeTabQA/Project-Nebula-Launch-Approval.md` |

## Email fixture

Send an email to yourself or create it in a QA mailbox.

```text
Subject: Project Nebula launch approval - blockers and owners

Hi team,

Project Nebula is conditionally approved for launch readiness review.

Action items:
- Maya Johnson owns accessibility review, due July 18.
- Elena Volkov owns final product copy, due July 19.
- Jordan Blake owns exec sign-off, due July 21.
- Liam Chen owns launch metrics dashboard, due July 20.

Blocked:
- Accessibility review is blocked until the color contrast audit is complete.
- Exec sign-off is blocked until final product copy is approved.

Please bring open risks to the Code Tab QA sync.
```

## Calendar fixture

Create a calendar event:

```text
Title: Code Tab QA sync - Project Nebula
Date/time: any upcoming weekday, 30 minutes
Location: Teams
Body:
Review launch readiness, grounding quality, QA smoke results, and open blockers.
Expected outputs:
- Confirm accessibility review status
- Confirm final product copy status
- Confirm exec sign-off path
- Confirm launch metrics dashboard owner
```

## Tester note

The M365 cases are expected to search/read this synthetic content. If the product cannot find the exact fixture, record whether it asks a clarifying question, searches the wrong source, or invents content.
