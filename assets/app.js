/* Phase 1 — home page. Every card and the caption render from
 * data/projects.json. No copy is hardcoded here.
 */

import { load, esc } from './store.js';
import { coverflow } from './coverflow.js';

const DATA = 'data/projects.json';
const DRAFT_KEY = 'yaman-portfolio:projects';

const track = document.querySelector('#track');
const caption = document.querySelector('#caption');
const dots = document.querySelector('#dots');
const errorBox = document.querySelector('#error');
const stackRow = document.querySelector('#stack-row');

function cardEl(p) {
  const el = document.createElement('div');
  el.className = 'cf__card';
  const href = p.links.study || p.links.repo || '';
  el.innerHTML = `
    <img class="cf__img" src="${esc(p.cover)}" alt="${esc(p.coverAlt)}" width="600" height="600" loading="lazy">
    ${href ? `<a class="cf__hit" href="${esc(href)}"><span class="visually-hidden">${esc(p.title)}</span></a>` : ''}`;
  return el;
}

function captionEl(p) {
  const rows = p.meta.map(m => `
    <div class="cap__row"><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('');
  const href = p.links.study || p.links.repo;
  const linkLabel = p.links.study ? 'Read the case study' : 'View the repository';
  return `
    <p class="eyebrow">${esc([p.year, p.title].filter(Boolean).join(' · '))}</p>
    <h3 class="cap__title">${esc(p.subtitle)}</h3>
    <p class="cap__summary">${esc(p.summary)}</p>
    <dl class="cap__meta">
      ${rows}
      <div class="cap__row"><dt>${esc(p.headline.label)}</dt><dd class="cap__figure">${esc(p.headline.value)}</dd></div>
    </dl>
    ${href ? `<p><a class="cap__link" href="${esc(href)}">${esc(linkLabel)}</a></p>`
           : `<p class="cap__link cap__link--none">Source not public</p>`}`;
}

try {
  const { projects } = await load(DATA, DRAFT_KEY);

  track.replaceChildren(...projects.map(cardEl));

  const buttons = projects.map((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', `Show ${p.title}`);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => cf.go(i));
    return b;
  });
  dots.replaceChildren(...buttons);

  const cf = coverflow(track, {
    onChange(i) {
      // aria-live="polite" on #caption announces this to screen readers
      caption.innerHTML = captionEl(projects[i]);
      buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    }
  });

  document.querySelector('#prev').addEventListener('click', () => cf.prev());
  document.querySelector('#next').addEventListener('click', () => cf.next());

  // Stack row: the union of every stack value in the data, in first-seen order.
  const stack = [...new Set(projects.flatMap(p => p.stack))];
  stackRow.replaceChildren(...stack.map(s => {
    const li = document.createElement('li');
    li.className = 'tag';
    li.textContent = s;
    return li;
  }));
} catch (err) {
  // Never show an empty carousel. Say what is wrong and what to do about it.
  errorBox.hidden = false;
  errorBox.querySelector('.error__detail code').textContent = err.message;
  document.querySelector('#carousel').hidden = true;
  console.error(err);
}
