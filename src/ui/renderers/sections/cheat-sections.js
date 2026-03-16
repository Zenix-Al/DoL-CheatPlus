export function buildQuickSection(context) {
  const {
    generatetext,
    data: { downloadSite, sourceCode },
    runtime,
  } = context;

  generatetext(
    ['', '', '', 'info_cheat'],
    ['text', 'text', 'text', 'tooltip'],
    [
      'Tested on :' + runtime.testedOn,
      'Current ver :' + runtime.curVer,
      runtime.isCheatWorkSymbol,
      runtime.isCheatWork,
    ],
    'quick-content'
  );

  generatetext([''], ['newline'], [''], 'quick-content');
  generatetext([''], ['header'], ['Quick cheat'], 'quick-content');
  generatetext(
    ['', 'arousal_val', 'arousal_preview', 'arousal_player', 'arousal_enemy'],
    ['text', 'range', 'button', 'button', 'button'],
    ['Arousal', 100, 0, 'Player', 'Enemy'],
    'quick-content'
  );
  generatetext(
    ['', 'hesoyam', 'kill_player'],
    ['text', 'button', 'button'],
    ['Player state', 'Recover', 'Ruin'],
    'quick-content'
  );
  generatetext(
    ['', 'enemycalm', 'kill_enemy'],
    ['text', 'button', 'button'],
    ['Enemy state', 'Recover', 'Ruin'],
    'quick-content'
  );
  generatetext(
    ['', 'crimecurrent', 'sheesh', 'jk-lol'],
    ['text', 'button', 'button', 'button'],
    ['Crime : ', '0', '-100', '+100'],
    'quick-content'
  );
  generatetext(['', 'vow-virgin'], ['text', 'button'], ['chruch vow', 'Virgin'], 'quick-content');
  generatetext(
    ['', 'clean_cum', 'dirty_cum', 'clean_cum_uretus'],
    ['text', 'button', 'button', 'button'],
    ['Hygiene', 'Clean', 'dirty', 'clean uretus cum'],
    'quick-content'
  );
  generatetext(
    ['', 'in_game_cheat', 'alt_cheat'],
    ['text', 'button', 'button'],
    ['In game cheat', 'Enable', ''],
    'quick-content'
  );
  generatetext(
    ['', 'randomEncounterSet'],
    ['text', 'button'],
    ['Random encounter', 'Enabled'],
    'quick-content'
  );
  generatetext([''], ['newline'], [''], 'quick-content');

  generatetext([''], ['header'], ['Unlimited Toggles'], 'quick-content');
  generatetext(
    ['', 'maxchruchtask', 'maxanimaltask'],
    ['text', 'button', 'button'],
    ['Tasks', 'Chruch', 'Stray'],
    'quick-content'
  );
  generatetext(
    ['', 'edenshrooms', 'edengarden', 'edenspring', 'edentimer'],
    ['text', 'button', 'button', 'button', 'button'],
    ['Eden Tasks', 'Shroom', 'Garden', 'Spring', 'Timer'],
    'quick-content'
  );
  generatetext(
    ['', 'everyone_horny'],
    ['text', 'button'],
    ['Everyone is horny', 'Horny'],
    'quick-content'
  );
  generatetext(['', 'farm_safe'], ['text', 'button'], ['Farm safety', 'Safe'], 'quick-content');
  generatetext(
    ['', 'unlicum', 'unliarousal', 'intenseCum'],
    ['text', 'button', 'button', 'button'],
    ['Unlimited', 'cum', 'arousal', 'intense cum'],
    'quick-content'
  );
  generatetext(
    ['', 'virginity', 'purity'],
    ['text', 'button', 'button'],
    ['Maintain pure', 'virgin', 'pure'],
    'quick-content'
  );
  generatetext(
    ['', 'invincibleAngel', 'invincibleAngelInfo'],
    ['text', 'button', 'tooltip'],
    [
      'Invincible Angel',
      'Activate',
      'it will prevent angel build progress lower or become fallen.(combine it with pure cheat)',
    ],
    'quick-content'
  );
  generatetext(
    ['', 'interact_child', 'info_interact_child'],
    ['text', 'button', 'tooltip'],
    ['Auto Child Interact ', 'Auto', 'you must visit your baby first to trigger it.'],
    'quick-content'
  );
  generatetext(
    ['', 'pc_pregnancy', 'npc_pregnancy', 'pregnancy_detection'],
    ['text', 'button', 'button', 'button'],
    ['pregnancy detection ', 'pc=0', 'NPC=0', 'Activate'],
    'quick-content'
  );
  generatetext(
    ['', 'invinityNPCPregnancy', 'invinityNPCPregnancyInfo'],
    ['text', 'button', 'tooltip'],
    [
      'Infinite NPC pregnancy ',
      'Activate',
      'It will store pregnancy on the cheat untill it reach 1 day before give birth.',
    ],
    'quick-content'
  );
  generatetext(
    ['', 'allNPCInstaPregnant', 'allNPCInstaPregnantInfo'],
    ['text', 'button', 'tooltip'],
    [
      'NPC max pregnancy rate',
      'Activate',
      'NPC has 100% pregnancy rate. some npc might cannot impregnated at all. Multiple pregnancy allows you to impregnated everyone multiple times.',
    ],
    'quick-content'
  );
  generatetext(
    ['', 'allNPCMultiplePregnancy', 'allNPCMultiplePregnancyInfo'],
    ['text', 'button', 'tooltip'],
    ['NPC multiple pregnancys', 'Activate', 'Allows you to impregnated NPCs multiple times.'],
    'quick-content'
  );

  generatetext([''], ['newline'], [''], 'quick-content');
  if (runtime.isServer === 1) {
    generatetext([''], ['header'], ['Server'], 'quick-content');
    if (runtime.curVer != runtime.testedOn) {
      generatetext(
        ['', 'server_save_info'],
        ['text', 'tooltip'],
        [
          'caution! game version is different',
          'Lower version or moded version could potentially cause problem.',
        ],
        'quick-content'
      );
    }
    generatetext(
      ['', 'save_data', 'load_data', 'serversaveinfo'],
      ['text', 'button', 'button', 'tooltip'],
      [
        'Server Save',
        'Export',
        'Import',
        'this will export all of your save data (1-10) to the local server, allows you to import it anywhere else in the same local network',
      ],
      'quick-content'
    );
    generatetext([''], ['newline'], [''], 'quick-content');
  }

  generatetext([''], ['newline'], [''], 'quick-content');
  generatetext(
    ['', downloadSite, sourceCode],
    ['text', 'link', 'link'],
    [
      'cheat ver : ' + runtime.cheatVer + ' ' + runtime.cheatVerType,
      'Check for update',
      'Source Code',
    ],
    'quick-content'
  );
}

export function buildStatsSection(context) {
  const {
    generatetext,
    data: {
      bodyparts,
      characteristics,
      exam,
      fame,
      hentaiSkill,
      parasitename,
      school_rep,
      talent_skill,
    },
  } = context;

  generatetext([''], ['header'], ['Stats'], 'stats-content');
  generatetext(
    ['hesoyam', 'kill_player'],
    ['button', 'button'],
    ['Recover', 'Ruin'],
    'stats-content'
  );
  generatetext(
    ['statpick', 'statinput', 'statset'],
    ['select', 'input', 'button'],
    [
      [
        'pain',
        'arousal',
        'tiredness',
        'stress',
        'trauma',
        'control',
        'drunk',
        'drugged',
        'hallucinogen',
      ],
      '',
      'set',
    ],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');

  generatetext([''], ['header'], ['Enemy stats'], 'stats-content');
  generatetext(
    ['enemycalm', 'kill_enemy'],
    ['button', 'button'],
    ['Recover', 'Ruin'],
    'stats-content'
  );
  generatetext(
    ['statpicke', 'statinpute', 'statsete'],
    ['select', 'input', 'button'],
    [['enemyhealth', 'enemytrust', 'enemyanger'], '', 'set'],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');
  generatetext([''], ['header'], ['Player'], 'stats-content');
  generatetext(
    ['', 'moneyinput', 'moneyset'],
    ['text', 'input', 'button'],
    ['Money', '', 'set'],
    'stats-content'
  );
  generatetext(['', 'sprayset'], ['text', 'button'], ['Unlimited spray', 'set'], 'stats-content');
  generatetext(
    ['', 'bodycurrent', 'bodypick', 'bodyset'],
    ['text', 'button', 'select', 'button'],
    ['Body Size : ', '', ['Tiny', 'Small', 'Normal', 'Large'], 'set'],
    'stats-content'
  );
  generatetext(
    ['', 'bodytypecurrent', 'bodytypepick', 'bodytypeset'],
    ['text', 'button', 'select', 'button'],
    ['Natural features : ', '', ['Masculine', 'Feminine', 'Androgynous'], 'set'],
    'stats-content'
  );
  generatetext(['', 'ballsset'], ['text', 'button'], ['Balls : ', 'Remove'], 'stats-content');
  generatetext(
    ['', 'virginitypick', 'virginitycurrent', 'virginityset', 'virginpure'],
    ['text', 'select', 'button', 'button', 'button'],
    [
      'Virginity : ',
      ['anal', 'oral', 'penile', 'vaginal', 'temple', 'handholding', 'kiss'],
      '',
      'Restore',
      'pure',
    ],
    'stats-content'
  );
  generatetext(
    ['', 'sheesh', 'jk-lol'],
    ['text', 'button', 'button'],
    ['Crime', '-100', '+100'],
    'stats-content'
  );
  generatetext(
    ['', 'parasitename', 'bodyparts', 'infect', 'desinfect'],
    ['text', 'select', 'select', 'button', 'button'],
    ['Parasite', parasitename, bodyparts, 'infect', 'remove'],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');
  generatetext([''], ['header'], ['Characteristics'], 'stats-content');
  generatetext(
    ['charapick', 'charainput', 'charaset'],
    ['select', 'input', 'button'],
    [characteristics, '', 'set'],
    'stats-content'
  );
  generatetext(['', 'lactatingset'], ['text', 'button'], ['lactating : ', 'Yes'], 'stats-content');
  generatetext(
    ['', 'milkinput', 'milkset', 'milkrefil'],
    ['text', 'input', 'button', 'button'],
    ['milk volume', '', 'set', 'Refil'],
    'stats-content'
  );
  generatetext(
    ['', 'cuminput', 'cumset', 'cumrefil'],
    ['text', 'input', 'button', 'button'],
    ['cum volume', '', 'set', 'Refil'],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');
  generatetext([''], ['header'], ['Fame'], 'stats-content');
  generatetext(
    ['fame_name', 'input_fame12', 'set_fame12'],
    ['select', 'input', 'button'],
    [fame, '', 'Set'],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');
  generatetext([''], ['header'], ['School'], 'stats-content');
  generatetext(
    ['', 'select_exam', 'input_exam', 'set_exam'],
    ['text', 'select', 'input', 'button'],
    ['Exam', exam, '', 'Set'],
    'stats-content'
  );
  generatetext(
    ['', 'select_school_rep', 'input_school_rep', 'set_school_rep'],
    ['text', 'select', 'input', 'button'],
    ['School reputation', school_rep, '', 'Set'],
    'stats-content'
  );
  generatetext([''], ['newline'], [''], 'stats-content');
  generatetext([''], ['header'], ['Talent'], 'stats-content');
  generatetext(
    ['', 'select_talent', 'input_talent', 'set_talent'],
    ['text', 'select', 'input', 'button'],
    ['Talent', talent_skill, '', 'Set'],
    'stats-content'
  );
  generatetext(
    ['', 'select_hentai_skill', 'input_hentai_skill', 'set_hentai_skill'],
    ['text', 'select', 'input', 'button'],
    ['Ero Talent', hentaiSkill, '', 'Set'],
    'stats-content'
  );
}

export function buildMiscSection(context) {
  const {
    generatetext,
    data: { animals, babyOptions, npcnamelist, npctrait },
  } = context;

  generatetext([''], ['header'], ['NPC'], 'misc-content');
  generatetext(
    ['', 'npcnames', 'npctraits', 'npcchangeinput', 'changetraitbro'],
    ['text', 'select', 'select', 'input', 'button'],
    ['NPC manager', npcnamelist, npctrait, '', 'Set'],
    'misc-content'
  );
  generatetext(
    ['', 'max_harmony', 'max_Ferocity'],
    ['text', 'button', 'button'],
    ['wolfpack', 'max harmony', 'max Ferocity'],
    'misc-content'
  );
  generatetext([''], ['newline'], [''], 'misc-content');
  generatetext([''], ['header'], ['Pregnancy Manager'], 'misc-content');
  generatetext(
    ['', 'pregnancy_manager_time_tooltip'],
    ['header', 'tooltip'],
    ['Pregnancy time', 'day'],
    'misc-content'
  );
  generatetext(
    [
      '',
      'named_npc_pregnancy_manager',
      'named_npc_pregnancy_input',
      'named_npc_pregnancy_toggle',
      'named_npc_pregnancy_set',
    ],
    ['text', 'select', 'input', 'checkbox', 'button'],
    ['Named NPC', ['placeholder'], '', 'lock preg', 'Set'],
    'misc-content'
  );
  generatetext(
    [
      '',
      'npc_pregnancy_manager',
      'npc_pregnancy_input',
      'npc_pregnancy_toggle',
      'npc_pregnancy_set',
    ],
    ['text', 'select', 'input', 'checkbox', 'button'],
    ['NPC', ['placeholder'], '', 'lock preg', 'Set'],
    'misc-content'
  );
}
