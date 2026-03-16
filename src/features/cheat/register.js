/**
 * Register all CheatPlus action handlers into the central dispatcher.
 *
 * Called once from the bootstrap layer after action maps have been built.
 * Accepts the fully-constructed action maps produced by `action-maps.js` so
 * that all bound handlers (mycode methods, UI controls, etc.) are registered
 * under the same key that both legacy ID dispatch and metadata `action` fields use.
 *
 * Registration order: mainActions → buttonActions → changeActions → inputActions.
 * Later entries for the same key overwrite earlier ones — there are no duplicates
 * across maps in the current action-maps setup.
 *
 * @param {{
 *   buttonActions: Record<string, Function>,
 *   mainActions:   Record<string, Function>,
 *   changeActions: Record<string, Function>,
 *   inputActions:  Record<string, Function>,
 * }} actionMaps
 */
import { register } from '../../core/actions/dispatcher.js';

export function registerAllActions({ buttonActions, mainActions, changeActions, inputActions }) {
  const maps = [mainActions, buttonActions, changeActions, inputActions];
  let total = 0;
  maps.forEach((map) => {
    if (!map) return;
    Object.entries(map).forEach(([key, fn]) => {
      if (typeof fn === 'function') {
        register(key, fn);
        total++;
      }
    });
  });
  return total;
}
