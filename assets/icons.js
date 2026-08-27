/* Inline SVG marks for the contact rows.
 *
 * Inline rather than an icon font or a sprite sheet: AGENTS.md forbids adding a
 * dependency, and four paths do not justify a network request. Each one is
 * aria-hidden because the row's own <dt> already names it — a screen reader
 * should hear "Email", not "Email, email icon".
 *
 * currentColor throughout, so a mark inherits whatever the row's text colour is
 * and can never drift out of the palette.
 *
 * GitHub and LinkedIn ship these marks precisely so people can link to them;
 * they are used here only as links to Yaman's own profiles.
 */

const PATHS = {
  email:
    '<path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h13A1.5 1.5 0 0 1 18 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5v-11Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  + '<path d="m3 5 7 5.5L17 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

  linkedin:
    '<path fill="currentColor" d="M4.98 3.5a2 2 0 1 1-.01 4.001A2 2 0 0 1 4.98 3.5ZM3.4 8.98h3.16V19H3.4V8.98Z"/>'
  + '<path fill="currentColor" d="M8.6 8.98h3.03v1.37h.04c.42-.8 1.45-1.64 2.98-1.64 3.19 0 3.78 2.1 3.78 4.83V19h-3.15v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55V19H8.6V8.98Z"/>',

  github:
    '<path fill="currentColor" d="M10 .3a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.86c-2.51.55-3.04-1.2-3.04-1.2-.41-1.05-1-1.33-1-1.33-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.31-.98.57-1.2-2-.23-4.11-1-4.11-4.46 0-.98.35-1.79.93-2.42-.1-.23-.4-1.15.09-2.4 0 0 .75-.24 2.47.92a8.6 8.6 0 0 1 4.5 0c1.71-1.16 2.47-.92 2.47-.92.49 1.25.18 2.17.09 2.4.58.63.93 1.44.93 2.42 0 3.47-2.11 4.23-4.12 4.45.32.28.61.83.61 1.68l-.01 2.5c0 .26.18.57.69.47A10 10 0 0 0 10 .3Z"/>',

  document:
    '<path d="M5 2.5h6l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
  + '<path d="M11 2.5v4h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
};

/** Returns an <svg> element, or null when the name is unknown. */
export function icon(name) {
  const d = PATHS[name];
  if (!d) return null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = d;
  return svg;
}
