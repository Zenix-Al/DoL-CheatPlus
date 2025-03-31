// Initialize CheatPlus storage with default values
function initStorage() {
  const cheatPlus = (SugarCube.State.variables.cheatPlus ??= {
    angel: "",
    toggles: {},
    storedNPCs: {},
    storedNPCsDate: 0,
    orgasmCount: 0,
  });

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
