/**
 * One shared, rAF-throttled scroll loop for scroll-driven effects
 * (hero video scrub, parallax). Effects only run while on screen and
 * never run when the visitor prefers reduced motion.
 */
import { prefersReducedMotion } from './dom.js';

const effects = new Set();
let ticking = false;
let started = false;

export const motionEnabled = () => !prefersReducedMotion();

/** Visitors on data saver or very slow connections get still images instead of video. */
export function videoEnabled() {
  const c = navigator.connection;
  return motionEnabled() && !(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function frame() {
  ticking = false;
  const vh = window.innerHeight;
  effects.forEach((fx) => {
    const r = fx.el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    fx.update(r, vh);
  });
}

export function requestFrame() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

/** register({ el, update(rect, viewportHeight) }) */
export function registerEffect(fx) {
  if (!motionEnabled()) return;
  effects.add(fx);
  if (!started) {
    started = true;
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame, { passive: true });
  }
  requestFrame();
}

/** Muted inline videos may need a play()/pause() nudge before seeking works (iOS). */
export function primeVideo(video) {
  video.muted = true;
  const p = video.play?.();
  if (p && p.then) p.then(() => video.pause()).catch(() => {});
}
