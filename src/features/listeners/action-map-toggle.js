import { validateToggleEntries } from './action-map-schema.js';

/** @type {import('./action-map-schema.js').ToggleActionEntry[]} */
export const TOGGLE_DEFINITIONS = [
  { id: 'maxchruchtask', label: 'Church', trigger: 'daily' },
  { id: 'maxanimaltask', label: 'Stray', trigger: 'daily' },
  { id: 'edenshrooms', label: 'Shroom', trigger: 'daily' },
  { id: 'edengarden', label: 'Garden', trigger: 'daily' },
  { id: 'edenspring', label: 'Spring', trigger: 'daily' },
  { id: 'edentimer', label: 'Timer', trigger: 'daily' },
  { id: 'invinityNPCPregnancy', label: 'Activate', trigger: 'daily' },
  { id: 'virginity', label: 'Virgin', trigger: 'frame' },
  { id: 'purity', label: 'Pure', trigger: 'frame' },
  { id: 'unlicum', label: 'Cum', trigger: 'frame' },
  { id: 'unliarousal', label: 'arousal', trigger: 'frame' },
  { id: 'everyone_horny', label: 'Horny', trigger: 'frame' },
  { id: 'farm_safe', label: 'Safe', trigger: 'frame' },
  { id: 'checkArray', label: 'Scan', trigger: 'frame', cooldownMs: 400 },
  { id: 'interact_child', label: 'Auto', trigger: 'frame', cooldownMs: 200 },
  { id: 'pregnancy_detection', label: 'Activate', trigger: 'frame', cooldownMs: 250 },
  { id: 'invincibleAngel', label: 'Activate', trigger: 'frame' },
  { id: 'intenseCum', label: 'intense cum', trigger: 'frame', cooldownMs: 80 },
  { id: 'allNPCInstaPregnant', label: 'Activate', trigger: 'frame', cooldownMs: 250 },
  { id: 'allNPCMultiplePregnancy', label: 'Activate', trigger: 'frame', cooldownMs: 250 },
];

export const DAILY_TOGGLE_ACTIONS = TOGGLE_DEFINITIONS.filter((entry) => entry.trigger === 'daily');
export const TOGGLE_ACTIONS = TOGGLE_DEFINITIONS.filter((entry) => entry.trigger !== 'daily');

validateToggleEntries(TOGGLE_DEFINITIONS, 'TOGGLE_DEFINITIONS');
