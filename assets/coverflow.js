/* Coverflow — a dependency-free cover carousel.
 *
 * phase-1-home.md describes this module as already written and says to change
 * behaviour through the options object rather than the internals. It was not
 * in the repo, so it is implemented here to that contract. If you have your own
 * copy, replace this file — the options below are the whole public surface.
 *
 * How it works:
 *   - one fractional card index, `pos`, is the entire state
 *   - transforms are painted straight to the DOM, no layout thrash
 *   - looping folds the signed distance around the ring, so card 0 and card
 *     n-1 are one step apart rather than n-1 steps apart
 *
 * Options
 *   rotate   deg of Y-rotation per step away from centre
 *   depth    px pushed back per step away from centre
 *   falloff  exponent on lateral spacing; >1 crowds distant cards
 *   fade     opacity lost per step away from centre
 *   gap      px between adjacent card centres
 *   loop     wrap around the ends
 *   onChange called with the settled integer index
 */

const DEFAULTS = {
  rotate: 38, depth: 130, falloff: 0.82, fade: 0.32,
  gap: 190, loop: true, onChange: null
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function coverflow(root, userOptions = {}) {
  const o = { ...DEFAULTS, ...userOptions };
  const cards = [...root.children];
  const n = cards.length;
  if (!n) return null;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let pos = 0;        // fractional index — the whole state
  let target = 0;
  let raf = null;
  let announced = -1;

  /* Signed distance from the centre, folded around the ring when looping.
     Without the fold, jumping from the last card to the first would sweep the
     whole strip instead of taking one step. */
  function delta(i) {
    let d = i - pos;
    if (!o.loop) return d;
    const half = n / 2;
    return ((d % n) + n + half) % n - half;
  }

  function paint() {
    for (let i = 0; i < n; i++) {
      const d = delta(i);
      const a = Math.abs(d);
      const dir = Math.sign(d);

      // falloff <1 spreads near cards and crowds far ones
      const x = dir * Math.pow(a, o.falloff) * o.gap;
      const z = -a * o.depth;
      const ry = -d * o.rotate;

      const card = cards[i];
      card.style.transform =
        `translate3d(${x.toFixed(2)}px,0,${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg)`;
      card.style.opacity = clamp(1 - a * o.fade, 0, 1).toFixed(3);
      card.style.zIndex = String(1000 - Math.round(a * 100));
      // only the centred card is reachable; the rest are decoration
      // Fold the same way settle() and index() do — pos goes negative when
      // go() takes the short way round, and a raw remainder is then negative
      // and matches no card, leaving every card aria-hidden and untabbable.
      const centred = (((Math.round(pos) % n) + n) % n) === i;
      card.setAttribute('aria-hidden', centred ? 'false' : 'true');
      card.querySelectorAll('a,button').forEach(el => { el.tabIndex = centred ? 0 : -1; });
    }
  }

  function settle() {
    const idx = ((Math.round(pos) % n) + n) % n;
    if (idx !== announced) {
      announced = idx;
      if (typeof o.onChange === 'function') o.onChange(idx, cards[idx]);
    }
  }

  function tick() {
    const diff = target - pos;
    if (Math.abs(diff) < 0.001) {
      pos = target;
      paint(); settle();
      raf = null;
      return;
    }
    pos += diff * 0.18;             // critically damped enough to never overshoot
    paint(); settle();
    raf = requestAnimationFrame(tick);
  }

  function animate() {
    // Reduced motion: land on the new card immediately. Nothing animates.
    if (reduced.matches) {
      pos = target; paint(); settle();
      return;
    }
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  function go(to) {
    target = o.loop ? to : clamp(to, 0, n - 1);
    if (o.loop) {
      // keep target near pos so the fold picks the short way round
      const half = n / 2;
      while (target - pos > half) target -= n;
      while (pos - target > half) target += n;
    }
    animate();
  }

  const next = () => go(Math.round(target) + 1);
  const prev = () => go(Math.round(target) - 1);
  const index = () => ((Math.round(pos) % n) + n) % n;

  /* ---- drag ------------------------------------------------------------ */
  let dragging = false, startX = 0, startPos = 0, moved = 0;

  root.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    // stops the browser starting a native link/image drag, which would fire
    // pointercancel and abort the gesture; also stops text selection
    e.preventDefault();
    dragging = true; moved = 0;
    startX = e.clientX; startPos = pos;
    root.setPointerCapture(e.pointerId);
    root.classList.add('is-dragging');
  });

  root.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    pos = startPos - dx / o.gap;
    if (!o.loop) pos = clamp(pos, 0, n - 1);
    paint(); settle();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    if (e.pointerId !== undefined && root.hasPointerCapture?.(e.pointerId)) {
      root.releasePointerCapture(e.pointerId);
    }
    go(Math.round(pos));
    // let the click guard above see this drag, then forget it
    requestAnimationFrame(() => { moved = 0; });
  }
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointercancel', endDrag);

  // A drag must not also fire the card's link. The guard is cleared on the next
  // frame: without that, `moved` stays high after one drag and swallows every
  // later click, including a keyboard Enter on the centred card.
  root.addEventListener('click', e => {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  /* ---- keyboard -------------------------------------------------------- */
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
  });

  // repaint if the motion preference changes mid-session
  reduced.addEventListener?.('change', () => { pos = target; paint(); });

  paint(); settle();

  // No autoplay. It fights the reader — see phase-1-home.md.
  return { next, prev, go, index, count: n, cards };
}
