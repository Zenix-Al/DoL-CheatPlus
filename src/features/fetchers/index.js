import { byUiId } from '../../ui/helpers/dom-query.js';
import { ToggleScheduler } from '../../services/toggle-scheduler.js';

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
  coreUpdates.crimecurrent,
  coreUpdates.vowcurrent,
  miscUpdates.update_cheat_state,
  miscUpdates.randomEncounterUpdate,
  coreUpdates.update_pregnancy,
  update_toggle,
];

const statsHydrators = [
  coreUpdates.statpick,
  coreUpdates.statpicke,
  coreUpdates.spraystate,
  coreUpdates.bodycurrent,
  coreUpdates.bodytypecurrent,
  coreUpdates.ballscurrent,
  coreUpdates.virginitycurrent,
  coreUpdates.characurrent,
  coreUpdates.lactatingcurrent,
  coreUpdates.milkcurrent,
  coreUpdates.cumcurrent,
  coreUpdates.famecurrent,
  coreUpdates.examcurrent,
  coreUpdates.update_school_rep,
  coreUpdates.talentcurrent,
];

const miscHydrators = [
  coreUpdates.npccurrent,
  pregnancyUpdates.update_pregnancy_day_named_npc,
  pregnancyUpdates.update_pregnancy_day_npc,
  pregnancyUpdates.update_pregnancy_list_mc,
  pregnancyUpdates.update_pregnancy_day_mc,
  offspringUpdates.update_mc_tentacle,
  offspringUpdates.update_mc_baby_list,
  offspringUpdates.update_mc_abortion_list,
  offspringUpdates.update_named_npc_abortion_list,
  offspringUpdates.update_npc_abortion_list,
  offspringUpdates.update_npc_fetus_abortion_list,
  miscUpdates.update_farm_assault_day,
  miscUpdates.update_farm_buildtime,
  miscUpdates.update_farm_animals_like,
  miscUpdates.update_array_checker,
];

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
}

export function hydrateStatsSection() {
  runHydrators(statsHydrators);
}

export function hydrateMiscSection() {
  runHydrators(miscHydrators);
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

// Legacy aliases kept for compatibility while callsites migrate.
export const firstload = hydrateCheatUi;
export const alt_fetch = hydratePregnancy;

export default hydrateCheatUi;
