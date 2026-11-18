/**
 * Pricing tests — based on the quote spec's test cases, recalculated for
 * Ben's updates (Nov 17–18): Brand Kit free, Cabin Photography $1,275,
 * Website Photography $850, Cabin Marketing Video $845, Strategy $1,750,
 * Launch Content Creation all-in $10,963–$15,488 covering its shoot days and
 * travel, no scouting for Homepage Header Video or Website Photography,
 * no bundle discount, Influencer Partnership Management $450 per creator,
 * and Supporting Website Videos $425 each.
 * Run in a browser console on the local preview:
 *   (await import('/tests/pricing.test.js')).run()
 * Not deployed (see .vercelignore).
 */
import { computeQuote } from '../js/lib/pricing.js';

const base = { selected: [], supportingVideoCount: 1, creatorCount: 1 };
const dollars = (c) => Math.round(c) / 100;

const CASES = [
  {
    name: 'Everything priced (no supporting videos, no creators)',
    state: {
      ...base,
      selected: ['brand-kit', 'influencer-brief', 'homepage-video', 'website-photography', 'cabin-photography', 'cabin-video', 'social-strategy', 'social-content'],
    },
    // Content Creation all-in covers every shoot day + travel.
    // Low: 0+425+650+850+1275+845+1750+10,963 = $16,758. High: +4,525 = $21,283
    expect: { services: 16758, production: 0, discount: 0, travel: 0, total: 16758, totalHigh: 21283 },
  },
  {
    name: 'Brand Kit alone is free',
    state: { ...base, selected: ['brand-kit'] },
    expect: { services: 0, production: 0, discount: 0, travel: 0, total: 0 },
  },
  {
    name: 'Website Photography only (1 model day, no scouting)',
    state: { ...base, selected: ['website-photography'] },
    expect: { services: 850, production: 2200, discount: 0, travel: 125, total: 3175 },
  },
  {
    name: 'Homepage Header Video only (1 model day, no scouting)',
    state: { ...base, selected: ['homepage-video'] },
    expect: { services: 650, production: 2200, discount: 0, travel: 125, total: 2975 },
  },
  {
    name: 'Homepage Video + Website Photography → 2 model days, no scouting',
    state: { ...base, selected: ['homepage-video', 'website-photography'] },
    // 1,500 + 4,400 + 2 trips (250) = $6,150
    expect: { services: 1500, production: 4400, discount: 0, travel: 250, total: 6150 },
  },
  {
    name: 'Cabin Photography + Cabin Marketing Video',
    state: { ...base, selected: ['cabin-photography', 'cabin-video'] },
    expect: { services: 2120, production: 1800, discount: 0, travel: 125, total: 4045 },
  },
  {
    name: 'Influencer Partnership Management, 5 creators',
    state: { ...base, creatorCount: 5, selected: ['influencer-management'] },
    expect: { services: 2250, production: 0, discount: 0, travel: 0, total: 2250 },
  },
  {
    name: 'Strategy alone auto-adds Content Creation (all-in range)',
    state: { ...base, selected: ['social-strategy'] },
    // 1,750 + 10,963 = $12,713. High: 1,750 + 15,488 = $17,238
    expect: { services: 12713, production: 0, discount: 0, travel: 0, total: 12713, totalHigh: 17238 },
  },
  {
    name: 'Content Creation alone (all-in range)',
    state: { ...base, selected: ['social-content'] },
    expect: { services: 10963, production: 0, discount: 0, travel: 0, total: 10963, totalHigh: 15488 },
  },
  {
    name: 'Content Creation covers Homepage Video shoot days (no double charge)',
    state: { ...base, selected: ['social-content', 'homepage-video'] },
    expect: { services: 11613, production: 0, discount: 0, travel: 0, total: 11613, totalHigh: 16138 },
  },
  {
    name: 'Full plan with 3 supporting videos and 1 creator',
    state: {
      ...base, supportingVideoCount: 3, creatorCount: 1,
      selected: ['brand-kit', 'influencer-brief', 'homepage-video', 'supporting-videos', 'website-photography', 'cabin-photography', 'cabin-video', 'social-strategy', 'social-content', 'influencer-management'],
    },
    // 16,758 + 1,275 + 450 = $18,483. High: $23,008
    expect: { services: 18483, production: 0, discount: 0, travel: 0, total: 18483, totalHigh: 23008 },
  },
  {
    name: 'Supporting videos ×3 need no production',
    state: { ...base, supportingVideoCount: 3, selected: ['supporting-videos'] },
    expect: { services: 1275, production: 0, discount: 0, travel: 0, total: 1275 },
  },
];

export function run() {
  const results = CASES.map(({ name, state, expect }) => {
    const q = computeQuote(state);
    const got = {
      services: dollars(q.servicesTotal), production: dollars(q.productionTotal),
      discount: q.discount / 100, travel: dollars(q.travel), total: dollars(q.total),
      totalHigh: dollars(q.totalHigh),
    };
    const fails = Object.keys(expect).filter((k) => !(Math.abs((got[k] ?? NaN) - expect[k]) < 0.001));
    const total = got.totalHigh !== got.total ? `${got.total}–${got.totalHigh}` : got.total;
    return { name, pass: fails.length === 0, ...(fails.length ? { expect, got } : { total }) };
  });
  const passed = results.filter((r) => r.pass).length;
  return { passed, of: results.length, results };
}
