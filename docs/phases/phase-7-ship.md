# Phase 7 — Ship quality

**Goal:** the site holds up when a stranger opens it on a phone on a bad connection.

**Depends on:** everything.

## Files you own

```
every page (meta tags only)
assets/og-image.png
sitemap.xml
robots.txt
```

## Do

### Findability
- Unique `<title>` and `<meta name="description">` per page.
- Open Graph and Twitter card tags, with a real 1200×630 preview image.
- `sitemap.xml` and `robots.txt`.
- JSON-LD `Person` schema on the about page.

### Accessibility
- Run through a keyboard only, top to bottom, on every page.
- Check contrast on the mint accent against paper. Fix anything under 4.5:1 for
  body text or 3:1 for large text.
- Every image has alt text that says what it shows, not "image of project".
- Test with reduced motion on.

### Performance
- Convert cover images to WebP with a JPEG fallback. Add `width` and `height` to
  every image so nothing shifts on load.
- `loading="lazy"` on anything below the fold.
- Preload the two font files actually used above the fold, not all of them.

### Correctness
- Every link resolves, including the CV download.
- The site works from the `/yaman-portfolio/` subpath.
- No `TODO(yaman)` markers left in shipped pages. List any that remain.

## Done when

- [ ] Lighthouse: performance and accessibility both 90+ on mobile.
- [ ] No layout shift on load.
- [ ] Sharing the URL in a chat app shows a real preview card.
- [ ] Full keyboard pass on every page with no trap and no invisible focus.
- [ ] Zero console errors and zero 404s in the network tab.

## Paste this to the agent

> Read AGENTS.md. Do Phase 7 from docs/phases/phase-7-ship.md. Meta tags, images,
> accessibility and link checking. Report the Lighthouse mobile scores and list
> every TODO(yaman) still left in the repo.
