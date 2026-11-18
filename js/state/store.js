/**
 * Selection state — the single source of truth for what the owner chose.
 * Persisted to localStorage so progress survives refreshes.
 * Presentation components subscribe; they never own selection data.
 */
import { STORAGE_KEY } from '../config.js';
import { INCLUDES } from '../content/pricing.js';

const defaults = () => ({
  selected: [], // service ids, in the order they were added
  supportingVideoCount: 1, // Supporting Website Videos, priced per video
  creatorCount: 1, // Influencer Partnership Management, priced per creator
  autoAdded: [], // services added automatically (e.g. Content Creation via Strategy)
  influencerType: null, // 'new' | 'existing' | 'both' | 'unsure' | null
  postLaunch: null, // 'yes' | 'possibly' | 'no' | null
  notes: '',
  sectionNotes: {}, // { [categoryId | 'post-launch']: string }
  launchDate: '',
  lastSubmittedAt: null, // ISO string, only set after a confirmed successful submission
});

let state = defaults();
let validIds = null;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    const next = { ...defaults(), ...parsed };
    if (!Array.isArray(next.selected)) next.selected = [];
    if (!Array.isArray(next.autoAdded)) next.autoAdded = [];
    if (!next.sectionNotes || typeof next.sectionNotes !== 'object') next.sectionNotes = {};
    if (validIds) next.selected = next.selected.filter((id) => validIds.has(id));
    // Plans saved before auto-add existed: make sure included services are present.
    for (const id of [...next.selected]) {
      for (const dep of INCLUDES[id] || []) {
        if (!next.selected.includes(dep)) {
          next.selected.push(dep);
          next.autoAdded.push(dep);
        }
      }
    }
    return next;
  } catch {
    return defaults();
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode, blocked) — the page still works */
  }
}

function emit(meta) {
  listeners.forEach((fn) => fn(state, meta));
}

export const store = {
  init(ids) {
    validIds = new Set(ids);
    state = load();
  },
  get: () => state,
  isSelected: (id) => state.selected.includes(id),
  /** True when a selected service includes this one, so it can't be removed on its own. */
  isLocked: (id) => state.selected.some((s) => (INCLUDES[s] || []).includes(id)),
  toggle(id, force) {
    const has = state.selected.includes(id);
    const want = force ?? !has;
    if (want === has) return;
    if (!want && store.isLocked(id)) return; // e.g. Content Creation while Strategy is selected

    let selected = [...state.selected];
    let autoAdded = [...(state.autoAdded || [])];
    if (want) {
      selected.push(id);
      for (const dep of INCLUDES[id] || []) {
        if (!selected.includes(dep)) {
          selected.push(dep);
          autoAdded.push(dep);
        }
      }
    } else {
      selected = selected.filter((s) => s !== id);
      autoAdded = autoAdded.filter((s) => s !== id);
      // Remove anything this service added automatically, unless something else still needs it.
      for (const dep of INCLUDES[id] || []) {
        const stillNeeded = selected.some((s) => (INCLUDES[s] || []).includes(dep));
        if (autoAdded.includes(dep) && !stillNeeded) {
          selected = selected.filter((s) => s !== dep);
          autoAdded = autoAdded.filter((s) => s !== dep);
        }
      }
    }
    state = { ...state, selected, autoAdded };
    save();
    emit({ type: 'toggle', id, selected: want });
  },
  set(patch, meta = { type: 'set' }) {
    state = { ...state, ...patch };
    save();
    emit({ ...meta, keys: Object.keys(patch) });
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
