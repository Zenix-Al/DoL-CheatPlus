import { showToast } from '../../ui/components/toast.js';
import { openModal, closeModal } from '../../ui/components/modal.js';
import {
  Enable_cheat_history,
  Enable_sidebar_button,
  simple_cheat_button,
} from '../../ui/components/controls.js';
import { showContent } from '../../ui/helpers/ui-display.js';
import { executeSearch, restoreVariables } from '../search-actions.js';
import { cheatActions } from '../actions.js';
import {
  hydrateCheatUi,
  hydratePregnancy,
  hydrateMiscSection,
  hydrateQuickSection,
  hydrateStatsSection,
} from '../fetchers/index.js';
import { init_interface } from '../cheat-init.js';
import { byUiId, getUiRefs } from '../../ui/helpers/dom-query.js';
import {
  getIsLoad,
  getReactivatingToggles,
  incrementClickCounter,
  setIsLoad,
} from '../../core/runtime-state.js';
import { setErrorHook } from '../../core/actions/dispatcher.js';
import { isAtSettings } from '../../core/sugarcube/quirks.js';
import { on, reset } from '../../core/events/registry.js';
import { initStorage, reactivateToggles } from '../../services/storage.js';
import { ToggleScheduler } from '../../services/toggle-scheduler.js';
import { createRuntimeObserverPolicy } from '../../core/runtime-observer-policy.js';
import { getToggles } from '../../core/sugarcube/cheat-config.js';

import { registerAllActions } from './action-maps.js';

let actionsRegistered = false;
let runtimeObserverPolicy = createRuntimeObserverPolicy();

export function configureRuntimeObserverPolicy(overrides = {}) {
  runtimeObserverPolicy = createRuntimeObserverPolicy(overrides);
}

export function registerListenerActions() {
  if (actionsRegistered) return;
  registerAllActions({
    closeModal,
    openModal,
    showContent,
    getUiRefs,
    cheatActions,
    hydratePregnancy,
    hydrateCheatUi,
    hydrateQuickSection,
    hydrateStatsSection,
    hydrateMiscSection,
    Enable_cheat_history,
    Enable_sidebar_button,
    simple_cheat_button,
    executeSearch,
    init_interface,
  });
  setErrorHook((key) => showToast(`Action "${key}" failed.`, { variant: 'error' }));
  actionsRegistered = true;
}

function initGameObservers() {
  const cheat = byUiId('cheat');
  if (!cheat) return;
  reset(); // teardown previously-attached listeners — safe for idempotent re-injection

  function ensureTogglesActive() {
    if (!actionsRegistered) return;
    if (getIsLoad() || getReactivatingToggles()) return;

    const stored = getToggles();
    const storedCount = stored && typeof stored === 'object' ? Object.keys(stored).length : 0;
    if (!storedCount) return;

    const bundles = ToggleScheduler.getBundles();
    const runtimeCount =
      Object.keys(bundles.functionbundle || {}).length +
      Object.keys(bundles.dailyfunctionbundle || {}).length;

    if (runtimeCount === 0) {
      initStorage();
      reactivateToggles();
    }
  }

  // document listener for toggle cheat
  on(document, 'click', function (event) {
    ensureTogglesActive();
    if (isAtSettings()) {
      //restore variables in certain passage to avoid error.
      restoreVariables();
    } else {
      incrementClickCounter();
      cheatActions.runitall();
    }
    //to avoid this variable undefined and causing an error
    let target = event.target;
    if (runtimeObserverPolicy.detectLoadTrigger(target)) {
      setIsLoad(true);
    } else if (getIsLoad()) {
      initStorage();
      reactivateToggles();
      showToast('Cheat state loaded', { variant: 'success' });
      setIsLoad(false);
    } else if (runtimeObserverPolicy.detectHistoryNavigation(target)) {
      initStorage();
    }
  });

  on(document, 'keyup', function () {
    ensureTogglesActive();
    if (!isAtSettings()) {
      incrementClickCounter();
      cheatActions.runitall();
    }
  });
  on(cheat, 'keyup', function (event) {
    event.stopPropagation();
  });
}

function stopGameObservers() {
  reset();
  ToggleScheduler.reset();
}

export { initGameObservers, stopGameObservers };
