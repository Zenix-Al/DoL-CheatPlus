import debugLog from '../logger.js';
import { getRuntimeWindow } from '../global-bridge.js';
import { GAME_VERSION_ELEMENT_ID, SHADOW_HOST_ID } from '../../constants/index.js';

function collectStatus() {
  const runtimeWindow = getRuntimeWindow();
  const sugarCube = runtimeWindow?.SugarCube || globalThis.SugarCube;
  return {
    time: new Date().toISOString(),
    sugarCubeDefined: !!sugarCube,
    sugarCubeState: !!sugarCube?.State,
    sugarCubeVariables: !!sugarCube?.State?.variables,
    sugarCubeSetup: !!sugarCube?.setup,
    npcList: !!sugarCube?.setup?.NPCNameList,
    versionElement: !!document.getElementById(GAME_VERSION_ELEMENT_ID),
    hostPresent: !!document.getElementById(SHADOW_HOST_ID),
  };
}

export function installDebug() {
  if (globalThis.CheatPlusDebug) return globalThis.CheatPlusDebug;

  const debug = {
    last: null,
    dump(name = 'init') {
      const status = collectStatus();
      const payload = { name, status };
      debug.last = payload;
      // Primary: log to console via central logger
      try {
        debugLog('CheatPlusDebug', `dump:${name}`, { data: payload, level: 'log' });
      } catch (e) {
        try {
          console.info('[CheatPlus][Debug]', payload);
        } catch (e2) {}
      }

      // Best-effort: copy to clipboard if available, but DO NOT write into page DOM by default
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
        }
      } catch (e) {}

      return debug;
    },
  };

  globalThis.CheatPlusDebug = debug;
  return debug;
}

export default installDebug;
