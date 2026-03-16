import { layoutTemplate, renderTemplate } from './renderers/layout.js';
import { injectCSS } from './helpers/css-injector.js';
import cssText from './assets/main.css';
import { byUiId, ensureShadowRoot, refreshUiRefs } from './helpers/dom-refs.js';
import debugLog from '../core/logger.js';
import { closeModal, openModal } from './components/modal.js';

function mountInterface() {
  if (!document.body) {
    requestAnimationFrame(mountInterface);
    return;
  }

  const root = ensureShadowRoot();
  if (!root) {
    debugLog('ui', 'mountInterface: ensureShadowRoot returned null');
    return;
  }
  if (byUiId('cheat')) return;

  // inject UI stylesheet (loaded as text by the build)
  try {
    injectCSS(cssText, root);
  } catch (e) {
    // injection failure should not block mounting
    console.warn('[CheatPlus] CSS injection failed:', e);
  }

  root.appendChild(renderTemplate(layoutTemplate));
  refreshUiRefs();
  try {
    debugLog('ui', 'mountInterface: mounted template', {
      data: { modalContainer: !!byUiId('modal-content-container') },
    });
  } catch (e) {}

  // Attach a direct button handler so the modal opens even if feature listeners
  // haven't been initialized yet (safe MVP fallback).
  try {
    const btn = byUiId('cheat-open');
    if (btn && !btn.__cheatPlusBound) {
      btn.addEventListener('click', (e) => {
        try {
          openModal();
        } catch (err) {
          console.error('[CheatPlus] openModal failed:', err);
        }
      });
      btn.__cheatPlusBound = true;
    }

    const rootEl = byUiId('cheat');
    if (rootEl && !rootEl.__cheatPlusCloseBound) {
      rootEl.addEventListener('click', (event) => {
        const target = event.target;
        if (!target || !target.id) return;
        if (target.id === 'closeButton' || target.id === 'modal') {
          const modal = byUiId('modal');
          if (modal && target.id === 'modal') {
            const content = modal.querySelector('.modal-content');
            if (content && content.contains(target)) return;
          }
          try {
            closeModal();
          } catch (err) {
            console.error('[CheatPlus] closeModal fallback failed:', err);
          }
        }
      });
      rootEl.__cheatPlusCloseBound = true;
    }
  } catch (err) {
    console.warn('[CheatPlus] failed to bind fallback open handler', err);
  }
}

export { mountInterface, renderTemplate, injectCSS, layoutTemplate };
