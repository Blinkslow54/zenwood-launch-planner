import { h } from '../lib/dom.js';
import { HOW_IT_WORKS } from '../content/site-copy.js';

/** Three-step guide placed where the owner starts choosing services. */
export function HowItWorks() {
  return h(
    'aside',
    { class: 'how reveal', 'aria-label': HOW_IT_WORKS.label },
    h('p', { class: 'eyebrow how__label' }, HOW_IT_WORKS.label),
    h(
      'ol',
      { class: 'how__steps' },
      HOW_IT_WORKS.steps.map((s, i) =>
        h(
          'li',
          { class: 'how__step' },
          h('span', { class: 'how__num', 'aria-hidden': 'true' }, String(i + 1)),
          h('span', { class: 'how__text' }, h('span', { class: 'how__title' }, s.title), h('span', { class: 'how__body' }, s.body))
        )
      )
    ),
    h('p', { class: 'how__note' }, HOW_IT_WORKS.note)
  );
}
