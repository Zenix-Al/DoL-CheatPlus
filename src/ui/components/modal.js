import { byUiId, getUiRoot, refreshUiRefs } from '../helpers/dom-refs.js';
import { modalTemplate, renderTemplate } from '../renderers/layout.js';
import { showToast } from './toast.js';

function ensureModalInjected() {
  if (byUiId('modal')) return;
  const root = getUiRoot();
  const cheatRoot = byUiId('cheat');
  if (!root || !cheatRoot) return;

  cheatRoot.appendChild(renderTemplate(modalTemplate));
  refreshUiRefs();
}

export function bloodEffect() {
  const effect = byUiId('effect-layer');
  const bodyElement = document.body;

  if (!effect) return;

  effect.classList.remove('hidden');
  effect.style.transition = 'opacity 0.1s ease-in-out';
  effect.style.opacity = 0;

  setTimeout(() => {
    effect.style.transition = 'opacity 2s ease-in-out';
    effect.style.opacity = 1;
    bodyElement.classList.add('shake');
  }, 200);

  setTimeout(() => {
    bodyElement.classList.remove('shake');
    effect.classList.add('hidden');
  }, 2200);
}

export function openModal() {
  if (window.modalOpen || (window.isDelete && window.isCheatPressed)) return;

  if (window.isDelete) {
    window.isCheatPressed = true;
    showToast('Loading cheat, please slow down.');
    return setTimeout(openModal, 100);
  }

  ensureModalInjected();
  const modal = byUiId('modal');
  if (!modal) return;

  modal.style.display = 'block';
  window.modalOpen = true;
  if (typeof window.init_interface === 'function') {
    window.init_interface();
  } else {
    // Retry briefly in case modules are still loading while user opens the modal.
    let tries = 0;
    const retry = () => {
      if (typeof window.init_interface === 'function') {
        window.init_interface();
        return;
      }
      tries += 1;
      if (tries < 80) setTimeout(retry, 100);
    };
    retry();
  }
  if (typeof window.loadall === 'function') window.loadall();
}

export function closeModal() {
  if (!window.modalOpen) return;
  const modal = byUiId('modal');
  if (!modal) return;
  modal.style.display = 'none';
  window.modalOpen = false;
  if (typeof window.deleteText === 'function') window.deleteText();
}
