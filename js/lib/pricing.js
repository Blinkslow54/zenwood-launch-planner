/**
 * Calculates the Your Plan quote from selection state, following the
 * "Calculating the total" steps in the pricing spec:
 *   1. selected services (Launch Strategy auto-includes Content Creation)
 *   2. + required production blocks (combined, each charged once)
 *   3. − bundle discount on that subtotal (travel never discounted)
 *   4. + travel ($125 per production trip)
 *   5. round to the nearest dollar
 * Amounts are cents. Pure function — no DOM, easy to test.
 */
import { CATEGORIES } from '../content/services.js';
import {
  SERVICE_PRICING, INCLUDES, PRODUCTION, TRAVEL_PER_TRIP, DISCOUNT_TIERS,
} from '../content/pricing.js';

const ORDER = CATEGORIES.flatMap((c) => c.services.map((s) => ({ ...s, categoryId: c.id, categoryTitle: c.title })));

/** Selected services plus anything they automatically include. */
export function effectiveSelection(state) {
  const set = new Set(state.selected || []);
  for (const id of [...set]) (INCLUDES[id] || []).forEach((dep) => set.add(dep));
  return set;
}

/** Which selected service (if any) includes this one — e.g. Strategy includes Content Creation. */
export function includedBy(state, id) {
  return (state.selected || []).find((s) => (INCLUDES[s] || []).includes(id)) || null;
}

const countFor = (state, key) => Math.max(1, parseInt(state[key], 10) || 1);

function priceService(service, state) {
  const p = SERVICE_PRICING[service.id];
  if (!p) return null;
  if (p.type === 'flat') return { amount: p.amount, high: p.amount, qty: null, regular: p.regular ?? null };
  if (p.type === 'range') return { amount: p.low, high: p.high, qty: null, allIn: !!p.allIn };
  if (p.type === 'perUnit') {
    const n = countFor(state, p.countKey);
    return { amount: p.amount * n, high: p.amount * n, qty: `${n} ${n === 1 ? p.unit : p.units}` };
  }
  return null;
}

const tierFor = (subtotal) => (DISCOUNT_TIERS.find((t) => subtotal >= t.min) || { rate: 0 }).rate;

/** Discount, travel and rounding for one end of the range. */
function finish(servicesTotal, productionTotal, travel, rate) {
  const subtotal = servicesTotal + productionTotal;
  const discountRate = rate ?? tierFor(subtotal);
  const discount = subtotal * discountRate; // may carry half-cents; rounded only at the end
  const total = Math.round((subtotal - discount + travel) / 100) * 100;
  return { subtotal, discountRate, discount, total };
}

export function computeQuote(state) {
  const sel = effectiveSelection(state);

  // 1. Services (a range-priced service contributes its low and high ends)
  const services = ORDER.filter((s) => sel.has(s.id)).map((s) => {
    const priced = priceService(s, state) || { amount: 0, high: 0, qty: null };
    return {
      id: s.id, name: s.name, categoryId: s.categoryId, categoryTitle: s.categoryTitle,
      amount: priced.amount, amountHigh: priced.high ?? priced.amount,
      qty: priced.qty, regular: priced.regular ?? null, allIn: !!priced.allIn,
      includedBy: includedBy(state, s.id), // e.g. Content Creation shows "Included with Launch Strategy & Management"
    };
  });
  const servicesTotal = services.reduce((n, s) => n + s.amount, 0);
  const servicesTotalHigh = services.reduce((n, s) => n + s.amountHigh, 0);

  // 2. Production — requirements don't stack; each block at the highest level needed.
  //    Scouting (full day) is only needed for Launch Content Creation.
  //    Model days: 2 with Content Creation or with both Homepage Video and
  //    Website Photography; 1 if only one of those two is selected.
  //    Launch Content Creation's all-in price already covers every block it needs
  //    (a superset of what any other service needs), plus their travel — so while
  //    it's selected, production shows as "Included" and isn't charged again.
  const B = PRODUCTION.blocks;
  const lcc = sel.has('social-content');
  const coveredBy = lcc && SERVICE_PRICING['social-content']?.allIn ? 'social-content' : null;
  const hv = sel.has('homepage-video');
  const wp = sel.has('website-photography');
  const modelDays = lcc || (hv && wp) ? 2 : hv || wp ? 1 : 0;
  const cabinDay = sel.has('cabin-photography') || sel.has('cabin-video') || lcc;

  const production = [];
  const add = (block) => production.push(coveredBy ? { ...block, amount: 0, trips: 0, included: true } : { ...block, included: false });
  // Listed in this order in Your Plan and the email.
  if (lcc) add({ id: 'prelaunch', label: B.prelaunch.label, description: B.prelaunch.description, amount: B.prelaunch.amount, trips: 1 });
  if (lcc) add({ id: 'scouting', label: B.scouting.label, description: B.scouting.description, amount: B.scouting.full, trips: 1 });
  if (modelDays) add({ id: 'model', label: modelDays > 1 ? `${B.model.label}s × ${modelDays}` : B.model.label, description: B.model.description, amount: B.model.perDay * modelDays, trips: modelDays });
  if (cabinDay) add({ id: 'cabin', label: B.cabin.label, description: B.cabin.description, amount: B.cabin.amount, trips: 1 });
  if (coveredBy) production.push({ id: 'third', label: B.third.label, description: B.third.description, amount: 0, trips: 0, included: true, possible: true });
  const productionTotal = production.reduce((n, p) => n + p.amount, 0);

  // 4. Travel ($125 per charged trip; trips inside an all-in price aren't charged again)
  const trips = production.reduce((n, p) => n + p.trips, 0);
  const travel = trips * TRAVEL_PER_TRIP;

  // 3 + 5. Discount and rounding, for both ends of the range. One discount rate
  //        applies to both ends, set by the low (guaranteed) figure, so a range
  //        never shows two different percentages.
  const low = finish(servicesTotal, productionTotal, travel);
  const high = finish(servicesTotalHigh, productionTotal, travel, low.discountRate);

  return {
    services, servicesTotal, servicesTotalHigh,
    production, productionTotal, productionIncludedBy: coveredBy,
    subtotal: low.subtotal, subtotalHigh: high.subtotal,
    discountRate: low.discountRate,
    discount: low.discount, discountHigh: high.discount,
    trips, travel,
    total: low.total, totalHigh: high.total,
    isRange: high.total !== low.total,
    isEmpty: services.length === 0,
  };
}

/** $1,012.50 / $700 — cents shown only when present. */
export function formatMoney(cents, { round = false } = {}) {
  const dollars = round ? Math.round(cents / 100) : Math.round(cents) / 100;
  const whole = Number.isInteger(dollars);
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2,
  }).format(dollars);
}

/** "$10,963–$15,488", or a single amount when both ends match. */
export function formatRange(low, high, opts) {
  return high != null && Math.round(high) !== Math.round(low) ? `${formatMoney(low, opts)}–${formatMoney(high, opts)}` : formatMoney(low, opts);
}
