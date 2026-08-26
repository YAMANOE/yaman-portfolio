# Phase 2 — Projects index

**Goal:** a page where a reviewer can scan every project in under a minute.

**Depends on:** Phase 0. Can run in parallel with Phase 5.

## Files you own

```
projects.html
assets/projects-index.js
assets/styles.css   (append a `.grid` block only — do not touch existing rules)
```

## Card format

Every card uses the same shape, so the eye learns it once:

```
2026 · Amman traffic intelligence
Hierarchical multi-agent traffic platform
Python, YOLO, FastAPI
[ the one number that matters ]
```

## Do

- Render all projects from `data/projects.json`, in file order.
- Cards with a `links.study` value link to the case study. Cards without one link
  to the GitHub repo. Cards with neither are not clickable and say so.
- Add a filter row of mono buttons built from the stack values found in the data.
  Filtering is plain JS on the rendered list. No routing, no URL state.
- The `featured` flag decides nothing here. Every project shows on this page.

## Do not

- Do not paginate. Six projects do not need pages.
- Do not add hover video, tilt effects or card flips.

## Done when

- [ ] Every project in the JSON appears exactly once.
- [ ] Filter buttons are real buttons, reachable by keyboard, with `aria-pressed`.
- [ ] Clearing the filter restores the full list.
- [ ] The grid reflows to one column at 360px.

## Paste this to the agent

> Read AGENTS.md. Do Phase 2 from docs/phases/phase-2-projects-index.md. Build
> projects.html as a scannable grid driven by data/projects.json, with a keyboard
> accessible filter row. Append CSS only, never edit existing rules.
