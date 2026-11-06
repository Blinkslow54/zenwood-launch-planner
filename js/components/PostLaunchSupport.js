import { h } from '../lib/dom.js';
import { store } from '../state/store.js';
import { POST_LAUNCH } from '../content/services.js';
import { announce } from '../lib/announce.js';
import { SectionNote } from './SectionNote.js';

/** Deliberately short: one question, three answers. No packages. */
export function PostLaunchSupport() {
  const name = 'post-launch-interest';
  const radios = POST_LAUNCH.options.map((o) => {
    const input = h('input', { type: 'radio', name, value: o.value, class: 'option__input' });
    input.addEventListener('change', () => {
      store.set({ postLaunch: o.value });
      announce(`Post-launch support: ${o.summary}.`);
    });
    return {
      input,
      el: h('label', { class: 'option option--card' }, input, h('span', { class: 'option__mark', 'aria-hidden': 'true' }), h('span', { class: 'option__label' }, o.label)),
    };
  });

  const clear = h('button', { type: 'button', class: 'link-btn post__clear', onclick: () => store.set({ postLaunch: null }) }, 'Clear answer');

  const sync = (s) => {
    radios.forEach(({ input }) => (input.checked = input.value === s.postLaunch));
    clear.hidden = !s.postLaunch;
  };
  sync(store.get());
  store.subscribe(sync);

  return h(
    'section',
    { class: 'post', id: 'post-launch', 'aria-labelledby': 'post-heading', tabindex: '-1' },
    h(
      'div',
      { class: 'container container--narrow post__inner reveal' },
      h('p', { class: 'eyebrow' }, 'Stage Three · ', POST_LAUNCH.eyebrow),
      h('h2', { class: 'section-head__title', id: 'post-heading' }, POST_LAUNCH.heading),
      POST_LAUNCH.body.map((p) => h('p', { class: 'post__body' }, p)),
      h(
        'fieldset',
        { class: 'question post__question' },
        h('legend', { class: 'question__label' }, POST_LAUNCH.question),
        h('div', { class: 'options options--row' }, radios.map((r) => r.el)),
        clear
      ),
      h('div', { class: 'post__note' }, SectionNote(POST_LAUNCH.id, 'ongoing support'))
    )
  );
}
