import { h, prefersReducedMotion } from './lib/dom.js';
import { CATEGORIES, SERVICE_IDS, POST_LAUNCH } from './content/services.js';
import { STAGES, BRAND, INTERLUDES } from './content/site-copy.js';
import { MEDIA } from './content/media.js';
import { Interlude } from './components/Interlude.js';
import { store } from './state/store.js';
import { mountAnnouncer } from './lib/announce.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { LaunchRoadmap } from './components/LaunchRoadmap.js';
import { ServiceCategory } from './components/ServiceCategory.js';
import { PostLaunchSupport } from './components/PostLaunchSupport.js';
import { SelectionSummary } from './components/SelectionSummary.js';
import { HowItWorks } from './components/HowItWorks.js';

store.init(SERVICE_IDS);

const foundation = CATEGORIES.filter((c) => c.group === 'foundation');
const launch = CATEGORIES.filter((c) => c.group === 'launch');
const ordered = [...foundation, ...launch];
const nextFor = (c) => {
  const i = ordered.indexOf(c);
  const n = ordered[i + 1];
  return n ? { label: n.title, categoryId: n.id } : { label: POST_LAUNCH.title, targetId: 'post-launch' };
};

const stageHead = (stage, headingId) =>
  h('header', { class: 'section-head reveal' },
    h('p', { class: 'eyebrow' }, stage.eyebrow),
    h('h2', { class: 'section-head__title', id: headingId }, stage.heading),
    stage.body ? h('p', { class: 'section-head__body' }, stage.body) : null);

const main = h(
  'main',
  { id: 'main', tabindex: '-1' },
  Hero(),
  LaunchRoadmap(),
  Interlude({ media: MEDIA.interludes.beforeFoundation, ...INTERLUDES.beforeFoundation }),
  h('section', { class: 'stage stage--foundation', id: 'foundation', 'aria-labelledby': 'stage-foundation' },
    h('div', { class: 'container' },
      stageHead(STAGES.foundation, 'stage-foundation'),
      HowItWorks(),
      // Open by default so the first services (and their Add buttons) are visible right away.
      foundation.map((c) => ServiceCategory(c, { variant: 'root', next: nextFor(c), defaultOpen: true })))),
  h('section', { class: 'stage stage--launch', id: 'launch-services', 'aria-labelledby': 'stage-launch', tabindex: '-1' },
    h('div', { class: 'container' },
      stageHead(STAGES.launch, 'stage-launch'),
      h('div', { class: 'branches' }, launch.map((c) => ServiceCategory(c, { variant: 'branch', next: nextFor(c) }))))),
  Interlude({ media: MEDIA.interludes.beforePostLaunch, ...INTERLUDES.beforePostLaunch }),
  PostLaunchSupport(),
  SelectionSummary()
);

const footer = h('footer', { class: 'site-footer' },
  h('div', { class: 'container site-footer__inner' },
    h('p', null, `${BRAND.preparedBy} for ${BRAND.name}.`),
    h('p', { class: 'site-footer__muted' }, 'Your selections are saved on this device as you go.')));

const app = document.getElementById('app');
app.replaceChildren(Header(), main, footer);
mountAnnouncer();

/* Gentle reveal on scroll (skipped entirely for reduced motion). */
const reveals = document.querySelectorAll('.reveal');
if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  document.documentElement.classList.add('motion-ok');
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  reveals.forEach((el) => io.observe(el));
}
