import { h, icons } from '../lib/dom.js';
import { HERO, BRAND } from '../content/site-copy.js';
import { MEDIA } from '../content/media.js';
import { scrollToId } from '../lib/navigation.js';
import { registerEffect, motionEnabled, videoEnabled, primeVideo, smooth, clamp } from '../lib/scrollFx.js';
import { Wordmark } from './Wordmark.js';

/**
 * Pinned hero, modeled on Zenwood's homepage: the aerial video's playback
 * position follows the scroll while the headline lifts away and the
 * introduction fades in. With reduced motion it's a still image with the
 * text in normal flow.
 */
export function Hero() {
  const animated = motionEnabled();
  const [lead, ...rest] = HERO.body;

  const poster = h('img', { class: 'hero__poster', src: MEDIA.hero.poster, alt: MEDIA.hero.alt, fetchpriority: 'high', decoding: 'async' });
  poster.addEventListener('error', () => poster.remove(), { once: true });

  let video = null;
  if (videoEnabled() && MEDIA.hero.video) {
    video = h('video', { class: 'hero__video', src: MEDIA.hero.video, muted: true, playsinline: true, preload: 'auto', 'aria-hidden': 'true', tabindex: '-1', disablepictureinpicture: true });
    video.muted = true;
    video.addEventListener('loadeddata', () => video.classList.add('is-ready'), { once: true });
    video.addEventListener('loadedmetadata', () => primeVideo(video), { once: true });
    video.addEventListener('error', () => video.remove(), { once: true });
  }

  const media = h('div', { class: 'hero__media' }, poster, video);
  const shade = h('div', { class: 'hero__shade', 'aria-hidden': 'true' });

  const intro = h(
    'div',
    { class: 'hero__phase hero__phase--intro' },
    h('div', { class: 'hero__mark' }, Wordmark({ variant: 'lockup' })),
    h('p', { class: 'eyebrow hero__eyebrow' }, h('span', null, HERO.eyebrow), h('span', { class: 'hero__dot', 'aria-hidden': 'true' }, '·'), h('span', null, BRAND.preparedBy)),
    h('h1', { class: 'hero__heading', id: 'hero-heading' }, HERO.heading),
    h('div', { class: 'hero__rule', 'aria-hidden': 'true' }),
    h(
      'div',
      { class: 'hero__actions' },
      h('button', { type: 'button', class: 'btn btn--outline-light', onclick: () => scrollToId('roadmap') }, HERO.cta, icons.arrow()),
      h('p', { class: 'hero__reassurance' }, HERO.reassurance)
    )
  );

  const story = h(
    'div',
    { class: 'hero__phase hero__phase--story' },
    h('p', { class: 'hero__lead' }, lead),
    ...rest.map((p) => h('p', { class: 'hero__body' }, p))
  );

  const cue = h('div', { class: 'hero__cue', 'aria-hidden': 'true' }, h('span', null, 'Scroll'), h('span', { class: 'hero__cue-line' }));

  const sticky = h('div', { class: 'hero__sticky' }, media, shade, intro, story, cue);
  const section = h('section', { class: `hero ${animated ? 'hero--scrub' : 'hero--static'}`, id: 'intro', 'aria-labelledby': 'hero-heading' }, sticky);

  if (animated) {
    let shown = 0; // smoothed progress
    let target = 0;
    let raf = 0;

    const paint = () => {
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      const p = shown;

      // Headline lifts and fades; story fades in.
      const outA = 1 - smooth(0.04, 0.3, p);
      intro.style.opacity = outA.toFixed(3);
      intro.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0)`;
      intro.style.visibility = outA < 0.02 ? 'hidden' : '';
      intro.style.pointerEvents = outA > 0.5 ? '' : 'none';
      const inA = smooth(0.36, 0.56, p);
      story.style.opacity = inA.toFixed(3);
      // Only the visible layer may receive clicks (the layers overlap).
      story.style.pointerEvents = inA > 0.5 ? 'auto' : 'none';
      story.style.transform = `translate3d(0, ${((1 - inA) * 40).toFixed(1)}px, 0)`;
      cue.style.opacity = (1 - smooth(0.02, 0.12, p)).toFixed(3);

      // Slow push-in and gradual darkening, like the original.
      media.style.transform = `scale(${(1.02 + p * 0.08).toFixed(4)})`;
      shade.style.opacity = (0.45 + p * 0.45).toFixed(3);

      if (video && video.readyState >= 1 && video.duration && !video.seeking) {
        const t = clamp(p * 1.05) * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.03) video.currentTime = t;
      }
      raf = shown !== target ? requestAnimationFrame(paint) : 0;
    };

    registerEffect({
      el: section,
      update(rect, vh) {
        target = clamp(-rect.top / Math.max(1, rect.height - vh));
        if (!raf) raf = requestAnimationFrame(paint);
      },
    });
    if (video) video.addEventListener('seeked', () => { if (!raf && shown !== target) raf = requestAnimationFrame(paint); });
  }

  return section;
}
