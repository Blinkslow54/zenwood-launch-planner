import { h } from '../lib/dom.js';

/**
 * Service price label. A discounted service (e.g. the free Brand Kit)
 * shows its regular price struck through, then the new price.
 */
export function PriceTag(p, className) {
  if (p.regularLabel) {
    return h(
      'span',
      { class: `${className} price--discounted` },
      h('s', { class: 'price-was', 'aria-label': `Regularly ${p.regularLabel}` }, p.regularLabel),
      ' ',
      h('span', { class: 'price-free' }, p.label)
    );
  }
  return h('span', { class: className }, p.label);
}
