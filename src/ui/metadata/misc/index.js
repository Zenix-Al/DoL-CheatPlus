import { createRowsFromLegacyDefs, createRowsFromSettingDefs } from '../factory.js';
import { toggleFeedback, successFeedback } from '../feedback-presets.js';
import { getNPCName, getStoredNPCs } from '../../../core/sugarcube/adapter.js';

function getNamedNpcPregnancyOptions() {
  const namedNpcs = getNPCName();
  if (!Array.isArray(namedNpcs)) return [];

  return namedNpcs
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => npc?.pregnancy?.timer != null)
    .map(({ npc, index }) => ({ value: String(index), label: npc.description }));
}

function getNpcPregnancyOptions() {
  const storedNpcs = getStoredNPCs();
  if (!storedNpcs || typeof storedNpcs !== 'object') return [];

  return Object.entries(storedNpcs)
    .filter(([, npc]) => npc?.pregnancy?.fetus?.[0]?.mother)
    .map(([key, npc]) => ({ value: key, label: npc.pregnancy.fetus[0].mother }));
}

const CONTROL_OVERRIDES = {
  named_npc_pregnancy_toggle: {
    binding: { path: 'cheatPlus.namedNpcPregnancyLock', required: false },
    defaultValue: false,
    coerce: 'boolean',
  },
  npc_pregnancy_toggle: {
    binding: { path: 'cheatPlus.npcPregnancyLock', required: false },
    defaultValue: false,
    coerce: 'boolean',
  },
};

export function createMiscMetadata(context) {
  const {
    data: { npcnamelist, npctrait },
  } = context;

  const rowDefs = [
    { ids: [''], inputs: ['header'], values: ['NPC'] },
    {
      ids: ['', 'npcnames', 'npctraits', 'npcchangeinput', 'changetraitbro'],
      inputs: ['text', 'select', 'select', 'input', 'button'],
      values: ['NPC manager', npcnamelist, npctrait, '', 'Set'],
    },
    {
      ids: ['', 'max_harmony', 'max_Ferocity'],
      inputs: ['text', 'button', 'button'],
      values: ['wolfpack', 'max harmony', 'max Ferocity'],
    },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Pregnancy Manager'] },
    {
      ids: ['', 'pregnancy_manager_time_tooltip'],
      inputs: ['header', 'tooltip'],
      values: ['Pregnancy time', 'day'],
    },
  ];

  const settingDefs = [
    {
      key: 'misc_named_npc_pregnancy',
      text: 'Named NPC',
      inputs: [
        {
          type: 'select',
          id: 'named_npc_pregnancy_manager',
          optionsSource: getNamedNpcPregnancyOptions,
          action: 'named_npc_pregnancy_manager',
        },
        {
          type: 'input',
          id: 'named_npc_pregnancy_input',
          placeholder: '',
          coerce: 'number',
        },
        {
          type: 'checkbox',
          id: 'named_npc_pregnancy_toggle',
          text: 'lock preg',
          binding: { path: 'cheatPlus.namedNpcPregnancyLock', required: false },
          defaultValue: false,
          feedback: toggleFeedback('Named NPC Pregnancy Lock'),
        },
        {
          type: 'button',
          id: 'named_npc_pregnancy_set',
          text: 'Set',
          action: 'named_npc_pregnancy_set',
          feedback: successFeedback('Named NPC pregnancy updated'),
        },
      ],
    },
    {
      key: 'misc_npc_pregnancy',
      text: 'NPC',
      inputs: [
        {
          type: 'select',
          id: 'npc_pregnancy_manager',
          optionsSource: getNpcPregnancyOptions,
          action: 'npc_pregnancy_manager',
        },
        {
          type: 'input',
          id: 'npc_pregnancy_input',
          placeholder: '',
          coerce: 'number',
        },
        {
          type: 'checkbox',
          id: 'npc_pregnancy_toggle',
          text: 'lock preg',
          binding: { path: 'cheatPlus.npcPregnancyLock', required: false },
          defaultValue: false,
          feedback: toggleFeedback('NPC Pregnancy Lock'),
        },
        {
          type: 'button',
          id: 'npc_pregnancy_set',
          text: 'Set',
          action: 'npc_pregnancy_set',
          feedback: successFeedback('NPC pregnancy updated'),
        },
      ],
    },
  ];

  return [
    ...createRowsFromLegacyDefs(rowDefs, CONTROL_OVERRIDES),
    ...createRowsFromSettingDefs(settingDefs),
  ];
}
