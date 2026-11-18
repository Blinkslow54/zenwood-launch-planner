/**
 * Plays a Loom video in a pop-up. The player only loads when opened, and
 * is unloaded on close so playback stops. Videos are listed in
 * js/content/media.js (MEDIA.videos).
 */
import { h, icons } from '../lib/dom.js';

const dialogs = new Map();

const embedUrl = (loomId) =>
  `https://www.loom.com/embed/${loomId}?autoplay=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;

function build(video) {
  const frameWrap = h('div', { class: 'video-dialog__frame', style: { aspectRatio: video.aspect || '16 / 9' } });
  let returnFocus = null;
  const close = () => dialog.close();
  const dialog = h(
    'dialog',
    { class: 'video-dialog', 'aria-label': video.title },
    h('div', { class: 'video-dialog__inner' },
      h('div', { class: 'video-dialog__head' },
        h('p', { class: 'eyebrow' }, video.title),
        h('button', { type: 'button', class: 'icon-btn video-dialog__close', 'aria-label': `Close ${video.title}`, onclick: close }, icons.close())),
      frameWrap)
  );
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    frameWrap.replaceChildren(); // unload the player so the video stops
    document.documentElement.classList.remove('has-modal');
    returnFocus?.focus();
  });
  document.body.append(dialog);
  return {
    open(trigger) {
      returnFocus = trigger;
      frameWrap.replaceChildren(
        h('iframe', {
          src: embedUrl(video.loomId),
          title: video.title,
          allow: 'autoplay; fullscreen; picture-in-picture',
          allowfullscreen: true,
          loading: 'eager',
        })
      );
      document.documentElement.classList.add('has-modal');
      dialog.showModal();
    },
  };
}

export function openVideo(video, trigger) {
  if (!dialogs.has(video.loomId)) dialogs.set(video.loomId, build(video));
  dialogs.get(video.loomId).open(trigger);
}

/** "Watch …" button that opens the video. */
export function VideoButton(video) {
  return h(
    'button',
    { type: 'button', class: 'btn btn--outline-light video-btn', 'aria-haspopup': 'dialog', onclick: (e) => openVideo(video, e.currentTarget) },
    h('span', { class: 'video-btn__play', 'aria-hidden': 'true' }, icons.play()),
    video.buttonLabel || `Watch ${video.title}`,
    video.minutes ? h('span', { class: 'video-btn__time' }, `${video.minutes} min`) : null
  );
}

/**
 * Floating bubble in the bottom-right corner that opens the video.
 * Shows once the visitor scrolls past the hero, hides while the Send
 * button is on screen (so it never covers it), and can be dismissed
 * for the rest of the visit.
 */
export function VideoBubble(video) {
  const b = video.bubble || {};
  const DISMISS_KEY = `zenwood-video-bubble-dismissed:${video.loomId}`;
  try { if (sessionStorage.getItem(DISMISS_KEY)) return null; } catch { /* storage blocked */ }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const face = b.video && !reduced
    ? h('video', { class: 'bubble__face', src: b.video, poster: b.poster, muted: true, autoplay: true, loop: true, playsinline: true, preload: 'metadata', 'aria-hidden': 'true', tabindex: '-1', disablepictureinpicture: true })
    : b.poster ? h('img', { class: 'bubble__face', src: b.poster, alt: '' }) : null;
  if (face && face.tagName === 'VIDEO') face.muted = true;

  const open = h(
    'button',
    { type: 'button', class: 'bubble__open', 'aria-haspopup': 'dialog', 'aria-label': `${video.buttonLabel || `Watch ${video.title}`}${video.minutes ? `, ${video.minutes} minutes` : ''}`, onclick: (e) => openVideo(video, e.currentTarget) },
    h('span', { class: 'bubble__circle' }, face, h('span', { class: 'bubble__play', 'aria-hidden': 'true' }, icons.play())),
    h('span', { class: 'bubble__label', 'aria-hidden': 'true' },
      h('span', { class: 'bubble__title' }, b.label || video.title),
      video.minutes ? h('span', { class: 'bubble__time' }, `${video.minutes} min`) : null)
  );
  const dismiss = h('button', { type: 'button', class: 'bubble__dismiss', 'aria-label': 'Hide the walk-through bubble', onclick: () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 400);
  } }, icons.close());

  const el = h('div', { class: 'bubble', role: 'complementary', 'aria-label': 'Video walk-through' }, open, dismiss);

  // Visibility: after the hero, but not while the Send button is on screen.
  let pastHero = false;
  let overSubmit = false;
  const sync = () => el.classList.toggle('is-visible', pastHero && !overSubmit);
  const onScroll = () => {
    const hero = document.getElementById('intro');
    const limit = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.6 : window.innerHeight;
    const next = window.scrollY > limit;
    if (next !== pastHero) { pastHero = next; sync(); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(() => {
    onScroll();
    const submit = document.querySelector('.submit');
    if (submit && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { overSubmit = e.isIntersecting; sync(); }).observe(submit);
    }
  });
  return el;
}
