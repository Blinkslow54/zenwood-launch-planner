import { h } from '../lib/dom.js';
import { BRAND } from '../content/site-copy.js';
import { MEDIA } from '../content/media.js';

function textMark(size) {
  return h(
    'span',
    { class: `wordmark wordmark--${size}`, 'aria-label': `${BRAND.name}, ${BRAND.location}` },
    h('span', { class: 'wordmark__name', 'aria-hidden': 'true' }, BRAND.name),
    h('span', { class: 'wordmark__place', 'aria-hidden': 'true' }, BRAND.location)
  );
}

/**
 * Zenwood's own logo files (see js/content/media.js).
 *   variant 'lockup'   stacked logo, used in the hero
 *   variant 'monogram' the Z mark, used in the header
 * Falls back to a text wordmark if the image can't load.
 */
export function Wordmark({ variant = 'monogram' } = {}) {
  const logo = variant === 'lockup' ? MEDIA.logoLockup : MEDIA.logoMonogram;
  if (!logo?.src) return textMark(variant === 'lockup' ? 'lg' : 'sm');
  const wrap = h('span', { class: `logo logo--${variant}` });
  const img = h('img', { src: logo.src, alt: logo.alt, decoding: 'async' });
  img.addEventListener('error', () => wrap.replaceWith(textMark(variant === 'lockup' ? 'lg' : 'sm')), { once: true });
  wrap.append(img);
  return wrap;
}
