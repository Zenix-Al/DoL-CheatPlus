import { createRowsFromLegacyDefs, createRowsFromSettingDefs } from '../factory.js';

const CONTROL_OVERRIDES = {};

const QUICK_SETTING_DEFS = [
  {
    key: 'quick_arousal',
    text: 'Arousal',
    inputs: [
      {
        type: 'range',
        id: 'arousal_val',
        max: 100,
        value: 0,
        action: 'arousal_val',
        binding: { path: 'arousal', required: true, onMissing: 'mark-section-broken' },
        defaultValue: 0,
        coerce: 'number',
        feedback: { success: 'Arousal updated', variant: 'info' },
      },
      {
        type: 'text',
        id: 'arousal_preview',
        text: '0',
      },
      {
        type: 'button',
        id: 'arousal_player',
        text: 'Player',
        action: 'arousal_player',
        feedback: { success: 'Player arousal applied', variant: 'success' },
      },
      {
        type: 'button',
        id: 'arousal_enemy',
        text: 'Enemy',
        action: 'arousal_enemy',
        feedback: { success: 'Enemy arousal applied', variant: 'success' },
      },
    ],
  },
];

export function createQuickMetadata(context) {
  const {
    data: { downloadSite, sourceCode },
    runtime,
  } = context;

  const testedOnStr =
    runtime.testedOn && runtime.testedOn !== '0.0.0'
      ? 'Tested on :' + runtime.testedOn
      : 'Tested on : Untested';
  const curVerStr = runtime.curVer ? 'Current ver :' + runtime.curVer : '';
  const isCheatWorkSymbolStr = runtime.isCheatWorkSymbol ?? '';
  const testedTooltip =
    runtime.testedOn && runtime.testedOn !== '0.0.0'
      ? runtime.isCheatWork ?? ''
      : 'Not tested in current game version';

  const localOverrides = { ...CONTROL_OVERRIDES };
  // hide the cheat-work symbol cell when there's no symbol to show
  localOverrides.is_cheat_symbol = { visibility: Boolean(isCheatWorkSymbolStr) };

  const quickLegacyDefs = [
    {
      ids: ['', '', 'is_cheat_symbol', 'info_cheat'],
      inputs: ['text', 'text', 'text', 'tooltip'],
      values: [testedOnStr, curVerStr, isCheatWorkSymbolStr, testedTooltip],
    },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Quick cheat'] },
    {
      ids: ['', 'hesoyam', 'kill_player'],
      inputs: ['text', 'button', 'button'],
      values: ['Player state', 'Recover', 'Ruin'],
    },
    {
      ids: ['', 'enemycalm', 'kill_enemy'],
      inputs: ['text', 'button', 'button'],
      values: ['Enemy state', 'Recover', 'Ruin'],
    },
    {
      ids: ['', 'crimecurrent', 'sheesh', 'jk-lol'],
      inputs: ['text', 'text', 'button', 'button'],
      values: ['Crime : ', '0', '-100', '+100'],
    },
    { ids: ['', 'vow-virgin'], inputs: ['text', 'button'], values: ['chruch vow', 'Virgin'] },
    {
      ids: ['', 'clean_cum', 'dirty_cum', 'clean_cum_uretus'],
      inputs: ['text', 'button', 'button', 'button'],
      values: ['Hygiene', 'Clean', 'dirty', 'clean uretus cum'],
    },
    {
      ids: ['', 'in_game_cheat', 'alt_cheat'],
      inputs: ['text', 'button', 'button'],
      values: ['In game cheat', 'Enable', 'Open'],
    },
    {
      ids: ['', 'randomEncounterSet'],
      inputs: ['text', 'button'],
      values: ['Random encounter', 'Enabled'],
    },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Unlimited Toggles'] },
    {
      ids: ['', 'maxchruchtask', 'maxanimaltask'],
      inputs: ['text', 'button', 'button'],
      values: ['Tasks', 'Chruch', 'Stray'],
    },
    {
      ids: ['', 'edenshrooms', 'edengarden', 'edenspring', 'edentimer'],
      inputs: ['text', 'button', 'button', 'button', 'button'],
      values: ['Eden Tasks', 'Shroom', 'Garden', 'Spring', 'Timer'],
    },
    {
      ids: ['', 'everyone_horny'],
      inputs: ['text', 'button'],
      values: ['Everyone is horny', 'Horny'],
    },
    { ids: ['', 'farm_safe'], inputs: ['text', 'button'], values: ['Farm safety', 'Safe'] },
    {
      ids: ['', 'unlicum', 'unliarousal', 'intenseCum'],
      inputs: ['text', 'button', 'button', 'button'],
      values: ['Unlimited', 'cum', 'arousal', 'intense cum'],
    },
    {
      ids: ['', 'virginity', 'purity'],
      inputs: ['text', 'button', 'button'],
      values: ['Maintain pure', 'virgin', 'pure'],
    },
    {
      ids: ['', 'invincibleAngel', 'invincibleAngelInfo'],
      inputs: ['text', 'button', 'tooltip'],
      values: [
        'Invincible Angel',
        'Activate',
        'it will prevent angel build progress lower or become fallen.(combine it with pure cheat)',
      ],
    },
    {
      ids: ['', 'interact_child', 'info_interact_child'],
      inputs: ['text', 'button', 'tooltip'],
      values: ['Auto Child Interact ', 'Auto', 'you must visit your baby first to trigger it.'],
    },
    {
      ids: ['', 'pc_pregnancy', 'npc_pregnancy', 'pregnancy_detection'],
      inputs: ['text', 'text', 'text', 'button'],
      values: ['pregnancy detection ', 'pc=0', 'NPC=0', 'Activate'],
    },
    {
      ids: ['', 'invinityNPCPregnancy', 'invinityNPCPregnancyInfo'],
      inputs: ['text', 'button', 'tooltip'],
      values: [
        'Infinite NPC pregnancy ',
        'Activate',
        'It will store pregnancy on the cheat untill it reach 1 day before give birth.',
      ],
    },
    {
      ids: ['', 'allNPCInstaPregnant', 'allNPCInstaPregnantInfo'],
      inputs: ['text', 'button', 'tooltip'],
      values: [
        'NPC max pregnancy rate',
        'Activate',
        'NPC has 100% pregnancy rate. some npc might cannot impregnated at all. Multiple pregnancy allows you to impregnated everyone multiple times.',
      ],
    },
    {
      ids: ['', 'allNPCMultiplePregnancy', 'allNPCMultiplePregnancyInfo'],
      inputs: ['text', 'button', 'tooltip'],
      values: [
        'NPC multiple pregnancys',
        'Activate',
        'Allows you to impregnated NPCs multiple times.',
      ],
    },
    { ids: [''], inputs: ['newline'], values: [''] },
  ];

  const rows = [...createRowsFromLegacyDefs(quickLegacyDefs, localOverrides)];

  rows.splice(3, 0, ...createRowsFromSettingDefs(QUICK_SETTING_DEFS));

  if (runtime.isServer === 1) {
    rows.push(
      ...createRowsFromLegacyDefs(
        [{ ids: [''], inputs: ['header'], values: ['Server'] }],
        CONTROL_OVERRIDES
      )
    );
    if (runtime.curVer != runtime.testedOn) {
      rows.push(
        ...createRowsFromLegacyDefs(
          [
            {
              ids: ['', 'server_save_info'],
              inputs: ['text', 'tooltip'],
              values: [
                'caution! game version is different',
                'Lower version or moded version could potentially cause problem.',
              ],
            },
          ],
          CONTROL_OVERRIDES
        )
      );
    }
    rows.push(
      ...createRowsFromLegacyDefs(
        [
          {
            ids: ['', 'save_data', 'load_data', 'serversaveinfo'],
            inputs: ['text', 'button', 'button', 'tooltip'],
            values: [
              'Server Save',
              'Export',
              'Import',
              'this will export all of your save data (1-10) to the local server, allows you to import it anywhere else in the same local network',
            ],
          },
        ],
        CONTROL_OVERRIDES
      )
    );
    rows.push(
      ...createRowsFromLegacyDefs(
        [{ ids: [''], inputs: ['newline'], values: [''] }],
        CONTROL_OVERRIDES
      )
    );
  }

  rows.push(
    ...createRowsFromLegacyDefs(
      [{ ids: [''], inputs: ['newline'], values: [''] }],
      CONTROL_OVERRIDES
    )
  );
  rows.push(
    ...createRowsFromLegacyDefs(
      [
        {
          ids: ['', downloadSite, sourceCode],
          inputs: ['text', 'link', 'link'],
          values: [
            'cheat ver : ' +
              runtime.cheatVer +
              (runtime.cheatVerType ? ' ' + runtime.cheatVerType : ''),
            'Check for update',
            'Source Code',
          ],
        },
      ],
      CONTROL_OVERRIDES
    )
  );

  return rows;
}
