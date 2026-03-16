import debugActions from './cheat/debug-actions.js';
import playerActions from './cheat/player-actions.js';
import pregnancyActions from './cheat/pregnancy-actions.js';
import worldActions from './cheat/world-actions.js';
import toggleRuntime from './cheat/toggle-runtime.js';

export const mycode = Object.assign(
  globalThis.mycode ?? {},
  debugActions,
  playerActions,
  pregnancyActions,
  worldActions,
  toggleRuntime
);

export function registerGlobals() {
  globalThis.mycode = mycode;
}

export default mycode;
