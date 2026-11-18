import { h, icons, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { INFLUENCER_SUPPORT, SOCIAL_PAIRING } from '../content/services.js';

/** Optional sub-question shown once Influencer Partnership Management is selected. */
export function InfluencerTypeQuestion() {
  const name = id('influencer-type');
  const legendId = id('legend');
  const radios = INFLUENCER_SUPPORT.options.map((o) => {
    const input = h('input', { type: 'radio', name, value: o.value, class: 'option__input' });
    input.addEventListener('change', () => store.set({ influencerType: o.value }));
    return { input, el: h('label', { class: 'option' }, input, h('span', { class: 'option__mark', 'aria-hidden': 'true' }), h('span', { class: 'option__label' }, o.label)) };
  });

  const sync = (s) => radios.forEach(({ input }) => (input.checked = input.value === s.influencerType));
  sync(store.get());
  store.subscribe(sync);

  return h(
    'fieldset',
    { class: 'question question--inline', 'aria-labelledby': legendId },
    h('legend', { class: 'question__label', id: legendId }, INFLUENCER_SUPPORT.question, h('span', { class: 'question__optional' }, INFLUENCER_SUPPORT.hint)),
    h('div', { class: 'options options--grid' }, radios.map((r) => r.el))
  );
}

/** Informational note about how Strategy & Content Creation relate. */
export function SocialPairingNote() {
  const text = h('p', { class: 'note__text' });
  const note = h('div', { class: 'note', hidden: true }, h('span', { class: 'note__icon', 'aria-hidden': 'true' }, icons.info()), text);
  const wrap = h('div', { class: 'note-wrap', 'aria-live': 'polite' }, note);

  const sync = (s) => {
    const strat = s.selected.includes(SOCIAL_PAIRING.strategyId);
    const content = s.selected.includes(SOCIAL_PAIRING.contentId);
    const msg = content && !strat ? SOCIAL_PAIRING.contentOnly : content && strat ? SOCIAL_PAIRING.both : '';
    if (text.textContent !== msg) text.textContent = msg;
    note.hidden = !msg;
    note.classList.toggle('note--paired', content && strat);
  };
  sync(store.get());
  store.subscribe(sync);
  return wrap;
}

/**
 * Quantity stepper for per-unit services (supporting videos, creators).
 * Minimum 1, since the service is priced per unit once selected.
 */
export function CountQuestion({ key, question, hint, unitPrice, min = 1, max = 30 }) {
  const inputId = id(`count-${key}`);
  const hintId = id(`count-${key}-hint`);
  const clamp = (n) => Math.max(min, Math.min(max, n));
  const input = h('input', { id: inputId, class: 'stepper__input', type: 'number', inputmode: 'numeric', min, max, 'aria-describedby': hintId });
  input.addEventListener('input', () => {
    const n = parseInt(input.value, 10);
    if (Number.isFinite(n)) store.set({ [key]: clamp(n) });
  });
  input.addEventListener('blur', () => sync(store.get()));
  const step = (d) => store.set({ [key]: clamp((parseInt(store.get()[key], 10) || min) + d) });
  const dec = h('button', { type: 'button', class: 'stepper__btn', 'aria-label': 'One fewer', onclick: () => step(-1) }, icons.minus());
  const inc = h('button', { type: 'button', class: 'stepper__btn', 'aria-label': 'One more', onclick: () => step(1) }, icons.plus());
  const subtotal = h('span', { class: 'question__subtotal', 'aria-live': 'polite' });

  function sync(s) {
    const n = clamp(parseInt(s[key], 10) || min);
    if (document.activeElement !== input) input.value = n;
    dec.disabled = n <= min;
    inc.disabled = n >= max;
    subtotal.textContent = unitPrice ? unitPrice(n) : '';
  }
  sync(store.get());
  store.subscribe(sync);

  return h(
    'div',
    { class: 'question question--inline question--count' },
    h('label', { class: 'question__label', for: inputId }, question),
    hint ? h('p', { class: 'question__hint', id: hintId }, hint) : null,
    h('div', { class: 'question__controls' }, h('div', { class: 'stepper' }, dec, input, inc), subtotal)
  );
}
