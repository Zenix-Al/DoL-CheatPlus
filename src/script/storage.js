// Initialize CheatPlus storage with default values
function initStorage() {
  const vars = SugarCube.State.variables;

  // Step 1: Make sure cheatPlus exists
  vars.cheatPlus ??= {};

  // Step 2: Now safely initialize the inner properties
  vars.cheatPlus.angel ??= 0;
  vars.cheatPlus.angelMode ??= true;
  vars.cheatPlus.toggles ??= {};
  vars.cheatPlus.storedNPCs ??= {};
  vars.cheatPlus.storedNPCsDate ??= 0;
  vars.cheatPlus.trueDivine ??= "";
  vars.cheatPlus.orgasmCount ??= 0;
  const cheatPlus = SugarCube.State.variables.cheatPlus;

  if (SugarCube.State.variables.penisstate !== 0 || SugarCube.State.variables.vaginastate !== 0)
    return;

  cheatPlus.trueDivine =
    SugarCube.State.variables.demon > 0
      ? "demon"
      : SugarCube.State.variables.angel > 0
      ? "angel"
      : undefined;
}
initStorage();

// Reactivate Toggle States
function reactivateToggles() {
  reactivatingToggles = true;
  deactiveAllToggles();

  for (const key in SugarCube.State.variables.cheatPlus.toggles) {
    if (typeof buttonActions[key] === "function") {
      buttonActions[key]();
    } else {
      delete SugarCube.State.variables.cheatPlus.toggles[key]; // Remove invalid entries
    }
  }

  reactivatingToggles = false;
  console.clear();
}

// Deactivate all toggles from both function bundles
function deactiveAllToggles() {
  const allFunctions = { ...functionbundle, ...dailyfunctionbundle };
  for (const key in allFunctions) {
    if (typeof allFunctions[key] === "function") {
      buttonActions[key]();
    }
  }
}

reactivateToggles();
