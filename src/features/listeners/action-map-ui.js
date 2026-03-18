import {
  validateBoundEntries,
  validateNavEntries,
  validateSimpleUiEntries,
} from './action-map-schema.js';

/** @type {import('./action-map-schema.js').NavActionEntry[]} */
export const NAV_ACTIONS = [
  {
    actionKey: 'quick-link',
    navKey: 'quicklink',
    contentKey: 'quickcontent',
    hydrateKey: 'hydrateQuickSection',
  },
  {
    actionKey: 'stats-link',
    navKey: 'statlink',
    contentKey: 'statscontent',
    hydrateKey: 'hydrateStatsSection',
  },
  {
    actionKey: 'misc-link',
    navKey: 'misclink',
    contentKey: 'misccontent',
    hydrateKey: 'hydrateMiscSection',
  },
];

/** @type {import('./action-map-schema.js').SimpleUiActionEntry[]} */
export const SIMPLE_UI_ACTIONS = [
  { actionKey: 'cheat-open', target: 'openModal' },
  { actionKey: 'cheat-history-backwards', target: 'cheatActions', arg: 'cheat_backwards' },
  { actionKey: 'cheat-history-forwards', target: 'cheatActions', arg: 'cheat_forwards' },
  { actionKey: 'cheat-sidebar', target: 'cheatActions', arg: 'sidebar_cheat' },
  { actionKey: 'init_interface', target: 'init_interface' },
  { actionKey: 'search123', target: 'executeSearch', arg: 'search123' },
  { actionKey: 'search456', target: 'executeSearch', arg: 'search456' },
  { actionKey: 'Enable_cheat_history', target: 'Enable_cheat_history' },
  { actionKey: 'Enable_sidebar_button', target: 'Enable_sidebar_button' },
  { actionKey: 'simple_cheat_button', target: 'simple_cheat_button' },
];

/** @type {import('./action-map-schema.js').BoundActionEntry[]} */
export const BOUND_ACTIONS = [
  { actionKey: 'statpick', source: 'hydrateCheatUi', method: 'statpick' },
  { actionKey: 'statpicke', source: 'hydrateCheatUi', method: 'statpicke' },
  { actionKey: 'charapick', source: 'hydrateCheatUi', method: 'characurrent' },
  { actionKey: 'fame_name', source: 'hydrateCheatUi', method: 'famecurrent' },
  { actionKey: 'select_exam', source: 'hydrateCheatUi', method: 'examcurrent' },
  { actionKey: 'npcnames', source: 'hydrateCheatUi', method: 'npccurrent' },
  { actionKey: 'npctraits', source: 'hydrateCheatUi', method: 'npccurrent' },
  { actionKey: 'select_talent', source: 'hydrateCheatUi', method: 'talentcurrent' },
  { actionKey: 'select_school_rep', source: 'hydrateCheatUi', method: 'update_school_rep' },
  {
    actionKey: 'named_npc_pregnancy_manager',
    source: 'hydrateCheatUi',
    method: 'update_pregnancy_day_named_npc',
  },
  {
    actionKey: 'npc_pregnancy_manager',
    source: 'hydrateCheatUi',
    method: 'update_pregnancy_day_npc',
  },
  { actionKey: 'mc_pregnancy_hole', source: 'hydratePregnancy', method: 'update_pregnancy_mc' },
  {
    actionKey: 'mc_pregnancy_manager',
    source: 'hydrateCheatUi',
    method: 'update_pregnancy_day_mc',
  },
  { actionKey: 'mc_tentacle_location', source: 'hydrateCheatUi', method: 'update_mc_tentacle' },
  {
    actionKey: 'mc_tentacle_select',
    source: 'hydrateCheatUi',
    method: 'update_mc_tentacle_input',
  },
  {
    actionKey: 'mc_baby_action_select',
    source: 'hydrateCheatUi',
    method: 'update_mc_baby_info',
  },
  { actionKey: 'mc_baby_select', source: 'hydrateCheatUi', method: 'update_mc_baby_info' },
  {
    actionKey: 'mc_abortion_location',
    source: 'hydrateCheatUi',
    method: 'update_mc_abortion_list',
  },
  {
    actionKey: 'named_npc_abortion_chara_select',
    source: 'hydrateCheatUi',
    method: 'update_named_npc_abortion_list',
  },
  {
    actionKey: 'npc_abortion_chara_select',
    source: 'hydrateCheatUi',
    method: 'update_npc_fetus_abortion_list',
  },
  { actionKey: 'animal_choice', source: 'hydrateCheatUi', method: 'update_farm_animals_like' },
  { actionKey: 'arousal_val', source: 'hydrateCheatUi', method: 'arousalpicked' },
];

validateNavEntries(NAV_ACTIONS, 'NAV_ACTIONS');
validateSimpleUiEntries(SIMPLE_UI_ACTIONS, 'SIMPLE_UI_ACTIONS');
validateBoundEntries(BOUND_ACTIONS, 'BOUND_ACTIONS');
