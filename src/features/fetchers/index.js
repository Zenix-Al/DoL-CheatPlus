import { byUiId } from '../../ui/helpers/dom-query.js';
import { ToggleScheduler } from '../../services/toggle-scheduler.js';
import { getActiveCheatBuilder } from '../../cheats/runtime/active-builder.js';

import * as coreUpdates from './core-updates.js';
import * as miscUpdates from './misc-updates.js';
import * as offspringUpdates from './offspring-updates.js';
import * as pregnancyUpdates from './pregnancy-updates.js';

function runHydrators(handlers) {
  handlers.forEach((handler) => {
    if (typeof handler === 'function') handler();
  });
}

const quickHydrators = [
  coreUpdates.arousalpicked,
  coreUpdates.vowcurrent,
  miscUpdates.update_cheat_state,
  miscUpdates.randomEncounterUpdate,
  coreUpdates.update_pregnancy,
  update_toggle,
];

const miscHydrators = [];

export function update_toggle() {
  const bundles = ToggleScheduler.getBundles();
  const allActive = {
    ...bundles.functionbundle,
    ...bundles.dailyfunctionbundle,
  };

  for (const id in allActive) {
    if (typeof allActive[id] === 'function') {
      const button = byUiId(id) || document.getElementById(id);
      if (button) button.classList.add('cp-toggle-active');
    }
  }
}

export function update_pregnancy_mc() {
  pregnancyUpdates.update_pregnancy_list_mc();
  pregnancyUpdates.update_pregnancy_day_mc();
}

export function hydrateQuickSection() {
  runHydrators(quickHydrators);
  void getActiveCheatBuilder()?.sectionOpened('quick');
}

export function hydrateStatsSection() {
  void getActiveCheatBuilder()?.sectionOpened('stats');
}

export function hydrateMiscSection() {
  runHydrators(miscHydrators);
  void getActiveCheatBuilder()?.sectionOpened('misc');
}

export const fetcherActions = {
  update_toggle,
  ...coreUpdates,
  ...pregnancyUpdates,
  ...offspringUpdates,
  ...miscUpdates,
};

export const hydrateCheatUi = fetcherActions;
export const hydratePregnancy = {
  update_pregnancy_mc,
};
