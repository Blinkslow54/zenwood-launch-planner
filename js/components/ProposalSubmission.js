/**
 * Sends the plan to Blinkslow.
 *  1. If SUBMISSION.endpoint is configured → POST JSON. Success is shown
 *     only when the endpoint responds 2xx.
 *  2. Otherwise, if SUBMISSION.recipientEmail is configured → opens a
 *     prefilled email draft (never reported as "sent").
 *  3. Otherwise → copy-to-clipboard fallback.
 */
import { h, icons } from '../lib/dom.js';
import { store } from '../state/store.js';
import { SUBMISSION } from '../config.js';
import { SUBMIT } from '../content/site-copy.js';
import { buildPlan, planHasContent, planToText, planToPayload } from '../lib/plan.js';

const hasEndpoint = () => !!SUBMISSION.endpoint?.trim();
const hasEmail = () => !!SUBMISSION.recipientEmail?.trim();

function mailtoHref(text) {
  const to = encodeURIComponent(SUBMISSION.recipientEmail.trim());
  return `mailto:${to}?subject=${encodeURIComponent(SUBMISSION.emailSubject)}&body=${encodeURIComponent(text)}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = h('textarea', { class: 'visually-hidden', readonly: true }, text);
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

export function ProposalSubmission() {
  let status = 'idle';
  let sentSnapshot = null;

  const submitLabel = h('span', null, SUBMIT.cta);
  const spinner = h('span', { class: 'spinner', 'aria-hidden': 'true' });
  const submitBtn = h('button', { type: 'button', class: 'btn btn--gold btn--lg submit__btn' }, spinner, submitLabel, icons.arrow());
  const validation = h('p', { class: 'submit__validation', role: 'alert' });
  const statusBox = h('div', { class: 'submit__status', 'aria-live': 'polite' });

  const snapshot = () => {
    const { summary } = planToPayload(buildPlan(store.get()));
    return summary; // the formatted text covers services, notes, date and post-launch
  };

  function render() {
    submitBtn.disabled = status === 'sending';
    submitBtn.classList.toggle('is-loading', status === 'sending');
    const changedSinceSend = sentSnapshot && sentSnapshot !== snapshot();
    submitLabel.textContent =
      status === 'sending' ? SUBMIT.sending : status === 'success' && !changedSinceSend ? 'Selections Sent' : changedSinceSend ? 'Send Updated Selections' : SUBMIT.cta;
    if (status === 'success' && !changedSinceSend) submitBtn.disabled = true;
  }

  function showStatus(kind, { heading, body }, actions = []) {
    statusBox.replaceChildren(
      h('div', { class: `status status--${kind}` },
        h('p', { class: 'status__heading', tabindex: '-1' }, heading),
        h('p', { class: 'status__body' }, body),
        actions.length ? h('div', { class: 'status__actions' }, actions) : null)
    );
    statusBox.querySelector('.status__heading').focus({ preventScroll: false });
  }

  function fallbackActions(text) {
    const copyLabel = h('span', null, SUBMIT.copy);
    const copyBtn = h('button', { type: 'button', class: 'btn btn--ghost-light' }, copyLabel);
    const preview = h('textarea', { class: 'status__preview', readonly: true, rows: 8, 'aria-label': 'Your formatted launch plan' }, text);
    copyBtn.addEventListener('click', async () => {
      const ok = await copyText(text);
      copyLabel.textContent = ok ? SUBMIT.copied : 'Select the text below to copy';
      if (!ok) { preview.focus(); preview.select(); }
      setTimeout(() => (copyLabel.textContent = SUBMIT.copy), 2600);
    });
    const actions = [copyBtn];
    if (hasEmail()) actions.push(h('a', { class: 'btn btn--ghost-light', href: mailtoHref(text) }, SUBMIT.email));
    return [h('div', { class: 'status__buttons' }, actions), preview];
  }

  async function submit() {
    const plan = buildPlan(store.get());
    if (!planHasContent(plan)) {
      validation.textContent = SUBMIT.needsSelection;
      return;
    }
    validation.textContent = '';
    const text = planToText(plan);

    if (!hasEndpoint()) {
      if (hasEmail()) {
        window.location.href = mailtoHref(text);
        status = 'fallback';
        showStatus('info', SUBMIT.emailFallback, fallbackActions(text));
      } else {
        status = 'fallback';
        console.warn('[Zenwood planner] No SUBMISSION.endpoint or recipientEmail configured in js/config.js — showing copy fallback.');
        showStatus('info', SUBMIT.manualFallback, fallbackActions(text));
      }
      render();
      return;
    }

    status = 'sending';
    render();
    statusBox.replaceChildren();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), SUBMISSION.timeoutMs);
    try {
      const res = await fetch(SUBMISSION.endpoint, {
        method: SUBMISSION.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...SUBMISSION.headers },
        body: JSON.stringify({ ...(SUBMISSION.extraFields || {}), ...planToPayload(plan) }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      status = 'success';
      sentSnapshot = snapshot();
      store.set({ lastSubmittedAt: new Date().toISOString() }, { type: 'submitted' });
      showStatus('success', SUBMIT.success);
    } catch (err) {
      console.error('[Zenwood planner] Submission failed:', err);
      status = 'error';
      const retry = h('button', { type: 'button', class: 'btn btn--ghost-light', onclick: submit }, SUBMIT.retry);
      showStatus('error', SUBMIT.error, [retry, ...fallbackActions(text)]);
    } finally {
      clearTimeout(timer);
      render();
    }
  }

  submitBtn.addEventListener('click', submit);
  store.subscribe((_, meta) => {
    if (meta?.type !== 'submitted') {
      if (validation.textContent && planHasContent(buildPlan(store.get()))) validation.textContent = '';
      render();
    }
  });
  render();

  const last = store.get().lastSubmittedAt;
  const lastNote = last
    ? h('p', { class: 'submit__last' }, `Last sent ${new Date(last).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}. You can send an updated plan anytime.`)
    : null;

  return h('div', { class: 'submit' }, submitBtn, validation, h('p', { class: 'submit__reassurance' }, SUBMIT.reassurance), lastNote, statusBox);
}
