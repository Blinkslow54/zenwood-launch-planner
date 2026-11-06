/** Polite screen-reader announcements (e.g. "Brand Kit added to your launch plan"). */
let region;

export function mountAnnouncer() {
  region = document.createElement('div');
  region.className = 'visually-hidden';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  document.body.append(region);
}

export function announce(message) {
  if (!region) return;
  region.textContent = '';
  setTimeout(() => (region.textContent = message), 60);
}
