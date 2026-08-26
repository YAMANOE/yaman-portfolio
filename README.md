# yaman-portfolio

The personal portfolio of Yaman Obaidat, AI/ML Engineer in Amman, Jordan.
Static site, deployed from this repo to GitHub Pages at
`https://YAMANOE.github.io/yaman-portfolio`.

Plain HTML, CSS and JavaScript. No framework, no bundler, no build step, no npm
dependencies. Read [AGENTS.md](AGENTS.md) before changing anything.

## Run it locally

The pages read `data/*.json` over `fetch`, which does not work from `file://`.
Always serve it:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Test the subpath

The site ships to `/yaman-portfolio/`, not to a domain root. This folder is
already named `yaman-portfolio`, so serving the parent reproduces the real path
exactly — worth doing before every push:

```bash
cd .. && python3 -m http.server 8001
# → http://localhost:8001/yaman-portfolio/
```

Every asset path in this repo is relative. None may start with `/`.

## Layout

```
index.html            home: hero, coverflow, what I do, stack, contact
projects.html         the scannable index, with a keyboard filter row
about.html            bio, now, academic, skills, languages, contact
projects/*.html       the four case studies + _template.html
404.html              CSS and favicon are INLINE here — see the file's comment

assets/styles.css     tokens under :root, the shared shell, the tag component
assets/home.css       home page only        assets/about.css     about only
assets/case-study.css case studies only

assets/store.js       the one data loader + save/export/discard + esc()
assets/coverflow.js   the carousel — change the options object, not the internals
assets/owner.js       the ?owner=1 panel (loaded only when the flag is present)
assets/app.js  assets/projects-index.js  assets/about.js  assets/case-study.js

assets/covers/        one square cover per project, generated SVG
assets/diagrams/      one architecture diagram per system, inline-styled SVG
data/projects.json    all project content    data/profile.json   identity content
docs/phases/          the eight phase specs
```

## Four things that will bite you

**The nav is copied markup, not a template.** AGENTS.md forbids a templating
step, and Phase 0 forbids linking a page that does not exist yet. So when a
phase adds a page, it must add that nav link to *every* page already shipped.
Expect it; it is not a mistake in the file you are looking at.

**One grid, one shell, every page.** `--cell` (24px) and `--arterial` (96px)
are site-wide tokens; the background draws arterials in `--line` and side
streets in `--line-soft`, and `--shell` is 1152px — exactly 12 arterials — so
page content lands on lines the grid actually draws. `404.html` inlines its CSS
and carries a copy: **change the grid in `styles.css` and you must change it
there too**, or the 404 stops matching the rest of the site.

**A card fill answers "what kind of thing is in this card?"** Five surfaces:
`--surface-live` (the one currently-true fact — mint means current),
`--surface-raised` (an artifact you can go and look at), `--surface-sunk` (the
record: dates, credentials, contact), `--surface-read` (prose you read start to
finish) and `--surface-index` (an inventory you scan). Only the title block
sits on plain paper. All four ink colours clear 4.5:1 on every surface —
lowest pairing is mint on `--surface-index` at 5.44:1, verified against the 68
real text/surface pairs the page renders. **No fill may ever encode a level or
a rating** — that is the banned skill bar in a new shape, which is also why the
four skill parcels are pixel-identical.

**There is no 01/02/03 numbering, deliberately.** It was there and was cut:
numbered markers only earn their place when the content is genuinely a
sequence. Bio / Education / Skills / Contact is not one, nothing
cross-references the numbers, and there was no index to look one up in — so
they were a reference system that referenced nothing.

**Only `--mint` may touch text.** It is 5.99:1 on `--paper`. `--mint-soft` and
`--mint-glow` are decorative — 1.54:1 and 1.07:1 — and fail WCAG on text. The
rule is written at the top of `assets/styles.css`.

**`[hidden]` is forced globally.** An author `display` declaration beats the UA
stylesheet's `[hidden] { display: none }`, which silently broke every
`el.hidden = true` in the repo. `assets/styles.css` now sets
`[hidden] { display: none !important; }`. Do not remove it.

**Every page is a sheet.** `.sheet` (the 12-column lattice) and `.parcel` (a
card) live in `assets/styles.css` and are used by the home page, the projects
index, the About page and the case studies. Each page's own stylesheet supplies
only placement and fills. A page opts in with `class="sheet-page"` on `<body>`.

**Two grid traps, both of which cost a Lighthouse run to find:**
- `min-height` on a grid container **stretches its rows** to fill the reserve.
  `.sheet` sets `align-content: start` so extra height sits at the bottom of the
  lattice instead of inflating the first row and collapsing when content lands.
- **CSS cannot reserve space for an element JS has not created yet.** The four
  skill parcels are static shells that `about.js` fills for exactly this reason.
  Where the count is dynamic (the projects index) the sheet carries
  `.sheet--reserving` and `projects-index.js` drops it on the first filter
  click — not on render, because releasing it during render is itself the shift.

**The About page is a survey sheet, and it has one rule.**
Cards ("parcels") abut with zero gutters and share single hairlines, so every
card edge lands on an arterial line of the paper grid. The rule that keeps it
honest: **no raw vertical length in `assets/about.css`** — every
`padding-block`, `margin-block` and `line-height` is a multiple of `--cell`
(24px). One `line-height: 1.6` and every card below it drifts off the grid,
which is the "grid as wallpaper" failure the design exists to avoid.

Two more invariants there:
- **Every grid row must be fully occupied at every breakpoint.** No
  `grid-auto-flow`, no implicit tracks. An empty cell on a sheet reads as
  missing data — which is why the portrait parcel is *removed* and its
  neighbours widen when there is no photo, rather than leaving a hole.
- **Exactly one card carries a fill** (the graduation project). Everything else
  is hairlines and whitespace. Cards invite chrome; a skills card wants pills,
  pills want colour, colour wants to mean level — and that is the banned skill
  rating wearing a new hat. All 21 skill items share one class.

Its cards use `.parcel`, **not `.card`** — `.card` is already the projects-index
component in `styles.css`, and reusing the name inherited its border radius.

**TODO(yaman) markers must never render to a reader.** `phase-7-ship.md`
forbids shipping them. Two conventions keep that true:
`assets/about.js` has an `isMissing()` predicate — any field still carrying a
marker is treated as absent data (the row drops, or a neutral placeholder
stands in) — and in the generated case studies an author note is an HTML
comment, not a paragraph. Both stay greppable:

```bash
grep -rn "TODO(yaman)" --include="*.html" --include="*.json" .
```

**Tracking is size-specific and the values were measured, not guessed.**
Large display text carries negative tracking (`-0.032em` on the About name)
because letters read too far apart as they grow; small mono labels carry
positive tracking (`+0.06em`) to stay legible; body sits at zero. One fixed
`letter-spacing` would be wrong somewhere. Leading moves inversely to size —
`1.02` on the name, `1.65` on body. `font-optical-sizing: auto` is on because
Bricolage Grotesque ships an `opsz` axis and is loaded with it.

**The topbar is a translucent material, not an opaque strip.**
`backdrop-filter: blur(20px) saturate(180%)` over a 72% surface, with content
scrolling underneath and a short gradient scroll-edge instead of a hard 1px
divider. It has explicit fallbacks for `prefers-reduced-transparency` and
`prefers-contrast: more` — both drop the blur and go solid.

**Font fallbacks are metric-matched, and the numbers were measured.** The
`size-adjust` values in `assets/styles.css` come from real browser
measurements against the live webfonts. If you change a family or a weight,
re-measure — a wrong value reintroduces layout shift rather than preventing it.

## Phases

| # | Phase | Spec | State |
|---|-------|------|-------|
| 0 | Foundation and deploy | [docs/phases/phase-0-foundation.md](docs/phases/phase-0-foundation.md) | done |
| 1 | Home page | [docs/phases/phase-1-home.md](docs/phases/phase-1-home.md) | done |
| 2 | Projects index | [docs/phases/phase-2-projects-index.md](docs/phases/phase-2-projects-index.md) | done |
| 3 | Case study template | [docs/phases/phase-3-case-study.md](docs/phases/phase-3-case-study.md) | done |
| 4 | The four case studies | [docs/phases/phase-4-case-content.md](docs/phases/phase-4-case-content.md) | done — content pending, see below |
| 5 | About page | [docs/phases/phase-5-about.md](docs/phases/phase-5-about.md) | done |
| 6 | Owner mode and data layer | [docs/phases/phase-6-owner-mode.md](docs/phases/phase-6-owner-mode.md) | done |
| 7 | Ship quality | [docs/phases/phase-7-ship.md](docs/phases/phase-7-ship.md) | done — Lighthouse 100 on mobile |

One phase per branch, named for the phase slug. Phases 2 and 5 can run in
parallel. Phase 4 needs 3. Everything needs 0.

## Outstanding

Every unknown is marked `TODO(yaman):` in the file that needs it. Find them all
with:

```bash
grep -rn "TODO(yaman)" --include="*.html" --include="*.json" --include="*.js" .
```

## Deploy

Settings → Pages → branch `main`, folder `/ (root)`. `.nojekyll` is committed so
Pages does not strip folders beginning with an underscore.
