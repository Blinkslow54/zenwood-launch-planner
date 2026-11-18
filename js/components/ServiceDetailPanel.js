import { h } from '../lib/dom.js';
import { SelectionButton } from './SelectionControl.js';
import { openBrandKitPreview } from './brand-kit/BrandKitPreview.js';
import { SERVICE_PRICING } from '../content/pricing.js';
import { PriceTag } from './PriceTag.js';

/** Price and the shoot days the service needs (production is added to Your Plan automatically). */
function PriceFacts(service) {
  const p = SERVICE_PRICING[service.id];
  if (!p) return null;
  return h(
    'dl',
    { class: 'detail__facts' },
    h('div', null, h('dt', null, 'Price'), h('dd', null, PriceTag(p, 'detail__price'), p.allIn ? h('span', { class: 'detail__allin' }, 'All-in: includes its shoot days and travel') : null)),
    h('div', null, h('dt', null, 'Shoot days needed'), h('dd', null, p.production || 'None — no shoot required'))
  );
}

/** Goal, inclusions, and the selection action for a single service. */
export function ServiceDetailPanel(service) {
  const long = service.included.length > 6;
  const previewBtn =
    service.preview === 'brandKit'
      ? h(
          'button',
          { type: 'button', class: 'btn btn--ghost', 'aria-haspopup': 'dialog', onclick: (e) => openBrandKitPreview(e.currentTarget) },
          'View Example Brand Kit'
        )
      : null;

  return h(
    'div',
    { class: 'detail' },
    h(
      'div',
      { class: 'detail__grid' },
      h(
        'div',
        { class: 'detail__purpose' },
        h('p', { class: 'detail__label' }, 'The goal'),
        h('p', { class: 'detail__goal' }, service.goal),
        service.note ? h('p', { class: 'detail__note' }, service.note) : null,
        PriceFacts(service)
      ),
      h(
        'div',
        { class: 'detail__included' },
        h('p', { class: 'detail__label' }, "What's included"),
        h('ul', { class: `included${long ? ' included--cols' : ''}` }, service.included.map((i) => h('li', null, i)))
      )
    ),
    h('div', { class: 'detail__actions' }, SelectionButton(service), previewBtn)
  );
}
