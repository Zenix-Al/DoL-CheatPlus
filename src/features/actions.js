import debugActions from './cheat/debug-actions.js';
import playerActions from './cheat/player-actions.js';
import pregnancyActions from './cheat/pregnancy-actions.js';
import worldActions from './cheat/world-actions.js';
import toggleRuntime from './cheat/toggle-runtime.js';

// Compatibility facade for callers that still expect one object import.
// Authoring modules remain function-first and independent of `this`.
export const cheatActions = {
  ...debugActions,
  ...playerActions,
  ...pregnancyActions,
  ...worldActions,
  ...toggleRuntime,
};

// Backward compatibility alias; migrate imports to `cheatActions`.
export const mycode = cheatActions;

export default cheatActions;
