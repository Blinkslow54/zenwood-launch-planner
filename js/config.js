/**
 * ZENWOOD LAUNCH PLANNER — CONFIGURATION
 * ------------------------------------------------------------
 * Submissions go to Blinkslow MKTG's Formspree form (see `endpoint`).
 *
 * SUBMISSION
 *   endpoint        URL that accepts a POST of the plan (JSON).
 *                   Works with Formspree, Basin, Getform, a Zapier/Make
 *                   webhook, a Netlify/Vercel function, or your own API.
 *                   Leave '' to disable online sending.
 *   headers         Extra request headers (e.g. an API key your endpoint expects).
 *   recipientEmail  Used ONLY for the "Open Email Draft" fallback (mailto:).
 *                   Leave '' to hide that option.
 *
 *   extraFields     Added to the top of every submission. `_subject` sets the
 *                   subject line of Formspree's notification email.
 *
 * If neither is set, the "Send" button offers a "Copy My Plan" fallback,
 * and never shows a success message.
 *
 * FORMSPREE SETUP: create a form at formspree.io and paste its address,
 * e.g. 'https://formspree.io/f/abcd1234', into `endpoint` below.
 */
export const SUBMISSION = {
  endpoint: 'https://formspree.io/f/mpppnbvk', // Formspree form (Blinkslow MKTG)
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
  extraFields: {
    _subject: 'Zenwood Launch Plan — new selections',
  },
  recipientEmail: '',
  emailSubject: 'Zenwood Launch Plan — Selections',
  timeoutMs: 15000,
};

/**
 * BRAND KIT PREVIEW
 *   pages  Images of each page, shown as a scrolling gallery (works on every
 *          device; phones can't reliably display an embedded PDF).
 *          To replace the example: export each page of the new PDF as an
 *          image into assets/brand-kit/, and list them here with a title.
 *   pdf    The original file, offered as "Open PDF".
 *   src    Alternative to `pages`: a single image (or PDF) to show instead.
 *   Leave `pages` empty and `src` '' to show the built-in placeholder from
 *   js/components/brand-kit/example-brand-kit.js
 */
const KIT_DIR = 'assets/brand-kit/social-brand-guide';
const KIT_PAGE_SIZE = { width: 1600, height: 900 }; // widescreen (16:9) pages
const KIT_PAGE_TITLES = [
  'Cover',
  'Typography',
  'Color Palette',
  'Brand Foundation',
  'Photography Direction',
  'Color Grade Direction',
  'The Funnel',
  'Content Pillars',
  'Target Audiences',
  'Measuring Success',
];

export const BRAND_KIT_PREVIEW = {
  pages: KIT_PAGE_TITLES.map((title, i) => ({
    src: `${KIT_DIR}/page-${String(i + 1).padStart(2, '0')}.jpg`,
    title,
    ...KIT_PAGE_SIZE,
  })),
  pdf: 'assets/brand-kit/zenwood-social-brand-guide.pdf',
  src: '',
  title: 'Example Brand Kit',
  subtitle: 'Social Brand Guide — an example of what a Zenwood Brand Kit could include.',
  note: 'Example concept for discussion. Your final Brand Kit is developed together and builds on Zenwood’s existing identity.',
};

export const STORAGE_KEY = 'zenwood-launch-plan:v1';
