import { h, icons, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { registerCategory, goToCategory, scrollToId } from '../lib/navigation.js';
import { ExpandableService } from './ExpandableService.js';
import { CabinCountQuestion, SocialPairingNote } from './ConditionalQuestions.js';
import { SectionNote } from './SectionNote.js';

const EXTRAS = {
  cabinCount: CabinCountQuestion,
  socialPairing: SocialPairingNote,
};

/**
 * An expandable category (e.g. Website Content). Collapsed, it shows the
 * title, intro and selection count; expanded, its services.
 * `next` is { label, categoryId? , targetId? } for the "continue" link.
 */
export function ServiceCategory(category, { variant = 'branch', next, defaultOpen = false } = {}) {
  const panelId = id(`cat-${category.id}`);
  const headingId = id('cat-heading');
  let open = false;

  const count = h('span', { class: 'category__count' });
  // Visible "button" cue. The whole header is the real toggle (see .category__toggle::after),
  // so this is decorative for assistive tech, which hears the toggle's expanded state.
  const n = category.services.length;
  const cueLabel = h('span', null);
  const cue = h('span', { class: 'category__cue', 'aria-hidden': 'true' }, cueLabel, h('span', { class: 'category__chev' }, icons.chevron()));
  const toggle = h(
    'button',
    { type: 'button', class: 'category__toggle', 'aria-expanded': 'false', 'aria-controls': panelId, id: headingId },
    h('span', { class: 'category__number', 'aria-hidden': 'true' }, category.number),
    h('span', { class: 'category__title' }, category.title)
  );
  toggle.addEventListener('click', () => setOpen(!open));

  const extras = (category.extras || []).map((k) => EXTRAS[k]?.()).filter(Boolean);

  const nextLink = next
    ? h(
        'button',
        {
          type: 'button',
          class: 'link-btn category__next',
          onclick: () => (next.categoryId ? goToCategory(next.categoryId) : scrollToId(next.targetId)),
        },
        `Continue to ${next.label}`,
        icons.arrow()
      )
    : null;

  const panel = h(
    'div',
    { class: 'collapse', id: panelId, role: 'region', 'aria-labelledby': headingId, inert: true },
    h(
      'div',
      { class: 'collapse__inner' },
      h(
        'div',
        { class: 'category__body' },
        h('ul', { class: 'services', role: 'list' }, category.services.map(ExpandableService)),
        extras.length ? h('div', { class: 'category__extras' }, extras) : null,
        SectionNote(category.id, category.title),
        nextLink ? h('div', { class: 'category__footer' }, nextLink) : null
      )
    )
  );

  const el = h(
    'article',
    { class: `category category--${variant} reveal`, id: category.id, dataset: { category: category.id } },
    h(
      'div',
      { class: 'category__head' },
      h('p', { class: 'eyebrow category__eyebrow' }, category.eyebrow, category.badge ? h('span', { class: 'badge' }, category.badge) : null),
      h('h3', { class: 'category__heading' }, toggle),
      h('p', { class: 'category__intro' }, category.intro),
      h('div', { class: 'category__meta' }, count, cue)
    ),
    panel
  );

  function setOpen(nextOpen) {
    open = nextOpen;
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
    el.classList.toggle('is-open', open);
    cueLabel.textContent = open ? 'Hide services' : `See ${n} services`;
  }
  setOpen(defaultOpen);

  const update = (s) => {
    const n = category.services.filter((sv) => s.selected.includes(sv.id)).length;
    count.textContent = n ? `${n} of ${category.services.length} in your plan` : '';
    el.classList.toggle('has-selection', n > 0);
  };
  update(store.get());
  store.subscribe(update);

  registerCategory(category.id, { el, open: () => setOpen(true), focusTarget: toggle });
  return el;
}
