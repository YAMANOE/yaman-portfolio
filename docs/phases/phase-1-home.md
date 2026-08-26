# Phase 1 — Home page

**Goal:** the landing page answers "who is this and is he any good?" in ten seconds.

**Depends on:** Phase 0.

## Files you own

```
index.html
assets/app.js
assets/coverflow.js
```

## Sections, in order

1. **Hero** — mono eyebrow with role and location, display headline, one paragraph
   of lede, two buttons (See the work / Download CV), an availability status line.
2. **Selected work** — the coverflow carousel. Drag, arrows, dots, keyboard.
   Caption below the active card: title, subtitle, summary, mono metadata table,
   and a link through to the case study.
3. **What I do** — three columns: AI systems, computer vision, shipping it.
4. **Stack** — one row of mono tags.
5. **Contact** — one headline, three buttons: email, LinkedIn, GitHub.

## The carousel

`assets/coverflow.js` is already written and has no dependencies. Do not rewrite it.
It works on a fractional card index, paints transforms straight to the DOM, and
loops by folding the distance around the ring. If you need to change behaviour,
change the options object, not the internals.

Options: `rotate`, `depth`, `falloff`, `fade`, `gap`, `loop`, `onChange`.

## Do

- Render every card and the caption from `data/projects.json`. No hardcoded copy.
- Show a directive error box if the fetch fails, telling the reader to serve over
  http. Never show an empty carousel.
- Cards are square. Keep the same crop for every cover.

## Do not

- Do not autoplay the carousel. It fights the reader.
- Do not add scroll-jacking, parallax, or a cursor follower.

## Done when

- [ ] Drag, arrows, dots and ← → all move the carousel and update the caption.
- [ ] The caption is announced to screen readers via `aria-live="polite"`.
- [ ] With reduced motion on, nothing animates on its own.
- [ ] Six projects render from JSON with no console errors.
- [ ] Nothing overflows horizontally at 360px.

## Paste this to the agent

> Read AGENTS.md. Do Phase 1 from docs/phases/phase-1-home.md. Build the home page
> against data/projects.json. Reuse assets/coverflow.js as-is. No dependencies.
> Report which Done-when boxes pass.
