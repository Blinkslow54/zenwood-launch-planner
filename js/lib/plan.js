/**
 * Turns raw selection state into a readable plan — used by the summary,
 * the submission payload, the copy-to-clipboard text, and the email draft.
 */
import { CATEGORIES, POST_LAUNCH, INFLUENCER_SUPPORT } from '../content/services.js';

function cabinDetail(state) {
  if (state.cabinCount) return `${state.cabinCount} cabin${state.cabinCount === 1 ? '' : 's'}`;
  if (state.cabinNotSure) return 'Number of cabins not sure yet';
  return '';
}

function serviceDetail(service, state) {
  if (service.perCabin) return cabinDetail(state);
  if (service.followUp === 'influencerType' && state.influencerType) {
    return INFLUENCER_SUPPORT.options.find((o) => o.value === state.influencerType)?.summary || '';
  }
  return '';
}

export function buildPlan(state) {
  const sectionNotes = state.sectionNotes || {};
  const noteFor = (key) => (sectionNotes[key] || '').trim();

  // A section appears if it has selected services or a note.
  const groups = CATEGORIES.map((c) => ({
    categoryId: c.id,
    title: c.title,
    items: c.services
      .filter((s) => state.selected.includes(s.id))
      .map((s) => ({ id: s.id, name: s.name, detail: serviceDetail(s, state) })),
    note: noteFor(c.id),
  })).filter((g) => g.items.length || g.note);

  const post = POST_LAUNCH.options.find((o) => o.value === state.postLaunch);
  const postNote = noteFor(POST_LAUNCH.id);

  return {
    groups,
    serviceCount: groups.reduce((n, g) => n + g.items.length, 0),
    postLaunch: post ? { value: post.value, label: post.summary } : null,
    postLaunchNote: postNote,
    cabins: { count: state.cabinCount, notSure: state.cabinNotSure },
    influencerType: state.influencerType,
    launchDate: state.launchDate.trim(),
    notes: state.notes.trim(),
  };
}

export const planHasContent = (plan) =>
  plan.serviceCount > 0 || !!plan.postLaunch || !!plan.notes || !!plan.postLaunchNote || plan.groups.some((g) => g.note);

export function planToText(plan) {
  const lines = ['ZENWOOD LAUNCH PLAN', ''];
  if (!plan.serviceCount) lines.push('No launch services selected yet.', '');
  for (const g of plan.groups) {
    lines.push(g.title.toUpperCase());
    for (const i of g.items) lines.push(`• ${i.name}${i.detail ? ` — ${i.detail}` : ''}`);
    if (g.note) lines.push(`Note: ${g.note}`);
    lines.push('');
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

export function planToPayload(plan) {
  return {
    summary: planToText(plan),
    source: 'zenwood-launch-planner',
    submittedAt: new Date().toISOString(),
    services: plan.groups.flatMap((g) =>
      g.items.map((i) => ({ category: g.title, id: i.id, service: i.name, detail: i.detail || null }))
    ),
    cabinCount: plan.cabins.count ?? (plan.cabins.notSure ? 'not sure yet' : null),
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
