/**
 * Turns raw selection state into a readable, priced plan — used by the
 * on-page summary, the submission payload, and the copy/email text, so
 * all three always agree. Prices come from js/lib/pricing.js.
 */
import { CATEGORIES, POST_LAUNCH, INFLUENCER_SUPPORT, findService } from '../content/services.js';
import { computeQuote, formatMoney, formatRange } from './pricing.js';
import { QUOTE_NOTE } from '../content/pricing.js';

function serviceDetail(item, state) {
  const parts = [];
  if (item.qty) parts.push(item.qty);
  if (item.id === 'influencer-management' && state.influencerType) {
    const t = INFLUENCER_SUPPORT.options.find((o) => o.value === state.influencerType)?.summary;
    if (t) parts.push(t);
  }
  if (item.includedBy) parts.push(`Included with ${findService(item.includedBy)?.name}`);
  return parts.join(' · ');
}

export function buildPlan(state) {
  const quote = computeQuote(state);
  const sectionNotes = state.sectionNotes || {};
  const noteFor = (key) => (sectionNotes[key] || '').trim();

  // A section appears if it has selected services or a note.
  const groups = CATEGORIES.map((c) => ({
    categoryId: c.id,
    title: c.title,
    items: quote.services
      .filter((s) => s.categoryId === c.id)
      .map((s) => ({ id: s.id, name: s.name, amount: s.amount, amountHigh: s.amountHigh, regular: s.regular, detail: serviceDetail(s, state) })),
    note: noteFor(c.id),
  })).filter((g) => g.items.length || g.note);

  const post = POST_LAUNCH.options.find((o) => o.value === state.postLaunch);

  return {
    groups,
    quote,
    serviceCount: quote.services.length,
    postLaunch: post ? { value: post.value, label: post.summary } : null,
    postLaunchNote: noteFor(POST_LAUNCH.id),
    influencerType: state.influencerType,
    launchDate: (state.launchDate || '').trim(),
    notes: (state.notes || '').trim(),
  };
}

export const planHasContent = (plan) =>
  plan.serviceCount > 0 || !!plan.postLaunch || !!plan.notes || !!plan.postLaunchNote || plan.groups.some((g) => g.note);

const pct = (rate) => `${Math.round(rate * 100)}%`;
const priceText = (i) => (i.regular && i.amount === 0 ? `Free (regularly ${formatMoney(i.regular)})` : formatRange(i.amount, i.amountHigh));

export function planToText(plan) {
  const q = plan.quote;
  const lines = ['ZENWOOD LAUNCH PLAN', ''];
  if (!plan.serviceCount) lines.push('No launch services selected yet.', '');
  for (const g of plan.groups) {
    lines.push(g.title.toUpperCase());
    for (const i of g.items) lines.push(`• ${i.name}${i.detail ? ` — ${i.detail}` : ''}: ${priceText(i)}`);
    if (g.note) lines.push(`Note: ${g.note}`);
    lines.push('');
  }
  if (q.production.length) {
    lines.push('PRODUCTION (REQUIRED FOR SELECTIONS)');
    if (q.productionIncludedBy) lines.push('(All shoot days and their travel are included in the Launch Production and Content Creation price.)');
    for (const p of q.production) lines.push(`• ${p.label}${p.included ? (p.possible ? ', if needed' : '') : `: ${formatMoney(p.amount)}`}`);
    lines.push('');
  }
  if (!q.isEmpty) {
    lines.push('QUOTE');
    lines.push(`Services: ${formatRange(q.servicesTotal, q.servicesTotalHigh)}`);
    if (q.productionTotal) lines.push(`Production: ${formatMoney(q.productionTotal)}`);
    else if (q.productionIncludedBy) lines.push('Production: Included');
    if (q.discount || q.discountHigh) lines.push(`Subtotal: ${formatRange(q.subtotal, q.subtotalHigh)}`);
    if (q.discount || q.discountHigh) {
      lines.push(`Bundle discount (${pct(q.discountRate)}): −${formatRange(q.discount, q.discountHigh)}`);
    }
    if (q.travel) lines.push(`Travel (${q.trips} trip${q.trips === 1 ? '' : 's'}): ${formatMoney(q.travel)}`);
    lines.push(`Quote: ${formatRange(q.total, q.totalHigh, { round: true })}`);
    if (q.isRange) lines.push('The higher figure includes possible 4th–5th shoot days (non-model) for Launch Production and Content Creation.');
    lines.push(QUOTE_NOTE);
    lines.push('Model fees are not included in this quote. They’re billed separately, at cost, along with creators’ own fees.', '');
  }
  if (plan.postLaunch || plan.postLaunchNote) {
    lines.push('POST-LAUNCH SUPPORT');
    if (plan.postLaunch) lines.push(`• ${plan.postLaunch.label}`);
    if (plan.postLaunchNote) lines.push(`Note: ${plan.postLaunchNote}`);
    lines.push('');
  }
  if (plan.launchDate) lines.push('TARGET LAUNCH DATE', plan.launchDate, '');
  if (plan.notes) lines.push('NOTES', plan.notes, '');
  return lines.join('\n').trim();
}

const usd = (cents) => Math.round(cents) / 100;

export function planToPayload(plan) {
  const q = plan.quote;
  return {
    summary: planToText(plan),
    total: q.isEmpty ? null : formatRange(q.total, q.totalHigh, { round: true }),
    source: 'zenwood-launch-planner',
    submittedAt: new Date().toISOString(),
    services: plan.groups.flatMap((g) =>
      g.items.map((i) => ({ category: g.title, id: i.id, service: i.name, detail: i.detail || null, price: usd(i.amount), ...(i.amountHigh !== i.amount ? { priceHigh: usd(i.amountHigh) } : {}), ...(i.regular ? { regularPrice: usd(i.regular) } : {}) }))
    ),
    production: q.production.map((p) => ({ block: p.label, price: p.included ? 'included' : usd(p.amount), trips: p.trips })),
    pricing: {
      services: usd(q.servicesTotal),
      production: usd(q.productionTotal),
      subtotal: usd(q.subtotal),
      discountRate: q.discountRate,
      discount: usd(q.discount),
      travelTrips: q.trips,
      travel: usd(q.travel),
      total: Math.round(q.total / 100),
      ...(q.isRange ? {
        servicesHigh: usd(q.servicesTotalHigh),
        subtotalHigh: usd(q.subtotalHigh),
        discountHigh: usd(q.discountHigh),
        totalHigh: Math.round(q.totalHigh / 100),
      } : {}),
    },
    influencerSupport: plan.influencerType,
    postLaunchSupport: plan.postLaunch?.label ?? null,
    sectionNotes: Object.fromEntries([
      ...plan.groups.filter((g) => g.note).map((g) => [g.title, g.note]),
      ...(plan.postLaunchNote ? [[POST_LAUNCH.title, plan.postLaunchNote]] : []),
    ]),
    targetLaunchDate: plan.launchDate || null,
    notes: plan.notes || null,
  };
}
