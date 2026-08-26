# AGENTS.md — yaman-portfolio

Read this file before doing anything. It applies to every phase.

## What this repo is

The personal portfolio of Yaman Obaidat, AI/ML Engineer in Amman, Jordan.
It is deployed as a static site on GitHub Pages at `https://YAMANOE.github.io/yaman-portfolio`.

Audience, in this order: hiring teams abroad, master's admissions committees,
hiring teams in Jordan, freelance clients. One site serves all four. Do not
build separate versions.

Positioning line, used verbatim wherever a tagline is needed:

> AI/ML Engineer — civic tech, computer vision, multi-agent systems.

## Hard constraints

- Plain HTML, CSS and JavaScript. **No framework, no bundler, no build step.**
- **No npm dependencies.** Not React, not Tailwind, not framer-motion. If a phase
  seems to need a library, solve it with the platform or ask instead of installing.
- ES modules loaded with `<script type="module">`. No transpiling.
- All content lives in `data/projects.json`. Never hardcode project text into HTML.
- Must work when served from a subpath. Use relative paths only, never `/assets/...`.
- Fonts come from Google Fonts. Everything else is local.

## Quality floor — every phase must hold this

- Responsive from 360px up.
- Visible keyboard focus on every interactive element.
- `prefers-reduced-motion` respected.
- Semantic HTML, real landmarks, alt text on every image.
- No console errors.

## Design system

Tokens live in `assets/styles.css` under `:root`. Use the variables, never raw hex.

- Paper grid background with a mint signal glow — the vernacular is a traffic map.
- Display face: Bricolage Grotesque. Body: IBM Plex Sans Arabic. Mono: JetBrains Mono.
- Mono is for labels, metadata and eyebrows only. Never for body copy.
- Sentence case everywhere. No title case, no all caps outside the mono labels.

## Roles — read carefully

The site has two modes. They are **not** authentication.

- **Reviewer** — the default public view. Read only.
- **Owner** — opened with `?owner=1`. Edits save to `localStorage` and can be
  exported as a JSON file to commit.

A static site cannot hide anything from anyone who opens DevTools. Never add a
password, a fake login, or any copy that implies the owner mode is secure.

## Writing rules

- Plain verbs, active voice, no marketing language.
- Every project claim needs a concrete number or a concrete artifact behind it.
- Never invent metrics. If a number is unknown, leave a `TODO(yaman)` marker.
- English only in the interface. Arabic appears only as a stated language skill.

## Working agreement for agents

- One phase per branch. Branch name is the phase slug, e.g. `phase-3-case-study`.
- Touch only the files your phase lists. If you need a change outside that list,
  note it in the PR description instead of making it.
- Do not reformat or refactor files owned by another phase.
- Leave `TODO(yaman):` for anything that needs a real asset, number or decision.

## Phases

| # | Phase | Spec |
|---|-------|------|
| 0 | Foundation and deploy | `docs/phases/phase-0-foundation.md` |
| 1 | Home page | `docs/phases/phase-1-home.md` |
| 2 | Projects index | `docs/phases/phase-2-projects-index.md` |
| 3 | Case study template | `docs/phases/phase-3-case-study.md` |
| 4 | The four case studies | `docs/phases/phase-4-case-content.md` |
| 5 | About page | `docs/phases/phase-5-about.md` |
| 6 | Owner mode and data layer | `docs/phases/phase-6-owner-mode.md` |
| 7 | Ship quality | `docs/phases/phase-7-ship.md` |

Phases 2 and 5 can run in parallel. Phase 4 needs 3. Everything needs 0.
