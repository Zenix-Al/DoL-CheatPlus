// Initialize CheatPlus storage with default values
export function initStorage() {
  const vars = SugarCube.State.variables;

  // Step 1: Make sure cheatPlus exists
  vars.cheatPlus ??= {};

  // Step 2: Now safely initialize the inner properties
  vars.cheatPlus.angel ??= 0;
  vars.cheatPlus.angelMode ??= true;
  vars.cheatPlus.toggles ??= {};
  vars.cheatPlus.storedNPCs ??= {};
  vars.cheatPlus.storedNPCsDate ??= 0;
  vars.cheatPlus.trueDivine ??= '';
  vars.cheatPlus.orgasmCount ??= 0;
  vars.cheatPlus.baseNpcPregnancyChance ??= SugarCube.State.variables.baseNpcPregnancyChance;
  vars.cheatPlus.unlicumMode ??= false;
  const cheatPlus = SugarCube.State.variables.cheatPlus;

  if (SugarCube.State.variables.penisstate !== 0 || SugarCube.State.variables.vaginastate !== 0)
    return;

  cheatPlus.trueDivine =
    SugarCube.State.variables.demon > 0
      ? 'demon'
      : SugarCube.State.variables.angel > 0
      ? 'angel'
      : undefined;
}

// Reactivate Toggle States
export function reactivateToggles() {
  globalThis.reactivatingToggles = true;
  deactiveAllToggles();

  for (const key in SugarCube.State.variables.cheatPlus.toggles) {
    if (typeof globalThis.buttonActions[key] === 'function') {
      globalThis.buttonActions[key]();
    } else {
      delete SugarCube.State.variables.cheatPlus.toggles[key]; // Remove invalid entries
    }
  }

  globalThis.reactivatingToggles = false;
  console.clear();
}

// Deactivate all toggles from both function bundles
function deactiveAllToggles() {
  const allFunctions = {
    ...(globalThis.functionbundle ?? {}),
    ...(globalThis.dailyfunctionbundle ?? {}),
  };
  for (const key in allFunctions) {
    if (typeof allFunctions[key] === 'function') {
      globalThis.buttonActions[key]();
    }
  }
}

export function registerGlobals() {
  window.initStorage = initStorage;
  window.reactivateToggles = reactivateToggles;
}
