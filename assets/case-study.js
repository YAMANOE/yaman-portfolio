/* Phase 3 — case study behaviour: the sticky table of contents and the
 * prev/next footer.
 *
 * The footer order comes from data/projects.json FILE ORDER — the same order
 * the index renders in. Never sort.
 *
 * NOTE: phase-3-case-study.md lists projects/_template.html and
 * assets/case-study.css. It does not list a script, but a table of contents
 * that "highlights the current block" and a prev/next footer "driven by the
 * order in data/projects.json" both need one. Flagged in the hand-back.
 */

import { load, esc } from '../assets/store.js';

const DATA = '../data/projects.json';
const DRAFT_KEY = 'yaman-portfolio:projects';

/* ---- table of contents: highlight the block currently in view ---------- */

function initToc() {
  const links = [...document.querySelectorAll('.toc a')];
  if (!links.length) return;

  const blocks = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!blocks.length) return;

  const mark = id => links.forEach(a =>
    a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false'));

  const seen = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => seen.set(e.target.id, e.intersectionRatio));
    // the block with the largest visible share wins
    const best = [...seen.entries()]
      .filter(([, ratio]) => ratio > 0)
      .sort((a, b) => b[1] - a[1])[0];
    if (best) mark(best[0]);
  }, { threshold: [0, 0.25, 0.5, 1], rootMargin: '-72px 0px -40% 0px' });

  blocks.forEach(b => io.observe(b));
}

/* ---- prev / next, from file order -------------------------------------- */

/* links.study is stored relative to the REPO ROOT ("projects/traffic.html")
 * because projects.html sits there. A case study is already inside projects/,
 * so the prefix has to come off or the link 404s. */
function studyHref(study) {
  return study.replace(/^projects\//, '');
}

function link(project, rel) {
  const a = document.createElement('a');
  a.className = `pagination__link pagination__link--${rel}`;
  a.href = studyHref(project.links.study);
  a.innerHTML = `<span class="pagination__rel">${rel === 'prev' ? 'Previous' : 'Next'}</span>
                 <span class="pagination__title">${esc(project.title)}</span>`;
  return a;
}

async function initPagination() {
  const nav = document.querySelector('#pagination');
  if (!nav) return;

  const slug = document.body.dataset.slug;
  let data;
  try {
    data = await load(DATA, DRAFT_KEY);
  } catch (err) {
    nav.hidden = true;           // a broken footer is worse than no footer
    console.error(err);
    return;
  }

  // Walk only projects that HAVE a case study page. A project without one
  // cannot be navigated to, and linking "#" would be a dead link.
  const list = data.projects.filter(p => p.links.study);
  const i = list.findIndex(p => p.slug === slug);

  if (i === -1) {
    // The template itself, or a page whose slug is not in the data yet.
    nav.replaceChildren(Object.assign(document.createElement('p'), {
      className: 'pagination__todo',
      textContent: 'TODO(yaman): Phase 4 sets data-slug on <body>; prev/next resolves from data/projects.json order.'
    }));
    return;
  }

  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  nav.replaceChildren(link(prev, 'prev'), link(next, 'next'));
}

initToc();
await initPagination();
