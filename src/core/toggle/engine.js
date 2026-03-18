import { SECONDS_PER_DAY } from '../../constants/runtime.js';
import { ToggleScheduler } from '../../services/toggle-scheduler.js';
import { reactivateToggles } from '../../services/storage.js';
import {
  decrementClickCounter,
  getClickCounter,
  getCurDate,
  getIsLoad,
  getReactivatingToggles,
  setCurDate,
  setExtraNotif,
} from '../runtime-state.js';
import { activateToggle, deactivateToggle } from '../sugarcube/cheat-config.js';
import { getVars } from '../sugarcube/state.js';
import { showToast } from '../../ui/components/toast.js';
import { byUiId } from '../../ui/helpers/dom-query.js';
import debugLog from '../logger.js';

import { clearActiveToggles } from './state-repository.js';

export function createToggleEngine(toggleState, getActionById, getToggleConfigById = null) {
  function restoreTogglesAfterObserverFailure() {
    debugLog('toggle', 'Watchdog: Error detected in toggle cheat, starting restoration...');
    clearActiveToggles();
    showToast('Error detected in toggle cheat, resetting.');
    reactivateToggles();
    debugLog('toggle', 'Watchdog: Restoration complete');
    showToast('Complete.');
  }

  function runitallRestore() {
    debugLog('toggle', 'Manual restore triggered');
    ToggleScheduler.restore({ onRestore: restoreTogglesAfterObserverFailure });
  }

  function runitall() {
    const started = ToggleScheduler.runFrame({
      isLoad: getIsLoad(),
      onWatchdogRestore: restoreTogglesAfterObserverFailure,
    });
    if (!started) return;

    decrementClickCounter();
    if (getClickCounter() > 0) {
      setTimeout(runitall, 10);
    }

    checkDateDaily();
  }

  function checkDateDaily() {
    const vars = getVars();
    const date = Math.floor(vars?.timeStamp / SECONDS_PER_DAY);
    if (getCurDate() !== date) {
      debugLog('toggle', `Daily trigger: game date changed from ${getCurDate()} to ${date}`);
      setCurDate(date);
      runitallDaily();
    }
  }

  function applyToggleMutation({ id, name, daily = null }) {
    if (!id) {
      debugLog('toggle', 'applyToggleMutation: Missing toggle id', { level: 'warn' });
      return;
    }
    const config = typeof getToggleConfigById === 'function' ? getToggleConfigById(id) || {} : {};
    const isDaily = daily == null ? config.trigger === 'daily' : Boolean(daily);
    const buttonLabel = name ?? config.label ?? 'Activate';
    const cooldownMs = Number.isFinite(config.cooldownMs) ? Number(config.cooldownMs) : 100;
    const maxFailures = Number.isInteger(config.maxFailures)
      ? Math.max(1, Number(config.maxFailures))
      : 5;
    const runOnActivate = config.runOnActivate !== false;

    const button = byUiId(id);
    const mapActive = isDaily ? toggleState.toggleActiveDaily : toggleState.toggleActive;
    const isActive = !!mapActive[id];

    if (isActive) {
      debugLog('toggle', `Deactivating toggle: ${id} (${isDaily ? 'daily' : 'regular'})`, {
        data: { button: !!button, label: buttonLabel },
      });
      ToggleScheduler.unregister(id, { daily: isDaily });
      deactivateToggle(id);
      delete mapActive[id];
      if (button) {
        if (button instanceof HTMLInputElement && button.type === 'checkbox') {
          button.checked = false;
        } else {
          button.classList.remove('cp-toggle-active');
          button.textContent = buttonLabel;
        }
      }
      return;
    }

    if (!getReactivatingToggles()) setExtraNotif(true);
    const actionFn = getActionById(id);
    if (typeof actionFn !== 'function') {
      debugLog('toggle', `Action not found for toggle: ${id}`, {
        data: { daily: isDaily },
        level: 'warn',
      });
      setExtraNotif(false);
      return;
    }

    debugLog('toggle', `Activating toggle: ${id} (${isDaily ? 'daily' : 'regular'})`, {
      data: { cooldownMs, maxFailures, runOnActivate, label: buttonLabel, button: !!button },
    });

    ToggleScheduler.register(id, actionFn, { daily: isDaily, cooldownMs, maxFailures });
    activateToggle(id);
    mapActive[id] = true;
    if (button) {
      if (button instanceof HTMLInputElement && button.type === 'checkbox') {
        button.checked = true;
      } else {
        button.classList.add('cp-toggle-active');
        button.textContent = buttonLabel;
      }
    }

    if (runOnActivate) {
      try {
        debugLog('toggle', `Running on activation: ${id}`);
        const fn = ToggleScheduler.getFunction(id, { daily: isDaily }) || actionFn;
        if (typeof fn === 'function') fn();
      } catch (err) {
        debugLog('toggle', `Error running action on activation: ${id}`, {
          data: err,
          level: 'error',
        });
      } finally {
        setExtraNotif(false);
      }
    } else {
      setExtraNotif(false);
    }
  }

  function runitallDaily() {
    debugLog('toggle', 'Executing daily toggles');
    ToggleScheduler.runDaily();
  }

  function toggle(id, name) {
    applyToggleMutation({ id, name, daily: false });
  }

  function toggleDaily(id, name) {
    applyToggleMutation({ id, name, daily: true });
  }

  function toggleById(id, name) {
    applyToggleMutation({ id, name, daily: null });
  }

  return {
    runitallRestore,
    runitall,
    checkDateDaily,
    _applyToggleMutation: applyToggleMutation,
    runitallDaily,
    toggle,
    toggleDaily,
    toggleById,
  };
}

export default createToggleEngine;
