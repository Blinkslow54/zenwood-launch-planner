import { h, icons } from '../lib/dom.js';
import { store } from '../state/store.js';
import { announce } from '../lib/announce.js';

function toggle(service) {
  const next = !store.isSelected(service.id);
  store.toggle(service.id, next);
  announce(`${service.name} ${next ? 'added to' : 'removed from'} your launch plan.`);
}

/** Labeled "Add to plan" pill shown on each service row — the main way to select. */
export function SelectionPill(service) {
  const icon = h('span', { class: 'pill-add__icon', 'aria-hidden': 'true' });
  const label = h('span', { class: 'pill-add__label' });
  const btn = h(
    'button',
    { type: 'button', class: 'pill-add', 'aria-pressed': 'false', 'aria-label': `Add ${service.name} to my launch plan`, onclick: () => toggle(service) },
    icon,
    label
  );
  const update = (s) => {
    const on = s.selected.includes(service.id);
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
    label.textContent = on ? 'Added' : 'Add to plan';
    icon.replaceChildren(on ? icons.check() : icons.plus());
    btn.title = on ? 'Click to remove from your plan' : '';
  };
  update(store.get());
  store.subscribe(update);
  return btn;
}

/** Full-width "Add to My Launch Plan" toggle shown inside the detail panel. */
export function SelectionButton(service) {
  const label = h('span', { class: 'add-btn__label' });
  const icon = h('span', { class: 'add-btn__icon', 'aria-hidden': 'true' });
  const btn = h(
    'button',
    { type: 'button', class: 'btn add-btn', 'aria-pressed': 'false', onclick: () => toggle(service) },
    icon,
    label
  );
  const update = (s) => {
    const on = s.selected.includes(service.id);
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
    label.textContent = on ? 'Added to Your Launch Plan' : 'Add to My Launch Plan';
    icon.replaceChildren(on ? icons.check() : icons.plus());
    btn.title = on ? 'Select again to remove' : '';
  };
  update(store.get());
  store.subscribe(update);

  const remove = h(
    'button',
    { type: 'button', class: 'link-btn add-btn__remove', onclick: () => toggle(service) },
    'Remove'
  );
  const syncRemove = (s) => (remove.hidden = !s.selected.includes(service.id));
  syncRemove(store.get());
  store.subscribe(syncRemove);

  return h('div', { class: 'add-row' }, btn, remove);
}
