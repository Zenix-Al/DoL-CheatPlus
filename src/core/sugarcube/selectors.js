/**
 * SugarCube selectors — typed, named read/write accessors for game-engine values.
 *
 * These selectors sit at the adapter boundary: they are the only permitted
 * interface between generic feature/service modules and the engine state.
 * No code outside `core/sugarcube/` may call `SugarCube.*` directly.
 *
 * Rule: each selector uses `getVars()` / `getSetup()` from `./state.js`,
 * never the bare `SugarCube` global.
 */
import { getVars, getSetup } from './state.js';

// ---------------------------------------------------------------------------
// Generic accessor pair (fallback for ad-hoc keys not yet named below)
// ---------------------------------------------------------------------------

/**
 * Read any top-level `State.variables` key.
 * @param {string} key
 * @returns {any}
 */
export function getVariable(key) {
  return getVars()?.[key];
}

/**
 * Write any top-level `State.variables` key.
 * @param {string} key
 * @param {any}    value
 */
export function setVariable(key, value) {
  const vars = getVars();
  if (vars) vars[key] = value;
}

/**
 * Read any key from `SugarCube.setup`.
 * @param {string} key
 * @returns {any}
 */
export function getSetupKey(key) {
  return getSetup()?.[key];
}

// ---------------------------------------------------------------------------
// NPC / character selectors
// ---------------------------------------------------------------------------

/** @returns {any[] | null} Named NPC list (`setup.NPCNameList`) */
export function getNPCNameList() {
  return getSetup()?.NPCNameList ?? null;
}

/** @returns {any[] | null} `State.variables.NPCName` */
export function getNPCName() {
  return getVars()?.NPCName ?? null;
}

/** @returns {Record<string, any> | null} `State.variables.storedNPCs` */
export function getStoredNPCs() {
  return getVars()?.storedNPCs ?? null;
}

// ---------------------------------------------------------------------------
// Player selectors
// ---------------------------------------------------------------------------

/** @returns {Record<string, any> | null} `State.variables.player` */
export function getPlayer() {
  return getVars()?.player ?? null;
}

/** @returns {number} `State.variables.money` (0 if absent) */
export function getMoney() {
  return getVars()?.money ?? 0;
}

/** @returns {Record<string, any> | null} `State.variables.crime` */
export function getCrime() {
  return getVars()?.crime ?? null;
}

/** @returns {Record<string, any> | null} `State.variables.sexStats` */
export function getSexStats() {
  return getVars()?.sexStats ?? null;
}

// ---------------------------------------------------------------------------
// CheatPlus persistent storage (lives inside State.variables.cheatPlus)
// ---------------------------------------------------------------------------

/** @returns {Record<string, any> | null} `State.variables.cheatPlus` */
export function getCheatPlus() {
  return getVars()?.cheatPlus ?? null;
}

/**
 * Ensure `State.variables.cheatPlus` exists and return it.
 * Safe to call before `initStorage()`.
 * @returns {Record<string, any>}
 */
export function ensureCheatPlus() {
  const vars = getVars();
  if (!vars) return {};
  if (!vars.cheatPlus) vars.cheatPlus = {};
  return vars.cheatPlus;
}

// ---------------------------------------------------------------------------
// World / environment selectors
// ---------------------------------------------------------------------------

/** @returns {Record<string, any> | null} `State.variables.farm` */
export function getFarm() {
  return getVars()?.farm ?? null;
}

/** @returns {Record<string, any> | null} `State.variables.children` */
export function getChildren() {
  return getVars()?.children ?? null;
}

/** @returns {Record<string, any> | null} `State.variables.container` */
export function getContainer() {
  return getVars()?.container ?? null;
}
