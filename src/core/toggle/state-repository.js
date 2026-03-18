const toggleState = {
  toggleActive: {},
  toggleActiveDaily: {},
  toggleDeactivated: false,
  checkArrayThreshold: 0,
  initNPCinstapreg: false,
  tmpArousal: 0,
  orgasmdown: 0,
};

export function getToggleState() {
  return toggleState;
}

export function clearActiveToggles() {
  for (const key in toggleState.toggleActive) {
    delete toggleState.toggleActive[key];
  }
}

export default toggleState;
