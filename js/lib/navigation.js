/** Cross-section navigation: open a category and bring it into view. */
import { prefersReducedMotion } from './dom.js';

const categories = new Map();

export function registerCategory(categoryId, api) {
  categories.set(categoryId, api);
}

export function goToCategory(categoryId, { focus = true } = {}) {
  const api = categories.get(categoryId);
  if (!api) return;
  api.open();
  scrollToEl(api.el, focus ? api.focusTarget : null);
}

export function scrollToId(elementId, { focus = true } = {}) {
  const el = document.getElementById(elementId);
  if (!el) return;
  scrollToEl(el, focus ? el : null);
}

function scrollToEl(el, focusEl) {
  // Wait a frame so newly opened panels have measured layout.
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) {
      if (!focusEl.hasAttribute('tabindex') && !/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(focusEl.tagName)) {
        focusEl.setAttribute('tabindex', '-1');
      }
      focusEl.focus({ preventScroll: true });
    }
  });
}
