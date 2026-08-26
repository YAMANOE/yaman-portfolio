# Phase 3 — Case study template

**Goal:** one reusable page structure that makes a project readable in 60–90 seconds.

**Depends on:** Phase 0. Blocks Phase 4.

## Files you own

```
projects/_template.html
assets/case-study.css
```

## The eight blocks — same order on every case study, no exceptions

1. **Hero** — project name, one hero image or demo loop, the headline number.
2. **Problem** — two or three sentences. What actually hurt, and for whom.
3. **My role** — what Yaman personally built, separated from what the team built.
   A reviewer will ask this in the interview. Answer it on the page.
4. **Approach** — an architecture diagram, why this design, and what was rejected.
   The rejected option is the part that shows judgment. Do not drop it.
5. **Results** — numbers, before and after, screenshots, an evaluation table.
6. **Stack** — mono tags, same component as the home page.
7. **Links** — GitHub, live demo, report PDF. Hide any link with no URL.
8. **What I learned** — two lines. Not a reflection essay.

## Do

- Build it as a static HTML template with `TODO(yaman)` markers in every slot.
- Add a sticky in-page table of contents on wide screens that highlights the
  current block. Hide it below 900px.
- Add a prev/next project footer driven by the order in `data/projects.json`.
- Diagrams are inline SVG or a static image. No diagram library.

## Do not

- Do not make the blocks collapsible. A reviewer skims by scrolling, not clicking.
- Do not reorder blocks per project. The repetition is what makes it feel professional.

## Done when

- [ ] All eight blocks are present and labelled.
- [ ] The template renders with placeholder content and no console errors.
- [ ] Heading order is h1 then h2, never skipping a level.
- [ ] The table of contents is keyboard reachable and disappears cleanly on mobile.
- [ ] Reading the placeholder page top to bottom takes under 90 seconds.

## Paste this to the agent

> Read AGENTS.md. Do Phase 3 from docs/phases/phase-3-case-study.md. Build the
> case study template with all eight blocks and TODO(yaman) markers. Do not fill
> in real project content — that is Phase 4.
