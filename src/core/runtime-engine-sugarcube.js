import { GAME_VERSION_ELEMENT_ID } from '../constants/ui.js';

import { getRuntimeWindow } from './global-bridge.js';
import { defaultRuntimeObserverPolicy } from './runtime-observer-policy.js';
import { scAdapter } from './sugarcube/adapter.js';

export function hasSugarCubeCorePrerequisites() {
  const runtimeWindow = getRuntimeWindow();
  return Boolean(runtimeWindow?.SugarCube && scAdapter.isReady());
}

export function hasSugarCubeRuntimePrerequisites() {
  const setup = scAdapter.getSetup();
  return Boolean(
    hasSugarCubeCorePrerequisites() &&
      Array.isArray(setup?.NPCNameList) &&
      document.getElementById(GAME_VERSION_ELEMENT_ID)
  );
}

export function describeSugarCubePrerequisiteState() {
  const runtimeWindow = getRuntimeWindow();
  const sugarCube = runtimeWindow?.SugarCube;

  return {
    sugarCubeDefined: Boolean(sugarCube),
    sugarCubeState: Boolean(sugarCube?.State),
    sugarCubeVariables: Boolean(sugarCube?.State?.variables),
    sugarCubeSetup: Boolean(sugarCube?.setup),
    npcList: Array.isArray(sugarCube?.setup?.NPCNameList),
    versionElement: Boolean(document.getElementById(GAME_VERSION_ELEMENT_ID)),
  };
}

export const sugarcubeRuntimeEngine = Object.freeze({
  id: 'sugarcube',
  label: 'SugarCube',
  detect() {
    return Boolean(getRuntimeWindow()?.SugarCube);
  },
  adapter: scAdapter,
  observerPolicy: defaultRuntimeObserverPolicy,
  hasCorePrerequisites: hasSugarCubeCorePrerequisites,
  hasRuntimePrerequisites: hasSugarCubeRuntimePrerequisites,
  describePrerequisiteState: describeSugarCubePrerequisiteState,
});

export default sugarcubeRuntimeEngine;
