/**
 * ZENWOOD MEDIA
 * ------------------------------------------------------------
 * Logos, the aerial video and its poster were copied from
 * zenwoodhockinghills.com into ./assets/ (same sub-paths as their site),
 * so the planner doesn't depend on their live site. Add new photography
 * to ./assets/ and reference it here.
 *
 * Every image/video has a graceful fallback: if a file fails to load,
 * logos fall back to a text wordmark and imagery to a dark gradient.
 */
const BASE = 'assets';

export const MEDIA = {
  logoLockup: { src: `${BASE}/images/brand/zenwood-lockup-stacked-cream.png`, alt: 'Zenwood — Hocking Hills' },
  logoMonogram: { src: `${BASE}/images/brand/zenwood-monogram-cream-tight.png`, alt: 'Zenwood' },

  hero: {
    // Short aerial clip. Its playback position follows the scroll, like Zenwood's homepage.
    video: `${BASE}/videos/hero-aerial.mp4`,
    poster: `${BASE}/videos/hero-poster.jpg`,
    alt: 'Aerial view of the Zenwood cabin community among the pines, Hocking Hills',
  },

  /**
   * Parallax interludes between stages. `still` takes a single frame
   * from the hero video at `time` (seconds); `image` uses a photo URL.
   * Add new photography here as it becomes available.
   */
  interludes: {
    beforeFoundation: { still: { video: `${BASE}/videos/hero-aerial.mp4`, time: 1.2 }, poster: `${BASE}/videos/hero-poster.jpg` },
    beforePostLaunch: { still: { video: `${BASE}/videos/hero-aerial.mp4`, time: 5.4 }, poster: `${BASE}/videos/hero-poster.jpg` },
  },
};
