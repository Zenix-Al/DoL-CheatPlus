import { setReactivatingToggles } from '../core/runtime-state.js';
import { initCheatConfig, getToggles } from '../core/sugarcube/cheat-config.js';
import { dispatch, isRegistered } from '../core/actions/dispatcher.js';

import { ToggleScheduler } from './toggle-scheduler.js';

// Initialize CheatPlus storage with default values
export function initStorage() {
  initCheatConfig();
}

// Reactivate Toggle States
export function reactivateToggles() {
  setReactivatingToggles(true);
  deactiveAllToggles();

  const toggles = getToggles();
  for (const key in toggles) {
    if (isRegistered(key)) {
      dispatch(key);
    } else {
      delete toggles[key]; // Remove invalid entries
    }
  }

  setReactivatingToggles(false);
}

// Deactivate all toggles from both function bundles
function deactiveAllToggles() {
  const bundles = ToggleScheduler.getBundles();
  const allFunctions = {
    ...bundles.functionbundle,
    ...bundles.dailyfunctionbundle,
  };
  for (const key in allFunctions) {
    if (typeof allFunctions[key] === 'function' && isRegistered(key)) {
      dispatch(key);
    }
  }
}
