import { h, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { SUMMARY } from '../content/site-copy.js';
import { POST_LAUNCH } from '../content/services.js';
import { buildPlan } from '../lib/plan.js';
import { formatMoney, formatRange } from '../lib/pricing.js';
import { PRODUCTION, TRAVEL_PER_TRIP, CLIENT_NOTES, QUOTE_NOTE } from '../content/pricing.js';
import { goToCategory, scrollToId } from '../lib/navigation.js';
import { ProposalSubmission } from './ProposalSubmission.js';
import { motionEnabled } from '../lib/scrollFx.js';
import { attachFireflies } from '../lib/fireflies.js';

const money = (c, opts) => formatMoney(c, opts);

function Group(title, items, onEdit, editLabel, note) {
  return h(
    'div',
    { class: 'plan__group' },
    h('div', { class: 'plan__group-head' },
      h('h3', { class: 'plan__group-title' }, title),
      h('button', { type: 'button', class: 'link-btn plan__edit', 'aria-label': editLabel, onclick: onEdit }, 'Edit')),
    items.length
      ? h('ul', { class: 'plan__items' }, items.map((i) =>
          h('li', { class: 'plan__line' },
            h('span', { class: 'plan__line-text' },
              h('span', { class: 'plan__item-name' }, i.name),
              i.detail ? h('span', { class: 'plan__item-detail' }, i.detail) : null),
            i.amount != null
              ? h('span', { class: 'plan__amount' },
                  i.regular && i.amount === 0 ? [h('s', { class: 'price-was', 'aria-label': `Regularly ${money(i.regular)}` }, money(i.regular)), ' ', h('span', { class: 'price-free' }, 'Free')] : formatRange(i.amount, i.amountHigh))
              : null)))
      : null,
    note ? h('p', { class: 'plan__note' }, h('span', { class: 'plan__note-label' }, 'Your note'), note) : null
  );
}

/**
 * Required shoot days — shown with a "Required" tag and no remove control.
 * When Launch Production and Content Creation is selected, its all-in price covers them,
 * so they're listed without a price (a note above them explains).
 */
function Production(q) {
  if (!q.production.length) return null;
  return h(
    'div',
    { class: 'plan__group plan__group--production' },
    h('div', { class: 'plan__group-head' }, h('h3', { class: 'plan__group-title' }, PRODUCTION.heading)),
    q.productionIncludedBy ? h('p', { class: 'plan__included-note' }, 'All shoot days and their travel are included in the Launch Production and Content Creation price.') : null,
    h('ul', { class: 'plan__items' }, q.production.map((p) =>
      h('li', { class: 'plan__line' },
        h('span', { class: 'plan__line-text' },
          h('span', { class: 'plan__item-name' }, p.label, h('span', { class: 'plan__required' }, p.possible ? 'If needed' : 'Required')),
          h('span', { class: 'plan__item-desc' }, p.description)),
        p.included ? null : h('span', { class: 'plan__amount' }, money(p.amount)))))
  );
}

function Totals(q) {
  const row = (label, value, cls = '') => h('div', { class: `totals__row ${cls}` }, h('dt', null, label), h('dd', null, value));
  return h(
    'div',
    { class: 'plan__totals' },
    h('dl', { class: 'totals' },
      row('Services', formatRange(q.servicesTotal, q.servicesTotalHigh)),
      q.productionTotal ? row('Production', money(q.productionTotal)) : q.productionIncludedBy ? row('Production', 'Included') : null,
      q.discount || q.discountHigh ? row('Subtotal', formatRange(q.subtotal, q.subtotalHigh), 'totals__row--sub') : null,
      q.discount || q.discountHigh ? row(`Bundle discount (${Math.round(q.discountRate * 100)}%)`, `−${formatRange(q.discount, q.discountHigh)}`, 'totals__row--discount') : null,
      q.travel ? row(`Travel (${q.trips} trip${q.trips === 1 ? '' : 's'} × ${money(TRAVEL_PER_TRIP)})`, money(q.travel)) : null,
      row('Your quote', formatRange(q.total, q.totalHigh, { round: true }), 'totals__row--total')),
    q.isRange ? h('p', { class: 'totals__range' }, 'The quote is a range because Launch Production and Content Creation may need possible 4th–5th shoot days (non-model). The higher figure includes them.') : null,
    h('p', { class: 'totals__quote', role: 'note' }, QUOTE_NOTE),
    h('ul', { class: 'totals__notes' }, CLIENT_NOTES.map((n) => h('li', null, n)))
  );
}

export function SelectionSummary() {
  const list = h('div', { class: 'plan__list' });

  const renderList = (state) => {
    const plan = buildPlan(state);
    const q = plan.quote;
    const groups = plan.groups.map((g) => Group(g.title, g.items, () => goToCategory(g.categoryId), `Edit ${g.title}`, g.note));
    const blocks = [...groups, Production(q)].filter(Boolean);
    if (!q.isEmpty) blocks.push(Totals(q));
    if (plan.postLaunch || plan.postLaunchNote) {
      blocks.push(Group(POST_LAUNCH.title, plan.postLaunch ? [{ name: plan.postLaunch.label }] : [], () => scrollToId('post-launch'), 'Edit post-launch support', plan.postLaunchNote));
    }
    list.replaceChildren(...(blocks.length ? blocks : [h('p', { class: 'plan__empty' }, SUMMARY.empty)]));
    list.classList.toggle('is-empty', !blocks.length);
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
