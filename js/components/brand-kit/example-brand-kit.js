/**
 * EXAMPLE BRAND KIT — PLACEHOLDER CONTENT
 * ------------------------------------------------------------
 * Illustrates the *format* of a Blinkslow Brand Kit only.
 * These values are NOT Zenwood's approved brand identity.
 *
 * To replace:
 *   • Quick swap: set BRAND_KIT_PREVIEW.src in js/config.js to a PDF or
 *     image of the real example — the modal will show that instead.
 *   • Or edit the sections below; BrandKitPreview.js renders whatever is here.
 */
export const EXAMPLE_BRAND_KIT = {
  isPlaceholder: true,
  disclaimer:
    'Placeholder preview — this illustrates the structure of a Brand Kit only. It is not Zenwood’s approved brand identity. A finished example will be added here.',
  title: 'Example Brand Kit',
  subtitle: 'A sample of how a Blinkslow Brand Kit is organized.',
  sections: [
    {
      type: 'colors',
      title: 'Color Palette',
      caption: 'Primary, secondary, and accent colors with usage notes.',
      items: [
        { name: 'Primary', hex: '#2F3A2C', usage: 'Backgrounds, headlines' },
        { name: 'Secondary', hex: '#D9CFBF', usage: 'Surfaces, negative space' },
        { name: 'Accent', hex: '#A3946F', usage: 'Details, highlights' },
        { name: 'Neutral', hex: '#3A3632', usage: 'Body copy' },
      ],
    },
    {
      type: 'typography',
      title: 'Typography',
      caption: 'Typefaces, hierarchy, and how each is used.',
      items: [
        { role: 'Display', family: 'Serif display face', sample: 'Quiet, unhurried, intentional.', style: 'serif' },
        { role: 'Body', family: 'Clean sans-serif', sample: 'Clear, warm, and easy to read across every touchpoint.', style: 'sans' },
      ],
    },
    {
      type: 'traits',
      title: 'Brand Personality',
      caption: 'How the brand should feel — and what it should never feel like.',
      items: [
        { trait: 'Calm', not: 'not sleepy' },
        { trait: 'Refined', not: 'not formal' },
        { trait: 'Warm', not: 'not casual' },
        { trait: 'Grounded', not: 'not rustic' },
      ],
    },
    {
      type: 'moodboard',
      title: 'Photography Direction',
      caption: 'Light, composition, subject matter, and editing style.',
      items: [
        { label: 'Natural, low-angle light', tone: 'dawn' },
        { label: 'Texture & material details', tone: 'wood' },
        { label: 'Wide, quiet landscapes', tone: 'forest' },
        { label: 'People in moments, not poses', tone: 'ember' },
      ],
    },
    {
      type: 'list',
      title: 'Video Direction',
      caption: 'Pacing, movement, sound, and finishing.',
      items: [
        { k: 'Pacing', v: 'Slow, lingering shots; let scenes breathe.' },
        { k: 'Movement', v: 'Steady gimbal and locked-off frames; no fast cuts.' },
        { k: 'Sound', v: 'Natural ambience first, music second.' },
        { k: 'Color', v: 'Soft contrast, warm shadows, true greens.' },
      ],
    },
  ],
};
