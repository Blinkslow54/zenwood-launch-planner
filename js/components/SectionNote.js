import { h, icons, id } from '../lib/dom.js';
import { store } from '../state/store.js';
import { SECTION_NOTE } from '../content/site-copy.js';

/**
 * Optional free-text note for one section. Collapsed behind a quiet
 * "Add a note" link so it never feels like a required form field;
 * opens automatically if a note was already written.
 */
export function SectionNote(sectionId, sectionTitle) {
  const fieldId = id(`note-${sectionId}`);
  const existing = store.get().sectionNotes[sectionId] || '';

  const textarea = h('textarea', {
    id: fieldId,
    class: 'field__input field__input--area section-note__input',
    rows: 3,
    maxlength: 1500,
    placeholder: SECTION_NOTE.placeholder,
  });
  textarea.value = existing;
  textarea.addEventListener('input', () => {
    const notes = { ...store.get().sectionNotes, [sectionId]: textarea.value };
    if (!textarea.value.trim()) delete notes[sectionId];
    store.set({ sectionNotes: notes });
  });

  const field = h(
    'div',
    { class: 'section-note__field', hidden: !existing },
    h('label', { class: 'section-note__label', for: fieldId }, SECTION_NOTE.label(sectionTitle)),
    textarea
  );

  const opener = h(
    'button',
    {
      type: 'button',
      class: 'link-btn section-note__add',
      'aria-expanded': String(!!existing),
      'aria-controls': fieldId,
      hidden: !!existing,
      onclick: () => {
        field.hidden = false;
        opener.hidden = true;
        opener.setAttribute('aria-expanded', 'true');
        textarea.focus();
      },
    },
    icons.plus(),
    SECTION_NOTE.add
  );

  return h('div', { class: 'section-note' }, opener, field);
}
