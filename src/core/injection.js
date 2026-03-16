import {
  GAME_VERSION_ELEMENT_ID,
  INJECTION_STATE_KEY,
  SHADOW_HOST_ID,
} from '../constants/index.js';
import { getRuntimeWindow } from './global-bridge.js';

function getInjectionState() {
  if (!globalThis[INJECTION_STATE_KEY]) {
    globalThis[INJECTION_STATE_KEY] = {
      started: false,
      ready: false,
    };
  }
  return globalThis[INJECTION_STATE_KEY];
}

function waitForCondition(check, { intervalMs = 50, timeoutMs = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    if (check()) {
      resolve();
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (check()) {
        clearInterval(timer);
        resolve();
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        clearInterval(timer);
        reject(new Error('Injection prerequisites timed out.'));
      }
    }, intervalMs);
  });
}

function hasCorePrerequisites() {
  const runtimeWindow = getRuntimeWindow();
  return Boolean(
    runtimeWindow?.SugarCube?.State?.variables || globalThis.SugarCube?.State?.variables
  );
}

function hasRuntimePrerequisites() {
  const runtimeWindow = getRuntimeWindow();
  const sugarCube = runtimeWindow?.SugarCube || globalThis.SugarCube;
  return Boolean(
    hasCorePrerequisites() &&
      sugarCube?.setup?.NPCNameList &&
      document.getElementById(GAME_VERSION_ELEMENT_ID)
  );
}

import debugLog from './logger.js';

export async function startCheatInjection() {
  const state = getInjectionState();
  if (state.started) return;

  state.started = true;

  try {
    // emit initial framework-level trace (SugarCube-specific debug moved to adapter)
    try {
      debugLog('injection', 'startCheatInjection:before-mount', {
        data: { bodyPresent: !!document.body },
      });
    } catch (e) {}
    await waitForCondition(() => Boolean(document.body), { timeoutMs: 20000 });

    const { mountInterface } = await import('../ui/index.js');

    mountInterface();
    try {
      debugLog('injection', 'mountInterface() called', {
        data: { hostPresent: !!document.getElementById(SHADOW_HOST_ID) },
      });
    } catch (e) {}

    // framework-level trace after interface mount
    try {
      debugLog('injection', 'after-mount', {
        data: { sugarCubeDefined: !!(getRuntimeWindow()?.SugarCube || globalThis.SugarCube) },
      });
    } catch (e) {}

    try {
      await waitForCondition(hasRuntimePrerequisites, { timeoutMs: 30000 });
    } catch (err) {
      console.warn(
        '[CheatPlus] Runtime prerequisites not met within 30s — dumping status and retrying once with extended timeout.'
      );
      console.warn('[CheatPlus] status:', {
        sugarCubeDefined: !!(getRuntimeWindow()?.SugarCube || globalThis.SugarCube),
        sugarCubeState: !!(getRuntimeWindow()?.SugarCube?.State || globalThis.SugarCube?.State),
        sugarCubeVariables: !!(
          getRuntimeWindow()?.SugarCube?.State?.variables || globalThis.SugarCube?.State?.variables
        ),
        sugarCubeSetup: !!(getRuntimeWindow()?.SugarCube?.setup || globalThis.SugarCube?.setup),
        npcList: !!(
          getRuntimeWindow()?.SugarCube?.setup?.NPCNameList ||
          globalThis.SugarCube?.setup?.NPCNameList
        ),
        versionElement: !!document.getElementById(GAME_VERSION_ELEMENT_ID),
      });

      // One more extended wait to tolerate slower environments
      try {
        await waitForCondition(hasRuntimePrerequisites, { timeoutMs: 60000 });
      } catch {
        // Do not hard-fail when optional runtime bits are missing; continue with core readiness.
        await waitForCondition(hasCorePrerequisites, { timeoutMs: 60000 });
        console.warn(
          '[CheatPlus] Continuing with core SugarCube readiness; optional runtime fields are still missing.'
        );
      }
    }

    // ensure runtime modules that register globals are loaded
    const actionsModule = await import('../features/actions.js');
    const fetchersModule = await import('../features/fetchers/index.js');
    const cheatInitModule = await import('../features/cheat-init.js');
    const { registerGlobals: registerStorageGlobals } = await import('../services/storage.js');
    const { registerGlobals: registerListenerGlobals } = await import(
      '../features/listeners/index.js'
    );

    // Register legacy window.* globals in one explicit step — no side effects on import
    actionsModule.registerGlobals();
    fetchersModule.registerGlobals();
    cheatInitModule.registerGlobals();
    registerStorageGlobals();
    registerListenerGlobals();

    try {
      debugLog('injection', 'after-cheat-init-import');
    } catch (e) {}
    const { bootstrapCheat } = await import('../features/bootstrap.js');
    bootstrapCheat();
    try {
      debugLog('injection', 'after-bootstrap', { data: { ready: true } });
    } catch (e) {}

    state.ready = true;
  } catch (error) {
    state.started = false;
    console.error('[CheatPlus] Injection failed:', error);
  }
}
