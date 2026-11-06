import { h } from '../lib/dom.js';
import { registerEffect, motionEnabled, primeVideo, clamp } from '../lib/scrollFx.js';
import { attachFireflies } from '../lib/fireflies.js';

/**
 * A full-bleed parallax image band with a short line of copy, used to
 * pace the transitions between stages (as Zenwood's site does).
 * media: { still: { video, time } } | { image } plus an optional `poster`.
 */
export function Interlude({ media, quote, caption, fireflies = true }) {
  const layer = h('div', { class: 'interlude__media' });

  if (media.poster || media.image) {
    const img = h('img', { src: media.image || media.poster, alt: '', loading: 'lazy', decoding: 'async' });
    img.addEventListener('error', () => img.remove(), { once: true });
    layer.append(img);
  }
  if (media.still) {
    const v = h('video', { src: `${media.still.video}#t=${media.still.time}`, muted: true, playsinline: true, preload: 'none', 'aria-hidden': 'true', tabindex: '-1' });
    v.muted = true;
    const show = () => v.classList.add('is-ready');
    v.addEventListener('loadeddata', () => {
      if (Math.abs(v.currentTime - media.still.time) > 0.1) v.currentTime = media.still.time;
      else show();
    }, { once: true });
    v.addEventListener('seeked', show);
    v.addEventListener('error', () => v.remove(), { once: true });
    layer.append(v);
    // Load only when the band approaches the viewport.
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      v.preload = 'auto';
      v.load();
      v.addEventListener('loadedmetadata', () => { primeVideo(v); }, { once: true });
    }, { rootMargin: '600px 0px' }).observe(layer);
  }

  const canvas = fireflies && motionEnabled() ? h('canvas', { class: 'fireflies', 'aria-hidden': 'true' }) : null;

  const el = h(
    'section',
    { class: 'interlude', 'aria-label': caption || 'Interlude' },
    layer,
    h('div', { class: 'interlude__shade', 'aria-hidden': 'true' }),
    canvas,
    h('figure', { class: 'interlude__content reveal' },
      h('blockquote', { class: 'interlude__quote' }, h('p', null, quote)),
      caption ? h('figcaption', { class: 'eyebrow interlude__caption' }, caption) : null)
  );

  if (canvas) attachFireflies(canvas, { density: 0.00004 });

  registerEffect({
    el,
    update(rect, vh) {
      const p = clamp((vh - rect.top) / (vh + rect.height)); // 0 entering → 1 leaving
      layer.style.transform = `translate3d(0, ${((p - 0.5) * 22).toFixed(2)}%, 0)`;
    },
  });

  return el;
}
