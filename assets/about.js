/* Phase 5 — about page.
 * Every block renders from data/profile.json. Identity content lives in the
 * data file, never in the HTML — same pattern as data/projects.json.
 *
 * NOTE: phase-5-about.md lists about.html, assets/about.css and
 * data/profile.json but no script; "every block renders from
 * data/profile.json" cannot be met without one.
 */

import { load } from './store.js';
import { icon } from './icons.js';

const DATA = 'data/profile.json';
const DRAFT_KEY = 'yaman-portfolio:profile';

/* A TODO(yaman) marker means the fact is NOT KNOWN YET. It is a note to the
 * repo owner, not copy for a reader — phase-7-ship.md forbids shipping them.
 * So anything still carrying one is treated as absent: the row is dropped, or
 * a neutral placeholder stands in. The marker stays in the JSON. */
const isMissing = v => !v || /TODO\(yaman\)/.test(String(v));

const el = id => document.querySelector(`#${id}`);
const text = (id, value) => { const n = el(id); if (n) n.textContent = value; };

/** Show a block only when it has something real to say. */
function setOrHide(id, value, container) {
  const node = el(id);
  if (!node) return false;
  if (isMissing(value)) {
    (container ? node.closest(container) : node)?.setAttribute('hidden', '');
    return false;
  }
  node.textContent = value;
  return true;
}

/** One <dt>/<dd> pair. Rows with no real href are NOT rendered at all — blanks
 *  on a sheet read as unfinished to an admissions reader. Ship the rows that
 *  resolve; the TODO stays in profile.json.
 *
 *  `iconName` is optional: the mark sits in the <dt> beside the label, and is
 *  aria-hidden because the label already says what it is. */
function pair(term, value, href, iconName) {
  const wrap = document.createElement('div');

  const dt = document.createElement('dt');
  const mark = iconName ? icon(iconName) : null;
  if (mark) dt.append(mark);
  dt.append(document.createTextNode(term));
  if (mark) dt.classList.add('has-icon');

  const dd = document.createElement('dd');
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = value;
    // an external profile opens where the reader expects it to
    if (/^https?:/.test(href)) { a.rel = 'me noopener'; }
    dd.append(a);
  } else {
    dd.textContent = value;
  }

  wrap.append(dt, dd);
  return wrap;
}

const listItems = items => items.map(t => {
  const li = document.createElement('li');
  li.textContent = t;
  return li;
});

try {
  const p = await load(DATA, DRAFT_KEY);

  text('name', p.name);
  text('role', p.role);
  text('location', p.location);

  // The portrait parcel is display:none until proven otherwise — see the note
  // in about.css. Revealing is safe; hiding after paint collapses its space.
  const photo = el('photo');
  const sheet = el('sheet');
  if (!isMissing(p.photo)) {
    photo.src = p.photo;
    photo.alt = p.photoAlt;
    sheet.classList.add('sheet--has-portrait');
    photo.addEventListener('error', () => sheet.classList.remove('sheet--has-portrait'));
  }

  el('bio').replaceChildren(...p.bio.map(s => {
    const para = document.createElement('p');
    para.textContent = s;
    return para;
  }));

  text('now-heading', p.now.heading);
  text('now-body', p.now.body);

  const a = p.academic;
  text('degree', a.degree);
  text('institution', `${a.institution}, ${a.year}`);

  text('gradproject-title', a.graduationProject.title);
  text('gradproject-summary', a.graduationProject.summary);
  const gradLink = el('gradproject-link');
  if (!isMissing(a.graduationProject.link)) {
    gradLink.href = a.graduationProject.link;
    gradLink.classList.add('is-shown');
  }

  // The formal report and research interests are dropped entirely until they
  // are real. A section reading "TODO" is worse than one that is not there.
  const hasReport = !isMissing(a.report.title);
  if (hasReport) {
    text('report-title', a.report.title);
    if (!isMissing(a.report.note)) text('report-note', a.report.note);
    const reportLink = el('report-link');
    if (!isMissing(a.report.file)) {
      reportLink.href = a.report.file;
      reportLink.classList.add('is-shown');
    }
  } else {
    el('report-group').hidden = true;
  }

  if (!setOrHide('research', a.researchInterests)) {
    el('research-group').hidden = true;
  }

  // One row per certification, with the issuer and year in a tabular column —
  // not a single run-on line.
  el('certifications').replaceChildren(...a.certifications.map(c => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'cert__name';
    name.textContent = c.name;
    const meta = document.createElement('span');
    meta.className = 'cert__meta';
    meta.textContent = `${c.issuer} · ${c.year}`;
    li.append(name, meta);
    return li;
  }));

  // Fill the four static skill shells rather than creating them — see the
  // comment in about.html. All four stay identical in fill, weight and size;
  // a difference between them would claim a proficiency level, which is the
  // banned skill rating in another shape.
  const shells = [...document.querySelectorAll('.parcel--skill')];
  shells.forEach((shell, i) => {
    const group = p.skills[i];
    if (!group) { shell.hidden = true; return; }
    shell.querySelector('.parcel__label').textContent = group.heading;
    shell.querySelector('ul').replaceChildren(...listItems(group.items));
  });

  el('languages').replaceChildren(...p.languages.map(l => pair(l.language, l.level, null)));

  // Rows with no real href are not rendered — see pair() above.
  el('contact').replaceChildren(
    ...p.contact.filter(c => !isMissing(c.href))
                .map(c => pair(c.label, c.value, c.href, c.icon)));
} catch (err) {
  const box = el('error');
  box.hidden = false;
  box.querySelector('.error__detail code').textContent = err.message;
  console.error(err);
}
