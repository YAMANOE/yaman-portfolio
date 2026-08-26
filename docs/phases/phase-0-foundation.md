# Phase 0 — Foundation and deploy

**Goal:** the repo exists, the shell renders on every page, and GitHub Pages serves it.

**Depends on:** nothing.

## Files you own

```
index.html                (shell only — the topbar, footer, skip link)
assets/styles.css
assets/covers/*
data/projects.json
README.md
.nojekyll
404.html
```

## Do

1. Initialise the repo as `yaman-portfolio`. Add `.nojekyll` at the root so Pages
   does not strip folders that start with an underscore.
2. Confirm `assets/styles.css` defines the full token set under `:root`: paper,
   paper-lift, ink, ink-2, ink-3, mint, mint-soft, mint-glow, line, line-soft,
   the three font stacks, shell width, gutter, radius.
3. Build the shared shell: sticky topbar with the name mark, the nav, and the role
   pill; the footer; the skip link. It must be identical on every page.
4. Add `404.html` using the same shell, with one line of copy and a link home.
5. Enable Pages: Settings → Pages → branch `main`, folder `/ (root)`.

## Do not

- Do not add a nav link to a page that does not exist yet. Add links as pages land.
- Do not introduce a templating step. The shell is copied markup for now.

## Done when

- [ ] The site loads on the Pages URL with no console errors.
- [ ] Every asset path is relative and resolves under the `/yaman-portfolio/` subpath.
- [ ] The page is usable at 360px wide.
- [ ] Tab order reaches the skip link first, then the nav.
- [ ] `404.html` renders with the shell.

## Paste this to the agent

> Read AGENTS.md. Do Phase 0 from docs/phases/phase-0-foundation.md. Set up the
> repo shell and GitHub Pages deploy. Vanilla HTML/CSS/JS only, no dependencies,
> relative paths only. Stop when the Done-when checklist passes and tell me which
> boxes you could not tick.
