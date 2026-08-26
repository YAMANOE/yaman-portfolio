# Phase 6 — Owner mode and data layer

**Goal:** the owner can edit content in the browser and export it to commit.
The reviewer sees a clean read-only site.

**Depends on:** Phases 1, 2, 5.

## Files you own

```
assets/owner.js
assets/store.js
assets/styles.css   (append the `.owner` block only)
```

## The two roles

**Reviewer** — the default. No panel, no edit affordances, no trace of owner mode
in the interface beyond a static "Reviewer" pill.

**Owner** — opened with `?owner=1`. A side panel edits the currently focused
project or profile record.

- `Save` writes the whole data object to `localStorage`. Local to that browser only.
- `Export JSON` downloads the file to replace `data/projects.json` or
  `data/profile.json`, then commit.
- `Discard local edits` clears the key and reloads published data.

## Read this before you write any code

This is **not authentication**. A static site on GitHub Pages ships every byte to
every visitor. Anyone can open DevTools, read the source, and set the query
parameter themselves.

Therefore:

- No password field. No PIN. No hashed secret in the JS. No "admin login".
- No copy anywhere that says the owner area is private, protected or secure.
- The owner panel must never contain anything that would harm Yaman if a stranger
  opened it. It edits public content only.

If a future requirement genuinely needs protected editing, that is a backend, and
it is out of scope for this repo. Say so rather than faking it.

## Do

- Extract the load/save/export logic into `assets/store.js` so the home, projects
  and about pages all read through one function.
- The load order is: localStorage draft, then the JSON file, then a clear error.
- Show which record is being edited. Editing the wrong project silently is the
  main failure mode here.

## Done when

- [ ] Without `?owner=1` there is no edit UI and no owner code path runs.
- [ ] Save survives a reload. Discard clears it.
- [ ] Export produces a file that drops straight into `data/` and works unchanged.
- [ ] The panel traps focus while open and closes on Escape.
- [ ] Nothing in the repo implies owner mode is secure.

## Paste this to the agent

> Read AGENTS.md, then the "Read this before you write any code" section of
> docs/phases/phase-6-owner-mode.md. Do Phase 6. Owner mode is a convenience, not
> a login — do not add any password or security-implying copy.
