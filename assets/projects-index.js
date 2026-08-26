/* Phase 2 — projects index.
 * Renders every project from data/projects.json in FILE ORDER (Phase 3's
 * prev/next footer walks the same order, so never sort here), plus a filter
 * row built from the stack values actually present in the data.
 * Filtering is plain JS over the rendered list — no routing, no URL state.
 */

import { load, esc } from './store.js';

/* A TODO(yaman) marker means the fact is not known yet — a note to the repo
 * owner, never copy for a reader. phase-7-ship.md forbids shipping them. */
const isMissing = v => !v || /TODO\(yaman\)/.test(String(v));

const DATA = 'data/projects.json';
const DRAFT_KEY = 'yaman-portfolio:projects';

const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const status = document.querySelector('#status');
const errorBox = document.querySelector('#error');

/** Cards with a study link go there; without one, to the repo; with neither,
 *  they are not clickable and say so. */
function destination(p) {
  if (p.links.study) return { href: p.links.study, label: 'Read the case study' };
  if (p.links.repo) return { href: p.links.repo, label: 'View the repository' };
  return null;
}

function card(p) {
  const el = document.createElement(destination(p) ? 'a' : 'div');
  el.className = 'parcel card';
  const to = destination(p);
  if (to) el.href = to.href;
  else el.setAttribute('aria-disabled', 'true');

  const eyebrow = [p.year, p.title].filter(Boolean).join(' · ');
  const stack = p.stack.length ? p.stack.join(', ') : '';

  el.innerHTML = `
    <p class="card__eyebrow">${esc(eyebrow)}</p>
    <h2 class="card__title">${esc(p.subtitle)}</h2>
    ${stack ? `<p class="card__stack">${esc(stack)}</p>` : ''}
    ${isMissing(p.headline.value) ? '' : `<p class="card__figure"><span class="card__value">${esc(p.headline.value)}</span>
      <span class="card__label">${esc(p.headline.label)}</span></p>`}
    <p class="card__go">${esc(to ? to.label : 'Source not public')}</p>`;
  return el;
}

function render(projects, active) {
  const shown = active ? projects.filter(p => p.stack.includes(active)) : projects;
  grid.replaceChildren(...shown.map(card));
  status.textContent = active
    ? `${shown.length} of ${projects.length} projects, filtered by ${active}.`
    : `${projects.length} projects.`;
}

function buildFilters(projects, onPick) {
  // one button per stack value present in the data, in first-seen order
  const values = [...new Set(projects.flatMap(p => p.stack))];
  let active = null;

  const buttons = values.map(v => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = v;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      // The reserve exists only to hold the lattice open until the cards land.
      // Drop it on the first interaction so a filtered list can shrink — CLS
      // ignores shifts within 500ms of user input, so this costs nothing.
      document.querySelector('#sheet')?.classList.remove('sheet--reserving');
      active = active === v ? null : v;          // clicking the active one clears it
      buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b && active !== null)));
      clear.hidden = active === null;
      onPick(active);
    });
    return b;
  });

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'chip chip--clear';
  clear.textContent = 'Clear filter';
  clear.hidden = true;
  clear.addEventListener('click', () => {
    document.querySelector('#sheet')?.classList.remove('sheet--reserving');
    active = null;
    buttons.forEach(x => x.setAttribute('aria-pressed', 'false'));
    clear.hidden = true;
    onPick(null);
  });

  filters.replaceChildren(...buttons, clear);
}

try {
  const data = await load(DATA, DRAFT_KEY);
  const projects = data.projects;
  buildFilters(projects, active => render(projects, active));
  render(projects, null);
} catch (err) {
  // Never show an empty grid. Say what is wrong and what to do about it.
  errorBox.hidden = false;
  errorBox.querySelector('.error__detail code').textContent = err.message;
  console.error(err);
}
