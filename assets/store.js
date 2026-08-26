/* Shared data loader for every page that reads from data/.
 *
 * Load order, per docs/phases/phase-6-owner-mode.md:
 *   1. a localStorage draft, if the owner has saved one
 *   2. the published JSON file
 *   3. a clear error
 *
 * It THROWS rather than returning a fallback. Phase 1 needs the failure so it
 * can render the "serve this over http" box — a silently empty carousel is
 * worse than a loud one.
 */

/** Escape a value for interpolation into HTML, attributes included.
 *  Every page renders JSON straight into innerHTML, and owner mode makes those
 *  fields editable, so a stray quote must not be able to break out. */
export const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* What this page actually loaded. Owner mode reads this so it always edits the
 * record the page is really showing, rather than guessing from the URL. */
export const loaded = new Map();

export async function load(file, key) {
  const draft = localStorage.getItem(key);
  if (draft) {
    const data = JSON.parse(draft);
    loaded.set(key, { file, key, data, fromDraft: true });
    bootOwnerMode();
    return data;
  }

  const res = await fetch(file);
  if (!res.ok) throw new Error(`${file} failed: ${res.status}`);
  const data = await res.json();
  loaded.set(key, { file, key, data, fromDraft: false });
  bootOwnerMode();
  return data;
}

/* ---- save / export / discard ------------------------------------------ */

/** Writes the whole data object to localStorage. Local to this browser only. */
export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data, null, 2));
  const entry = loaded.get(key);
  if (entry) { entry.data = data; entry.fromDraft = true; }
}

/** Downloads the file that replaces data/<name>.json in the repo. */
export function exportJson(key) {
  const entry = loaded.get(key);
  if (!entry) return false;
  const name = entry.file.split('/').pop();
  const blob = new Blob([JSON.stringify(entry.data, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return true;
}

/** Clears the local draft. The next load falls back to the published file. */
export function discard(key) {
  localStorage.removeItem(key);
}

export function hasDraft(key) {
  return localStorage.getItem(key) !== null;
}

/* ---- owner mode bootstrap ----------------------------------------------
 * This is NOT authentication. A static site ships every byte to every visitor;
 * anyone can read this source and set the query parameter themselves. There is
 * no password here and there must never be one — it would be public. Owner
 * mode is a convenience for editing public content, nothing more.
 *
 * Without ?owner=1 the module below is never fetched and no owner code runs.
 */
let booting = false;

function bootOwnerMode() {
  if (booting) return;
  if (!new URLSearchParams(location.search).has('owner')) return;
  booting = true;
  import('./owner.js')
    .then(m => m.mountOwner())
    .catch(err => console.error('owner mode failed to load', err));
}
