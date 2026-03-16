/**
 * SugarCube state accessor.
 *
 * All reads of `SugarCube.State.*` and `SugarCube.setup.*` must go through
 * this module. Nothing outside `core/sugarcube/` may reference the
 * `SugarCube` global directly.
 *
 * Uses `getRuntimeWindow()` to handle both userscript (unsafeWindow) and
 * local-dev (globalThis) contexts.
 */
import { getRuntimeWindow } from '../global-bridge.js';

/**
 * Resolve the SugarCube engine object.
 * Returns null if not yet available.
 *
 * @returns {object | null}
 */
export function getSugarCube() {
  const rw = getRuntimeWindow();
  return rw?.SugarCube ?? globalThis.SugarCube ?? null;
}

/**
 * Returns `SugarCube.State.variables`, or null if not ready.
 *
 * @returns {Record<string, any> | null}
 */
export function getVars() {
  return getSugarCube()?.State?.variables ?? null;
}

/**
 * Returns `SugarCube.setup`, or null if not ready.
 *
 * @returns {Record<string, any> | null}
 */
export function getSetup() {
  return getSugarCube()?.setup ?? null;
}

/**
 * Returns the name of the currently rendered SugarCube passage, or null.
 *
 * @returns {string | null}
 */
export function getPassage() {
  return getVars()?.passage ?? null;
}

/**
 * Returns true when SugarCube is initialized and `State.variables` is available.
 *
 * @returns {boolean}
 */
export function isReady() {
  return Boolean(getSugarCube()?.State?.variables);
}
