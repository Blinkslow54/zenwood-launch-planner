import { h } from '../lib/dom.js';
import { SelectionButton } from './SelectionControl.js';
import { openBrandKitPreview } from './brand-kit/BrandKitPreview.js';

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
        service.note ? h('p', { class: 'detail__note' }, service.note) : null
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
