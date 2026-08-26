/* Phase 6 — owner mode.
 *
 * READ THIS FIRST. This is NOT authentication and must never pretend to be.
 * A static site on GitHub Pages ships every byte to every visitor: anyone can
 * open DevTools, read this file, and add ?owner=1 themselves. So there is no
 * password, no PIN, no hashed secret, and no copy anywhere claiming this area
 * is private, protected or secure. It edits public content only.
 *
 * If protected editing is ever genuinely needed, that is a backend, and it is
 * out of scope for this repo.
 */

import { loaded, save, exportJson, discard, hasDraft } from './store.js';

const FIELDS = {
  // project record -> editable text fields
  project: [
    ['title', 'Title'], ['subtitle', 'Subtitle'], ['summary', 'Summary'],
    ['year', 'Year'], ['coverAlt', 'Cover alt text'],
  ],
  headline: [['value', 'Headline value'], ['label', 'Headline label']],
};

let panel, toggleBtn, lastFocus, keyInUse, recordIndex = 0;

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

/* ---- which record are we editing? --------------------------------------
 * Editing the wrong project silently is the main failure mode here, so the
 * panel names the record at every moment and the header echoes it. */

function records(entry) {
  if (Array.isArray(entry.data.projects)) {
    return entry.data.projects.map((p, i) => ({ i, label: `${p.title} (${p.slug})`, obj: p, kind: 'project' }));
  }
  return [{ i: 0, label: `Profile — ${entry.data.name}`, obj: entry.data, kind: 'profile' }];
}

function fieldRow(obj, key, label, onEdit) {
  const wrap = el('label', 'owner__field');
  wrap.append(el('span', 'owner__label', label));
  const long = String(obj[key] ?? '').length > 60;
  const input = document.createElement(long ? 'textarea' : 'input');
  if (long) input.rows = 4; else input.type = 'text';
  input.value = obj[key] ?? '';
  input.addEventListener('input', () => onEdit(key, input.value));
  wrap.append(input);
  return wrap;
}

function buildBody(entry) {
  const body = el('div', 'owner__body');
  const list = records(entry);
  const rec = list[Math.min(recordIndex, list.length - 1)];

  // record picker
  const pick = el('label', 'owner__field');
  pick.append(el('span', 'owner__label', 'Editing'));
  const select = document.createElement('select');
  list.forEach(r => {
    const o = document.createElement('option');
    o.value = String(r.i); o.textContent = r.label;
    select.append(o);
  });
  select.value = String(rec.i);
  select.addEventListener('change', () => { recordIndex = +select.value; render(); });
  pick.append(select);
  body.append(pick);

  // the loud "this is the record" banner
  body.append(el('p', 'owner__editing', `Editing: ${rec.label}`));

  const touch = () => { panel.querySelector('.owner__state').textContent = 'Unsaved changes'; };

  if (rec.kind === 'project') {
    FIELDS.project.forEach(([k, l]) =>
      body.append(fieldRow(rec.obj, k, l, (key, v) => { rec.obj[key] = v; touch(); })));
    FIELDS.headline.forEach(([k, l]) =>
      body.append(fieldRow(rec.obj.headline, k, l, (key, v) => { rec.obj.headline[key] = v; touch(); })));
  } else {
    [['name', 'Name'], ['role', 'Role'], ['location', 'Location']].forEach(([k, l]) =>
      body.append(fieldRow(rec.obj, k, l, (key, v) => { rec.obj[key] = v; touch(); })));
  }
  return body;
}

function render() {
  const entry = loaded.get(keyInUse);
  const old = panel.querySelector('.owner__body');
  const wasOnSelect = old && old.contains(document.activeElement)
                       && document.activeElement.tagName === 'SELECT';
  const fresh = buildBody(entry);
  old ? old.replaceWith(fresh) : panel.append(fresh);
  // render() destroys the node the user was on; put them back on the picker
  if (wasOnSelect) fresh.querySelector('select')?.focus();
}

/* ---- focus trap --------------------------------------------------------- */

function focusables() {
  return [...panel.querySelectorAll('a[href],button,select,input,textarea')]
    .filter(n => !n.disabled && n.offsetParent !== null);
}

function onKeydown(e) {
  if (e.key === 'Escape') { close(); return; }
  if (e.key !== 'Tab') return;
  const f = focusables();
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];

  // Focus can end up outside the panel entirely — render() replaces the body,
  // destroying whatever node was focused. Pull it back rather than only
  // handling the first/last case.
  if (!panel.contains(document.activeElement)) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
    return;
  }
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* Both of these own aria-expanded, so every close path — the toggle, the ✕ and
   Escape — leaves the button describing the real state. */
function close() {
  panel.hidden = true;
  toggleBtn?.setAttribute('aria-expanded', 'false');
  document.removeEventListener('keydown', onKeydown, true);
  lastFocus?.focus();
}

function open() {
  lastFocus = document.activeElement;
  panel.hidden = false;
  toggleBtn?.setAttribute('aria-expanded', 'true');
  document.addEventListener('keydown', onKeydown, true);
  focusables()[0]?.focus();
}

/* ---- mount -------------------------------------------------------------- */

export function mountOwner() {
  if (document.querySelector('.owner')) return;
  keyInUse = [...loaded.keys()][0];
  if (!keyInUse) return;
  const entry = loaded.get(keyInUse);

  // the role pill tells the truth about which mode is showing
  const pill = document.querySelector('.pill');
  if (pill) pill.textContent = 'Owner';

  const toggle = el('button', 'owner__toggle', 'Edit content');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  toggleBtn = toggle;
  document.body.append(toggle);

  panel = el('aside', 'owner');
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Edit content');

  const head = el('div', 'owner__head');
  head.append(el('p', 'owner__title', 'Edit content'));
  const x = el('button', 'owner__close', '✕');
  x.type = 'button';
  x.setAttribute('aria-label', 'Close editor');
  x.addEventListener('click', close);
  head.append(x);
  panel.append(head);

  panel.append(el('p', 'owner__note',
    `Edits are saved in this browser only. Export the file and commit it to publish. ` +
    `Anyone can open this panel by adding ?owner=1 — it edits public content, so nothing here is hidden.`));

  panel.append(el('p', 'owner__source', `Source: ${entry.file}`));
  panel.append(el('p', 'owner__state', hasDraft(keyInUse) ? 'Local draft in use' : 'Showing published file'));

  render();

  const actions = el('div', 'owner__actions');

  const saveBtn = el('button', 'btn btn--primary', 'Save');
  saveBtn.type = 'button';
  saveBtn.addEventListener('click', () => {
    save(keyInUse, loaded.get(keyInUse).data);
    panel.querySelector('.owner__state').textContent = 'Saved to this browser';
  });

  const exportBtn = el('button', 'btn', 'Export JSON');
  exportBtn.type = 'button';
  exportBtn.addEventListener('click', () => exportJson(keyInUse));

  const discardBtn = el('button', 'btn owner__discard', 'Discard local edits');
  discardBtn.type = 'button';
  discardBtn.addEventListener('click', () => {
    discard(keyInUse);
    location.reload();
  });

  actions.append(saveBtn, exportBtn, discardBtn);
  panel.append(actions);
  document.body.append(panel);
}
