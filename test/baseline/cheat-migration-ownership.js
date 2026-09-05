import { legacyCheatInventory } from './legacy-cheat-inventory.js';

const PLAYER_DOMAIN_ACTIONS = new Set([
  'hesoyam',
  'kill_player',
  'statset',
  'sprayset',
  'bodytypeset',
  'ballsset',
  'virginityset',
  'virginpure',
  'sheesh',
  'jk-lol',
  'infect',
  'desinfect',
  'charaset',
  'lactatingset',
  'milkset',
  'milkrefil',
  'cumset',
  'cumrefil',
]);

const QUICK_ONE_SHOT_ACTIONS = new Set([
  'arousal_player',
  'arousal_enemy',
  'enemycalm',
  'kill_enemy',
  'vow-virgin',
  'clean_cum',
  'dirty_cum',
  'clean_cum_uretus',
  'in_game_cheat',
  'alt_cheat',
  'randomEncounterSet',
]);

const QUICK_DAILY_TOGGLE_ACTIONS = new Set([
  'maxanimaltask',
  'edenshrooms',
  'edengarden',
  'edenspring',
  'edentimer',
  'invinityNPCPregnancy',
]);

const QUICK_FRAME_TOGGLE_ACTIONS = new Set([
  'unlicum',
  'virginity',
  'purity',
  'everyone_horny',
  'farm_safe',
  'intenseCum',
  'invincibleAngel',
  'interact_child',
  'pregnancy_detection',
  'allNPCInstaPregnant',
  'allNPCMultiplePregnancy',
]);

const STATS_EDITOR_ACTIONS = new Set([
  'statsete',
  'set_fame12',
  'set_exam',
  'set_school_rep',
  'set_talent',
  'set_hentai_skill',
]);

const PREGNANCY_OFFSPRING_ACTIONS = new Set([
  'mc_pregnancy_set',
  'mc_tentacle_set',
  'mc_baby_set',
  'mc_abortion_set',
  'named_npc_abortion_set',
  'npc_abortion_set',
  'npc_abortion_purge',
  'purgeNPCBaby',
]);

const FARM_MOD_ACTIONS = new Set([
  'set_animal_like',
  'set_build_time',
  'set_assault_time',
  'check_fruit_selling',
  'VrelCoinsUsage',
]);

function candidateEvidence(entry, candidateDescriptorId) {
  if (!candidateDescriptorId) return '';
  if (PLAYER_DOMAIN_ACTIONS.has(entry.id)) return 'test/parity/player-domain-production.test.js';
  if (QUICK_ONE_SHOT_ACTIONS.has(entry.id)) return 'test/parity/quick-one-shot-production.test.js';
  if (QUICK_DAILY_TOGGLE_ACTIONS.has(entry.id))
    return 'test/parity/quick-daily-toggle-production.test.js';
  if (QUICK_FRAME_TOGGLE_ACTIONS.has(entry.id))
    return 'test/parity/quick-frame-toggle-production.test.js';
  if (STATS_EDITOR_ACTIONS.has(entry.id))
    return 'test/parity/stats-editor-production.test.js';
  if (entry.id === 'max_Ferocity') return 'test/parity/misc-visible-production.test.js';
  if (PREGNANCY_OFFSPRING_ACTIONS.has(entry.id))
    return 'test/parity/pregnancy-offspring-production.test.js';
  if (FARM_MOD_ACTIONS.has(entry.id))
    return 'test/parity/farm-mod-tools-production.test.js';
  if (entry.id === 'testAll') return 'test/integration/diagnostics-production.test.js';
  if (['named_npc_pregnancy_set', 'npc_pregnancy_set'].includes(entry.id))
    return 'test/parity/pregnancy-manager-production.test.js';
  if (['unliarousal', 'maxchruchtask'].includes(entry.id))
    return 'test/integration/cheat-toggle-runtime-production.test.js';
  if (entry.id === 'changetraitbro') return 'test/integration/cheat-refresh-binding.test.js';
  return 'test/parity/vertical-slice-production.test.js';
}

function legacyOwnership(entry) {
  const pocParityEvidence = ['moneyset', 'unliarousal'].includes(entry.id)
    ? 'test/parity/legacy-descriptor-parity.test.js'
    : '';
  const candidates = {
    moneyset: 'player.money',
    bodyset: 'player.body-size',
    max_harmony: 'world.max-harmony',
    max_Ferocity: 'world.max-harmony',
    changetraitbro: 'world.npc-trait-editor',
    unliarousal: 'player.infinite-arousal',
    maxchruchtask: 'world.maximum-church-tasks',
    VrelCoinsUsage: 'world.vrel-coins-usage',
    hesoyam: 'quick.player-state',
    kill_player: 'quick.player-state',
    statset: 'player.stats',
    statsete: 'player.enemy-stats',
    sprayset: 'player.unlimited-spray',
    bodytypeset: 'player.body-type',
    ballsset: 'player.balls',
    virginityset: 'player.virginity',
    virginpure: 'player.virginity',
    sheesh: 'player.crime',
    'jk-lol': 'player.crime',
    infect: 'player.parasites',
    desinfect: 'player.parasites',
    charaset: 'player.characteristics',
    lactatingset: 'player.lactation',
    milkset: 'player.milk',
    milkrefil: 'player.milk',
    cumset: 'player.cum',
    cumrefil: 'player.cum',
    set_fame12: 'player.fame',
    set_exam: 'player.exam',
    set_school_rep: 'player.school-reputation',
    set_talent: 'player.talent',
    set_hentai_skill: 'player.hentai-skill',
    set_animal_like: 'world.farm-animal-affinity',
    set_build_time: 'world.farm-build-time',
    set_assault_time: 'world.farm-assault-time',
    check_fruit_selling: 'world.produce-sales-report',
    testAll: 'developer.run-diagnostics',
    mc_pregnancy_set: 'world.mc-pregnancy',
    mc_tentacle_set: 'world.mc-tentacle',
    mc_baby_set: 'world.mc-child-manager',
    mc_abortion_set: 'world.mc-abortion',
    named_npc_abortion_set: 'world.named-npc-abortion',
    npc_abortion_set: 'world.stored-npc-abortion',
    npc_abortion_purge: 'world.stored-npc-abortion',
    purgeNPCBaby: 'world.mc-child-manager',
    named_npc_pregnancy_set: 'world.named-npc-pregnancy',
    npc_pregnancy_set: 'world.stored-npc-pregnancy',
    arousal_player: 'quick.arousal',
    arousal_enemy: 'quick.arousal',
    enemycalm: 'quick.enemy-state',
    kill_enemy: 'quick.enemy-state',
    'vow-virgin': 'quick.temple-vow',
    clean_cum: 'quick.hygiene',
    dirty_cum: 'quick.hygiene',
    clean_cum_uretus: 'quick.hygiene',
    in_game_cheat: 'quick.game-cheats',
    alt_cheat: 'quick.game-cheats',
    randomEncounterSet: 'quick.random-encounters',
    maxanimaltask: 'quick.maximum-stray-tasks',
    edenshrooms: 'quick.eden-mushrooms',
    edengarden: 'quick.eden-garden',
    edenspring: 'quick.eden-spring',
    edentimer: 'quick.eden-timer',
    invinityNPCPregnancy: 'quick.infinite-npc-pregnancy',
    unlicum: 'quick.unlimited-cum',
    virginity: 'quick.maintain-virginity',
    purity: 'quick.maintain-purity',
    everyone_horny: 'quick.everyone-horny',
    farm_safe: 'quick.farm-safety',
    intenseCum: 'quick.intense-cum',
    invincibleAngel: 'quick.invincible-angel',
    interact_child: 'quick.auto-child-interaction',
    pregnancy_detection: 'quick.pregnancy-detection',
    allNPCInstaPregnant: 'quick.maximum-npc-pregnancy-rate',
    allNPCMultiplePregnancy: 'quick.multiple-npc-pregnancies',
  };
  const candidateDescriptorId = candidates[entry.id] ?? '';
  const descriptorActive = Boolean(candidateDescriptorId);
  const evidence = candidateEvidence(entry, candidateDescriptorId);
  return Object.freeze({
    id: entry.id,
    legacyActive: !descriptorActive,
    descriptorActive,
    descriptorId: candidateDescriptorId,
    coexistence: null,
    parityEvidence: evidence,
    pocParityEvidence,
    candidateDescriptorId,
    candidateEvidence: evidence,
    discoveredBugs: Object.freeze(
      entry.id === 'named_npc_pregnancy_set'
        ? [
            Object.freeze({
              id: 'named-npc-unlock-clears-shared-schedule',
              regressionTest: 'test/parity/pregnancy-manager-production.test.js',
            }),
          ]
        : []
    ),
  });
}

export const cheatMigrationOwnership = Object.freeze(legacyCheatInventory.map(legacyOwnership));

function requireText(value, message) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(message);
}

export function validateCheatMigrationOwnership(entries, { expectedIds = [] } = {}) {
  if (!Array.isArray(entries)) throw new TypeError('Migration ownership must be an array.');
  const byId = new Map();

  for (const entry of entries) {
    requireText(entry?.id, 'Migration ownership entry requires an id.');
    if (byId.has(entry.id)) throw new Error(`Duplicate migration ownership id "${entry.id}".`);
    byId.set(entry.id, entry);

    const legacyActive = entry.legacyActive === true;
    const descriptorActive = entry.descriptorActive === true;
    if (!legacyActive && !descriptorActive) {
      throw new Error(`Cheat "${entry.id}" has no active implementation owner.`);
    }
    if (legacyActive && descriptorActive) {
      if (!entry.coexistence || typeof entry.coexistence !== 'object') {
        throw new Error(`Cheat "${entry.id}" has two owners without a coexistence exception.`);
      }
      requireText(entry.coexistence.reason, `Cheat "${entry.id}" coexistence requires a reason.`);
      requireText(
        entry.coexistence.removeLegacyAfter,
        `Cheat "${entry.id}" coexistence requires a legacy removal gate.`
      );
    } else if (entry.coexistence != null) {
      throw new Error(`Cheat "${entry.id}" has a coexistence exception without two owners.`);
    }

    if (descriptorActive) {
      requireText(entry.descriptorId, `Cheat "${entry.id}" descriptor owner requires an id.`);
      requireText(
        entry.parityEvidence,
        `Cheat "${entry.id}" descriptor owner requires parity or intent evidence.`
      );
    }

    if (!Array.isArray(entry.discoveredBugs)) {
      throw new Error(`Cheat "${entry.id}" discoveredBugs must be an array.`);
    }
    if (Boolean(entry.candidateDescriptorId) !== Boolean(entry.candidateEvidence)) {
      throw new Error(
        `Cheat "${entry.id}" descriptor candidate requires id and evidence together.`
      );
    }
    for (const bug of entry.discoveredBugs) {
      requireText(bug?.id, `Cheat "${entry.id}" discovered bug requires an id.`);
      requireText(
        bug?.regressionTest,
        `Cheat "${entry.id}" bug "${bug?.id ?? 'unknown'}" requires a regression test.`
      );
    }
  }

  const expected = new Set(expectedIds);
  const missing = [...expected].filter((id) => !byId.has(id));
  const unexpected = [...byId.keys()].filter((id) => !expected.has(id));
  if (missing.length || unexpected.length) {
    throw new Error(
      `Migration ownership inventory mismatch; missing=[${missing.join(
        ','
      )}], unexpected=[${unexpected.join(',')}].`
    );
  }
  return Object.freeze({ total: byId.size });
}
