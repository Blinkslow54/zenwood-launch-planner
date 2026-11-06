/**
 * Selection state — the single source of truth for what the owner chose.
 * Persisted to localStorage so progress survives refreshes.
 * Presentation components subscribe; they never own selection data.
 */
import { STORAGE_KEY } from '../config.js';

const defaults = () => ({
  selected: [], // service ids, in the order they were added
  cabinCount: null, // number | null
  cabinNotSure: false,
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
    if (!next.sectionNotes || typeof next.sectionNotes !== 'object') next.sectionNotes = {};
    if (validIds) next.selected = next.selected.filter((id) => validIds.has(id));
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
  toggle(id, force) {
    const has = state.selected.includes(id);
    const want = force ?? !has;
    if (want === has) return;
    state = {
      ...state,
      selected: want ? [...state.selected, id] : state.selected.filter((s) => s !== id),
    };
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
