const BROKEN_CLASS = 'cp-section-broken';
const BROKEN_BANNER_CLASS = 'cp-section-broken-banner';

export function markSectionBroken(container, message) {
  if (!container) return;
  container.classList.add(BROKEN_CLASS);

  let banner = container.querySelector(`.${BROKEN_BANNER_CLASS}`);
  if (!banner) {
    banner = document.createElement('div');
    banner.className = BROKEN_BANNER_CLASS;
    container.prepend(banner);
  }
  banner.textContent = message;
}

export function clearSectionBroken(container) {
  if (!container) return;
  container.classList.remove(BROKEN_CLASS);
  const banner = container.querySelector(`.${BROKEN_BANNER_CLASS}`);
  if (banner) banner.remove();
}

export function applyMissingPolicy(container, rowNode, controlEl, meta, path, getBindingPolicy) {
  const policy = getBindingPolicy(meta);
  if (policy === 'hide') {
    if (rowNode) rowNode.style.display = 'none';
    return;
  }
  if (policy === 'disable') {
    if (controlEl) controlEl.disabled = true;
    return;
  }

  if (controlEl) controlEl.disabled = true;
  markSectionBroken(container, `Cheat unavailable: missing variable "${path}".`);
}

export { BROKEN_BANNER_CLASS, BROKEN_CLASS };
