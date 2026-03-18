import { bloodEffect } from '../../ui/components/modal.js';
import { showToast } from '../../ui/components/toast.js';
import { ToggleScheduler } from '../../services/toggle-scheduler.js';

import toggleRuntime from './toggle-runtime.js';

export function updateToggleBundle(key, enabled, handler) {
  if (enabled) {
    ToggleScheduler.register(key, handler, { daily: false, cooldownMs: 100, maxFailures: 5 });
    toggleRuntime.toggleActive[key] = true;
  } else {
    ToggleScheduler.unregister(key, { daily: false });
    delete toggleRuntime.toggleActive[key];
  }
}

export function abortion_notice() {
  showToast('Aborting...');
  setTimeout(() => bloodEffect(), 1000);
  setTimeout(() => showToast('baby is aborted!'), 3200);
}

export function setPregnancyTimer(pregnancy, days) {
  let time = pregnancy.timerEnd - days * 3;
  if (time < 0) time = 0;
  pregnancy.timer = time;
}

export function applyNpcPregnancySet({
  selectElement,
  input,
  toggle,
  locked,
  lockedDays,
  toggleKey,
  toggleHandler,
  resolvePregnancy,
}) {
  if (!selectElement || isNaN(input)) return;

  const index = locked.findIndex((name) => name == selectElement);
  if (toggle && index === -1) {
    locked.push(selectElement);
    lockedDays.push(input);
    updateToggleBundle(toggleKey, true, toggleHandler);
  } else if (!toggle && index !== -1) {
    locked.splice(index, 1);
    lockedDays.splice(index, 1);
    updateToggleBundle(toggleKey, false);
  }

  const npcPregnancy = resolvePregnancy(selectElement);
  if (!npcPregnancy) return;

  setPregnancyTimer(npcPregnancy, input);
  showToast('Activated!');
}
