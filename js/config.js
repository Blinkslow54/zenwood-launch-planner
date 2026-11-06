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
 *   src   When the real example Brand Kit is ready, set this to a PDF or
 *         image path/URL (e.g. 'assets/example-brand-kit.pdf'). The modal
 *         will display it instead of the built-in placeholder.
 *         Leave '' to show the placeholder from
 *         js/components/brand-kit/example-brand-kit.js
 */
export const BRAND_KIT_PREVIEW = {
  src: 'assets/brand-kit/zenwood-brand-kit-concept-01.webp',
  title: 'Example Brand Kit',
  subtitle: 'Concept 01 — an example of what a Zenwood Brand Kit could include.',
  alt:
    'Zenwood Brand Kit, Concept 01: brand story, positioning and pillars (Escape, Presence, Nature, Refinement), ' +
    'color palette and typography, photography and video direction, brand voice, and social direction with sample imagery.',
  note: 'Example concept for illustration. Your final Brand Kit is developed together and builds on Zenwood’s existing identity.',
};

export const STORAGE_KEY = 'zenwood-launch-plan:v1';
