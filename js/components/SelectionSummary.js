import { h, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { SUMMARY } from '../content/site-copy.js';
import { POST_LAUNCH } from '../content/services.js';
import { buildPlan } from '../lib/plan.js';
import { goToCategory, scrollToId } from '../lib/navigation.js';
import { ProposalSubmission } from './ProposalSubmission.js';
import { motionEnabled } from '../lib/scrollFx.js';
import { attachFireflies } from '../lib/fireflies.js';

function Group(title, items, onEdit, editLabel, note) {
  return h(
    'div',
    { class: 'plan__group' },
    h('div', { class: 'plan__group-head' },
      h('h3', { class: 'plan__group-title' }, title),
      h('button', { type: 'button', class: 'link-btn plan__edit', 'aria-label': editLabel, onclick: onEdit }, 'Edit')),
    items.length
      ? h('ul', { class: 'plan__items' }, items.map((i) =>
          h('li', null, h('span', { class: 'plan__item-name' }, i.name), i.detail ? h('span', { class: 'plan__item-detail' }, i.detail) : null)))
      : null,
    note ? h('p', { class: 'plan__note' }, h('span', { class: 'plan__note-label' }, 'Your note'), note) : null
  );
}

export function SelectionSummary() {
  const list = h('div', { class: 'plan__list' });

  const renderList = (state) => {
    const plan = buildPlan(state);
    const groups = plan.groups.map((g) => Group(g.title, g.items, () => goToCategory(g.categoryId), `Edit ${g.title}`, g.note));
    if (plan.postLaunch || plan.postLaunchNote) {
      groups.push(Group(POST_LAUNCH.title, plan.postLaunch ? [{ name: plan.postLaunch.label }] : [], () => scrollToId('post-launch'), 'Edit post-launch support', plan.postLaunchNote));
    }
    list.replaceChildren(...(groups.length ? groups : [h('p', { class: 'plan__empty' }, SUMMARY.empty)]));
    list.classList.toggle('is-empty', !groups.length);
  };
  renderList(store.get());
  store.subscribe((s, meta) => {
    // Notes/date typing doesn't affect the list — skip needless re-renders.
    if (meta?.keys && meta.keys.every((k) => k === 'notes' || k === 'launchDate' || k === 'lastSubmittedAt')) return;
    renderList(s);
  });

  const notesId = id('notes');
  const dateId = id('launch-date');
  const notes = h('textarea', { id: notesId, class: 'field__input field__input--area', rows: 4, placeholder: SUMMARY.notesPlaceholder, maxlength: 2000 });
  notes.value = store.get().notes;
  notes.addEventListener('input', () => store.set({ notes: notes.value }));

  const date = h('input', { id: dateId, class: 'field__input', type: 'text', autocomplete: 'off', placeholder: SUMMARY.datePlaceholder, maxlength: 80 });
  date.value = store.get().launchDate;
  date.addEventListener('input', () => store.set({ launchDate: date.value }));

  const canvas = motionEnabled() ? h('canvas', { class: 'fireflies fireflies--soft', 'aria-hidden': 'true' }) : null;
  if (canvas) queueMicrotask(() => attachFireflies(canvas, { density: 0.000025 }));

  return h(
    'section',
    { class: 'summary', id: 'summary', 'aria-labelledby': 'summary-heading', tabindex: '-1' },
    canvas,
    h(
      'div',
      { class: 'container container--narrow' },
      h('header', { class: 'section-head section-head--center reveal' },
        h('p', { class: 'eyebrow' }, SUMMARY.eyebrow),
        h('h2', { class: 'section-head__title', id: 'summary-heading' }, SUMMARY.heading),
        h('p', { class: 'section-head__body' }, SUMMARY.body)),
      h('div', { class: 'plan reveal' },
        list,
        h('div', { class: 'plan__fields' },
          h('div', { class: 'field field--date' },
            h('label', { class: 'field__label', for: dateId }, SUMMARY.dateLabel, h('span', { class: 'field__optional' }, 'Optional')),
            date),
          h('div', { class: 'field' },
            h('label', { class: 'field__label', for: notesId }, SUMMARY.notesLabel, h('span', { class: 'field__optional' }, 'Optional')),
            notes)),
        ProposalSubmission())
    )
  );
}
