import { h, icons, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { CABIN_COUNT, INFLUENCER_SUPPORT, SOCIAL_PAIRING } from '../content/services.js';

/** Optional: number of cabins to capture (number stepper or "Not sure yet"). */
export function CabinCountQuestion() {
  const inputId = id('cabins');
  const hintId = id('cabins-hint');

  const input = h('input', {
    id: inputId,
    class: 'stepper__input',
    type: 'number',
    inputmode: 'numeric',
    min: CABIN_COUNT.min,
    max: CABIN_COUNT.max,
    placeholder: '—',
    'aria-describedby': hintId,
  });

  const clamp = (n) => Math.max(CABIN_COUNT.min, Math.min(CABIN_COUNT.max, n));
  const commit = (n) => store.set({ cabinCount: n, cabinNotSure: n ? false : store.get().cabinNotSure });

  input.addEventListener('input', () => {
    const n = parseInt(input.value, 10);
    commit(Number.isFinite(n) && n > 0 ? clamp(n) : null);
  });
  input.addEventListener('blur', () => sync(store.get()));

  const step = (delta) => {
    const cur = store.get().cabinCount || 0;
    const next = cur + delta;
    commit(next < CABIN_COUNT.min ? null : clamp(next));
  };

  const dec = h('button', { type: 'button', class: 'stepper__btn', 'aria-label': 'One fewer cabin', onclick: () => step(-1) }, icons.minus());
  const inc = h('button', { type: 'button', class: 'stepper__btn', 'aria-label': 'One more cabin', onclick: () => step(1) }, icons.plus());

  const notSure = h(
    'button',
    {
      type: 'button',
      class: 'chip',
      'aria-pressed': 'false',
      onclick: () => {
        const on = !store.get().cabinNotSure;
        store.set({ cabinNotSure: on, cabinCount: on ? null : store.get().cabinCount });
      },
    },
    h('span', { class: 'chip__dot', 'aria-hidden': 'true' }),
    CABIN_COUNT.notSureLabel
  );

  function sync(s) {
    if (document.activeElement !== input) input.value = s.cabinCount ?? '';
    dec.disabled = !s.cabinCount;
    notSure.setAttribute('aria-pressed', String(!!s.cabinNotSure));
  }
  sync(store.get());
  store.subscribe(sync);

  return h(
    'div',
    { class: 'question question--cabins' },
    h('label', { class: 'question__label', for: inputId }, CABIN_COUNT.question),
    h('p', { class: 'question__hint', id: hintId }, CABIN_COUNT.hint),
    h('div', { class: 'question__controls' }, h('div', { class: 'stepper' }, dec, input, inc), h('span', { class: 'question__or', 'aria-hidden': 'true' }, 'or'), notSure)
  );
}

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
