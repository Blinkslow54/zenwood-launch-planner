import { h, svg, icons } from '../lib/dom.js';
import { CATEGORIES, POST_LAUNCH } from '../content/services.js';
import { ROADMAP } from '../content/site-copy.js';
import { store } from '../state/store.js';
import { goToCategory, scrollToId } from '../lib/navigation.js';

/**
 * The launch roadmap, structured like an umbrella:
 *   Brand Foundation spans the full width on top,
 *   the three launch branches sit side by side beneath it,
 *   and Post-Launch Support sits at the base.
 * Soft branching lines show how the foundation flows into each branch
 * and how the branches carry into post-launch.
 * Each card is a shortcut into its section and shows selection progress.
 */

// Card centers sit at 1/6, 1/2 and 5/6 of the width (x = 100, 300, 500 of 600).
const SPLIT = 'M300 0 C300 34 100 26 100 60 M300 0 V60 M300 0 C300 34 500 26 500 60';
const JOIN = 'M100 0 C100 34 300 26 300 60 M300 0 V60 M500 0 C500 34 300 26 300 60';

const connector = (d, mod) =>
  svg(`<svg class="flow flow--${mod}" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`);

const dots = (category, state) =>
  category.services.map((s) => h('span', { class: `dots__dot${state.selected.includes(s.id) ? ' is-on' : ''}` }));

export function LaunchRoadmap() {
  const updaters = [];
  const foundation = CATEGORIES.find((c) => c.group === 'foundation');
  const branches = CATEGORIES.filter((c) => c.group === 'launch');

  const card = (c, variant, extra) => {
    const status = h('span', { class: 'node__status' });
    const d = h('span', { class: 'dots', 'aria-hidden': 'true' });
    const btn = h(
      'button',
      { type: 'button', class: `node node--${variant}`, onclick: () => goToCategory(c.id) },
      h('span', { class: 'node__number', 'aria-hidden': 'true' }, c.number),
      h('span', { class: 'node__title' }, c.title),
      h('span', { class: 'node__blurb' }, c.roadmapBlurb),
      extra,
      h('span', { class: 'node__foot' }, d, status, h('span', { class: 'node__go', 'aria-hidden': 'true' }, icons.arrow()))
    );
    updaters.push((s) => {
      const n = c.services.filter((sv) => s.selected.includes(sv.id)).length;
      status.textContent = n ? `${n} of ${c.services.length} selected` : `${c.services.length} services`;
      d.replaceChildren(...dots(c, s));
      btn.classList.toggle('has-selection', n > 0);
    });
    return btn;
  };

  const root = card(foundation, 'root', h('span', { class: 'node__caption' }, ROADMAP.foundationCaption));
  const branchCards = branches.map((c) => card(c, 'branch'));

  const postStatus = h('span', { class: 'node__status' });
  const post = h(
    'button',
    { type: 'button', class: 'node node--post', onclick: () => scrollToId('post-launch') },
    h('span', { class: 'node__title' }, POST_LAUNCH.title),
    h('span', { class: 'node__foot' }, postStatus, h('span', { class: 'node__go', 'aria-hidden': 'true' }, icons.arrow()))
  );
  updaters.push((s) => {
    const opt = POST_LAUNCH.options.find((o) => o.value === s.postLaunch);
    postStatus.textContent = opt ? opt.summary : 'One quick question';
    post.classList.toggle('has-selection', !!opt);
  });

  const section = h(
    'section',
    { class: 'roadmap', id: 'roadmap', 'aria-labelledby': 'roadmap-heading', tabindex: '-1' },
    h(
      'div',
      { class: 'container' },
      h(
        'header',
        { class: 'section-head section-head--center reveal' },
        h('p', { class: 'eyebrow' }, ROADMAP.eyebrow),
        h('h2', { class: 'section-head__title', id: 'roadmap-heading' }, ROADMAP.heading),
        h('p', { class: 'section-head__body' }, ROADMAP.body)
      ),
      h(
        'nav',
        { class: 'flowmap reveal', 'aria-label': 'Launch roadmap' },
        root,
        connector(SPLIT, 'split'),
        h('div', { class: 'flowmap__branches' }, branchCards),
        connector(JOIN, 'join'),
        h('div', { class: 'flowmap__base' }, post)
      )
    )
  );

  const update = (s) => updaters.forEach((u) => u(s));
  update(store.get());
  store.subscribe(update);
  return section;
}
