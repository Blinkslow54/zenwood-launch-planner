/**
 * BRAND KIT PREVIEW — self-contained modal.
 * Replaceable independently: the rest of the app only calls
 * openBrandKitPreview(triggerEl). Content comes from example-brand-kit.js,
 * or from BRAND_KIT_PREVIEW.src (PDF/image) when configured.
 */
import { h, icons } from '../../lib/dom.js';
import { BRAND_KIT_PREVIEW } from '../../config.js';
import { EXAMPLE_BRAND_KIT as KIT } from './example-brand-kit.js';

let dialog;
let returnFocus;

const renderers = {
  colors: (s) =>
    h('div', { class: 'bk-swatches' }, s.items.map((c) =>
      h('div', { class: 'bk-swatch' },
        h('span', { class: 'bk-swatch__chip', style: { background: c.hex } }),
        h('span', { class: 'bk-swatch__name' }, c.name),
        h('span', { class: 'bk-swatch__hex' }, c.hex),
        h('span', { class: 'bk-swatch__usage' }, c.usage)))),
  typography: (s) =>
    h('div', { class: 'bk-type' }, s.items.map((t) =>
      h('div', { class: 'bk-type__row' },
        h('span', { class: 'bk-type__role' }, `${t.role} · ${t.family}`),
        h('span', { class: `bk-type__sample bk-type__sample--${t.style}` }, t.sample)))),
  traits: (s) =>
    h('ul', { class: 'bk-traits' }, s.items.map((t) =>
      h('li', null, h('span', { class: 'bk-traits__is' }, t.trait), h('span', { class: 'bk-traits__not' }, t.not)))),
  moodboard: (s) =>
    h('div', { class: 'bk-mood' }, s.items.map((m) =>
      h('figure', { class: `bk-mood__tile bk-mood__tile--${m.tone}` }, h('figcaption', null, m.label)))),
  list: (s) =>
    h('dl', { class: 'bk-list' }, s.items.flatMap((i) => [h('dt', null, i.k), h('dd', null, i.v)])),
};

function placeholderBody() {
  return [
    h('p', { class: 'bk-disclaimer', role: 'note' }, h('span', { class: 'bk-disclaimer__tag' }, 'Placeholder'), KIT.disclaimer),
    ...KIT.sections.map((s, i) =>
      h('section', { class: 'bk-section' },
        h('header', { class: 'bk-section__head' },
          h('span', { class: 'bk-section__num' }, String(i + 1).padStart(2, '0')),
          h('h3', { class: 'bk-section__title' }, s.title),
          h('p', { class: 'bk-section__caption' }, s.caption)),
        renderers[s.type]?.(s))),
  ];
}

function externalBody(src) {
  const isPdf = /\.pdf($|\?)/i.test(src);
  const note = BRAND_KIT_PREVIEW.note
    ? h('p', { class: 'bk-note', role: 'note' }, h('span', { class: 'bk-disclaimer__tag' }, 'Example'), BRAND_KIT_PREVIEW.note)
    : null;
  if (isPdf) return [note, h('iframe', { class: 'bk-embed', src, title: BRAND_KIT_PREVIEW.title })];

  const img = h('img', { class: 'bk-image', src, alt: BRAND_KIT_PREVIEW.alt || BRAND_KIT_PREVIEW.title, decoding: 'async' });
  const figure = h('figure', { class: 'bk-figure' }, img);
  // If the file is missing, fall back to the built-in placeholder rather than a broken image.
  img.addEventListener('error', () => figure.closest('.bk-dialog__body')?.replaceChildren(...placeholderBody()), { once: true });
  const full = h('a', { class: 'link-btn bk-full', href: src, target: '_blank', rel: 'noopener' }, 'Open full size', icons.arrow());
  return [note, figure, full];
}

function build() {
  const close = () => dialog.close();
  dialog = h(
    'dialog',
    { class: 'bk-dialog', 'aria-labelledby': 'bk-title' },
    h('div', { class: 'bk-dialog__frame' },
      h('header', { class: 'bk-dialog__head' },
        h('div', null,
          h('p', { class: 'eyebrow' }, 'Brand Foundation'),
          h('h2', { class: 'bk-dialog__title', id: 'bk-title' }, BRAND_KIT_PREVIEW.title || KIT.title),
          h('p', { class: 'bk-dialog__subtitle' }, (BRAND_KIT_PREVIEW.src && BRAND_KIT_PREVIEW.subtitle) || KIT.subtitle)),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close example Brand Kit', onclick: close }, icons.close())),
      h('div', { class: `bk-dialog__body${BRAND_KIT_PREVIEW.src ? ' bk-dialog__body--media' : ''}` }, BRAND_KIT_PREVIEW.src ? externalBody(BRAND_KIT_PREVIEW.src) : placeholderBody()),
      h('footer', { class: 'bk-dialog__foot' },
        h('button', { type: 'button', class: 'btn btn--ghost', onclick: close }, 'Back to Launch Planner')))
  );
  // Click on the backdrop closes.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('has-modal');
    returnFocus?.focus();
  });
  document.body.append(dialog);
}

export function openBrandKitPreview(trigger) {
  if (!dialog) build();
  returnFocus = trigger;
  document.documentElement.classList.add('has-modal');
  dialog.showModal();
  dialog.querySelector('.bk-dialog__body').scrollTop = 0;
}
