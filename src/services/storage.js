import { setReactivatingToggles } from '../core/runtime-state.js';
import { initCheatConfig, getToggles } from '../core/sugarcube/cheat-config.js';
import { dispatch, isRegistered } from '../core/actions/dispatcher.js';
import { clearAllActiveToggles, getToggleState } from '../core/toggle/state-repository.js';
import debugLog from '../core/logger.js';

import { ToggleScheduler } from './toggle-scheduler.js';

// Initialize CheatPlus storage with default values
export function initStorage() {
  initCheatConfig();
}

// Reactivate Toggle States
export function reactivateToggles() {
  debugLog('toggle', '=== reactivateToggles START ===', { level: 'info' });

  const togglesRef = getToggles();
  debugLog('toggle', `Loaded from storage: ${Object.keys(togglesRef || {}).length} toggles`, {
    level: 'info',
  });

  // Deep clone
  const storedToggles = JSON.parse(JSON.stringify(togglesRef || {}));
  debugLog('toggle', `Deep cloned ${Object.keys(storedToggles).length} toggles`, { level: 'info' });

  setReactivatingToggles(true);
  debugLog('toggle', 'Set reactivating flag = true', { level: 'info' });

  // Reset runtime state
  resetRuntimeToggles();
  debugLog('toggle', 'Runtime toggles have been reset', { level: 'info' });

  let activatedCount = 0;

  for (const key in storedToggles) {
    if (isRegistered(key)) {
      // Persistent format is `{ [id]: id }` (see `activateToggle`), not boolean `true`.
      // Treat key presence / truthy values as enabled.
      const value = storedToggles[key];
      const enabled = value === true || value === 1 || value === key || Boolean(value);
      if (!enabled) {
        debugLog('toggle', `Skipping toggle with falsy value: ${key}`, {
          level: 'warn',
          data: { value },
        });
        continue;
      }

      debugLog('toggle', `Dispatching toggle: ${key}`, { level: 'info' });
      dispatch(key);
      activatedCount++;
    } else {
      debugLog('storage', `Skipping unregistered toggle: ${key}`, { level: 'warn' });
    }
  }

  debugLog('toggle', `Reactivation finished - Activated ${activatedCount} toggles`, {
    level: 'info',
  });
  debugLog('toggle', '=== reactivateToggles END ===', { level: 'info' });

  setReactivatingToggles(false);
}

function resetRuntimeToggles() {
  debugLog('toggle', 'resetRuntimeToggles called', { level: 'info' });

  ToggleScheduler.clearAll();
  debugLog('toggle', 'ToggleScheduler.clearAll() done', { level: 'info' });

  clearAllActiveToggles();
  debugLog('toggle', 'clearAllActiveToggles() done', { level: 'info' });

  const state = getToggleState();
  if (state) {
    state.toggleDeactivated = false;
    debugLog('toggle', 'Reset toggleDeactivated flag', { level: 'info' });
  }
}
