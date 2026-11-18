/**
 * ZENWOOD LAUNCH PLANNER — PRICING
 * ------------------------------------------------------------
 * Source: "Zenwood Launch Campaign Quote" (Nov 17, 2026), with Ben's
 * updates on Nov 17: Cabin Photography $1,675 (one interior + 10 exteriors; now $1,275),
 * Website Photography $850, Strategy $1,550 (now $1,750, Nov 18), Content Creation $6,150,
 * and no scouting for Homepage Header Video or Website Photography.
 * Later: Brand Kit free, Cabin Marketing Video $845, bundle discounts 5% / 8% / 12%,
 * Launch Production and Content Creation all-in $10,963–$15,488 (includes its shoot days and travel;
 * the top of the range covers possible 4th–5th non-model shoot days — the 5th
 * is a $2,200 buffer day added Nov 18).
 *
 * All amounts are in CENTS to avoid rounding drift (e.g. 101250 = $1,012.50).
 * The calculation itself lives in js/lib/pricing.js.
 */

/**
 * Service prices (standalone deliverable prices — no shoot time).
 *   flat      amount
 *   perUnit   amount × count, where count comes from state[countKey]
 *   range     low–high. With `allIn`, the price already includes the service's shoot
 *             days and travel, so those production blocks show as "Included".
 *   regular   optional original price, shown struck through when discounted (e.g. a free Brand Kit)
 * `production` is the plain-language requirement shown in the detail panel.
 */
export const SERVICE_PRICING = {
  // Discounted to free: shown as $700 struck through, adds $0 to the quote.
  'brand-kit': { type: 'flat', amount: 0, regular: 70000, label: 'Free', regularLabel: '$700', production: null },
  'influencer-brief': { type: 'flat', amount: 42500, label: '$425', production: null },

  'homepage-video': { type: 'flat', amount: 65000, label: '$650', production: '1 model shoot day (model fees not included)' },
  'supporting-videos': {
    type: 'perUnit', amount: 42500, countKey: 'supportingVideoCount', unit: 'video', units: 'videos',
    label: '$425 per video', production: null,
  },
  'website-photography': { type: 'flat', amount: 85000, label: '$850', production: '1 model shoot day (model fees not included)' },

  // One cabin interior + exteriors of all 10 cabins, as one flat price ($1,275 since Nov 18). All or nothing.
  'cabin-photography': { type: 'flat', amount: 127500, label: '$1,275', production: 'Cabin shoot day' },
  'cabin-video': { type: 'flat', amount: 84500, label: '$845', production: 'Cabin shoot day' },

  'social-strategy': {
    type: 'flat', amount: 175000, label: '$1,750',
    production: 'Includes Launch Production and Content Creation and its production',
  },
  'social-content': {
    type: 'range', low: 1096300, high: 1548800, allIn: true, label: '$10,963–$15,488',
    production:
      'Pre-launch shoot + full scouting day + 2 model shoot days + cabin shoot day, plus possible 4th–5th shooting days (non-model). All included in this price, with travel. Model fees are not included.',
  },
  'influencer-management': {
    type: 'perUnit', amount: 45000, countKey: 'creatorCount', unit: 'creator', units: 'creators',
    label: '$450 per creator', production: null,
  },
};

/** Service that is added automatically (and locked) when another is selected. */
export const INCLUDES = {
  'social-strategy': ['social-content'],
};

/** Production blocks — shown in Your Plan, can't be removed. */
export const PRODUCTION = {
  heading: 'Production (required for your selections)',
  blocks: {
    scouting: {
      label: 'Scouting day',
      description: 'Full day on site with a 2-person crew, planning light, twilight, and the model shoot',
      full: 90000,
    },
    model: {
      label: 'Model shoot day',
      description: 'Directed shoot with a model, 2-person crew, sunrise through twilight. Model fees not included',
      perDay: 220000,
    },
    prelaunch: {
      label: 'Pre-launch shoot',
      description: 'Morning shoot (~4.5 hrs) with a 2-person crew for launch content',
      amount: 101250,
    },
    third: {
      label: 'Possible 4th–5th shoot days (non-model)',
      description: 'Added only if needed, without a model. Covered by the top of the Launch Production and Content Creation range',
    },
    cabin: {
      label: 'Cabin shoot day',
      description: 'Early-morning interiors and exteriors of the cabins',
      amount: 180000,
    },
  },
};

/** Each production trip (one carpool, 76¢/mile round trip). Never discounted. */
export const TRAVEL_PER_TRIP = 12500;

/** Single highest tier reached by the subtotal (services + production, no travel). */
// Bundle discount removed Nov 18. To bring it back, list tiers here, e.g.
//   { min: 2000000, rate: 0.12 }, // $20,000 or more
//   { min: 1000000, rate: 0.08 }, // $10,000 or more
//   { min: 500000, rate: 0.05 },  // $5,000 or more
export const DISCOUNT_TIERS = [];

/** Shown directly under the total — this is a quote, finalized after a scope call. */
export const QUOTE_NOTE =
  'This is a quote, not a final invoice. We’ll schedule a scope call to talk through the full scope of your launch, and the quote can be adjusted at that point.';

/** Shown with the total in Your Plan. */
export const CLIENT_NOTES = [
  'Production covers the shoot days your selections need. It’s included automatically and charged once, even when several services share the same shoot.',
  'Model fees are not included in this quote. They’re billed separately, at cost, along with creators’ own fees.',
  'If scouting shows a third model shoot day is needed, it’s added at $2,200 plus $125 travel.',
  'The first shoot ($1,675) is quoted separately and isn’t part of this plan.',
];
