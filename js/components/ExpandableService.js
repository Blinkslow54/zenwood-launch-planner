import { h, icons, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { SelectionPill } from './SelectionControl.js';
import { ServiceDetailPanel } from './ServiceDetailPanel.js';
import { InfluencerTypeQuestion } from './ConditionalQuestions.js';

/**
 * One service row: name and summary, with two explicit actions —
 * "Add to plan" (select) and "Details" (expand without selecting).
 */
export function ExpandableService(service) {
  const panelId = id(`svc-${service.id}`);
  let open = false;

  const tag = h('span', { class: 'service__tag' }, 'In your plan');

  // Clicking the name/summary also opens details.
  const textToggle = h(
    'button',
    { type: 'button', class: 'service__toggle', 'aria-expanded': 'false', 'aria-controls': panelId, onclick: () => setOpen(!open) },
    h('span', { class: 'service__name' }, service.name, tag),
    h('span', { class: 'service__short' }, service.short)
  );

  const detailsLabel = h('span', null, 'Details');
  const detailsBtn = h(
    'button',
    { type: 'button', class: 'service__details', 'aria-expanded': 'false', 'aria-controls': panelId, 'aria-label': `${service.name} details`, onclick: () => setOpen(!open) },
    detailsLabel,
    icons.chevron()
  );

  const panel = h(
    'div',
    { class: 'collapse', id: panelId, role: 'region', 'aria-label': `${service.name} details`, inert: true },
    h('div', { class: 'collapse__inner' }, ServiceDetailPanel(service))
  );

  const followUp = service.followUp === 'influencerType' ? InfluencerTypeQuestion() : null;
  const followWrap = followUp
    ? h('div', { class: 'collapse service__followup', inert: true }, h('div', { class: 'collapse__inner' }, followUp))
    : null;

  const item = h(
    'li',
    { class: 'service', dataset: { service: service.id } },
    h(
      'div',
      { class: 'service__row' },
      textToggle,
      h('div', { class: 'service__actions' }, SelectionPill(service), detailsBtn)
    ),
    panel,
    followWrap
  );

  function setOpen(next) {
    open = next;
    [textToggle, detailsBtn].forEach((b) => b.setAttribute('aria-expanded', String(open)));
    detailsLabel.textContent = open ? 'Close' : 'Details';
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
    item.classList.toggle('is-expanded', open);
  }

  const update = (s) => {
    const on = s.selected.includes(service.id);
    item.classList.toggle('is-selected', on);
    if (followWrap) {
      followWrap.classList.toggle('is-open', on);
      followWrap.inert = !on;
    }
  };
  update(store.get());
  store.subscribe(update);

  return item;
}
