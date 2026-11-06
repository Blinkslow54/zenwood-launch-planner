import { h } from '../lib/dom.js';
import { store } from '../state/store.js';
import { goToCategory, scrollToId } from '../lib/navigation.js';
import { Wordmark } from './Wordmark.js';

/**
 * Slim top bar: wordmark, quiet stage links (desktop), and the plan
 * indicator, which doubles as the sticky "jump to summary" control.
 */
export function Header() {
  const link = (label, onClick) =>
    h('a', { href: '#', class: 'site-nav__link', onclick: (e) => (e.preventDefault(), onClick()) }, label);

  const count = h('span', { class: 'plan-pill__count' }, '0');
  const pill = h(
    'a',
    { href: '#summary', class: 'plan-pill', onclick: (e) => (e.preventDefault(), scrollToId('summary')) },
    h('span', { class: 'plan-pill__label' }, 'Your Plan'),
    count
  );

  const header = h(
    'header',
    { class: 'site-header' },
    h(
      'div',
      { class: 'site-header__inner' },
      h('a', { href: '#intro', class: 'site-header__brand', onclick: (e) => (e.preventDefault(), scrollToId('intro', { focus: false })) }, Wordmark()),
      h(
        'nav',
        { class: 'site-nav', 'aria-label': 'Launch planner sections' },
        link('Foundation', () => goToCategory('brand-foundation')),
        link('Launch Services', () => scrollToId('launch-services')),
        link('After Launch', () => scrollToId('post-launch'))
      ),
      pill
    )
  );

  const update = (state) => {
    const n = state.selected.length;
    count.textContent = String(n);
    pill.classList.toggle('has-items', n > 0);
    pill.setAttribute('aria-label', `Your launch plan: ${n} service${n === 1 ? '' : 's'} selected. Go to summary.`);
  };
  update(store.get());
  store.subscribe((s, meta) => {
    update(s);
    if (meta?.type === 'toggle') {
      pill.classList.remove('pulse');
      void pill.offsetWidth;
      pill.classList.add('pulse');
    }
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return header;
}
