import { register } from '../../core/actions/dispatcher.js';

import { METHOD_ACTIONS } from './action-map-methods.js';
import { BOUND_ACTIONS, NAV_ACTIONS, SIMPLE_UI_ACTIONS } from './action-map-ui.js';
import { TOGGLE_DEFINITIONS } from './action-map-toggle.js';

function registerHandler(actionKey, handler) {
  if (typeof handler === 'function') register(actionKey, handler);
}

function registerMethodAction(actionKey, cheatActions, methodName = actionKey) {
  registerHandler(actionKey, () => {
    const fn = cheatActions?.[methodName];
    if (typeof fn === 'function') fn(cheatActions);
  });
}

function registerSimpleUiAction(entry, context) {
  const {
    closeModal,
    openModal,
    cheatActions,
    executeSearch,
    Enable_cheat_history,
    Enable_sidebar_button,
    simple_cheat_button,
    init_interface,
  } = context;

  const handlers = {
    closeModal,
    openModal,
    cheatActions: () => {
      const fn = cheatActions?.[entry.arg];
      if (typeof fn === 'function') fn(cheatActions);
    },
    executeSearch: () => executeSearch(entry.arg),
    Enable_cheat_history,
    Enable_sidebar_button,
    simple_cheat_button,
    init_interface,
  };

  registerHandler(entry.actionKey, handlers[entry.target]);
}

function registerBoundAction(entry, context) {
  const sourceMap = {
    hydrateCheatUi: context.hydrateCheatUi,
    hydratePregnancy: context.hydratePregnancy,
  };
  const source = sourceMap[entry.source];
  registerHandler(entry.actionKey, source?.[entry.method]);
}

/**
 * Single registration pass for all dispatcher actions.
 * All action IDs are declared here — this is the canonical source of truth.
 */
export function registerAllActions({
  closeModal,
  openModal,
  showContent,
  getUiRefs,
  cheatActions,
  hydratePregnancy,
  hydrateCheatUi,
  hydrateQuickSection,
  hydrateStatsSection,
  hydrateMiscSection,
  Enable_cheat_history,
  Enable_sidebar_button,
  simple_cheat_button,
  executeSearch,
  init_interface,
}) {
  const context = {
    closeModal,
    openModal,
    cheatActions,
    executeSearch,
    Enable_cheat_history,
    Enable_sidebar_button,
    simple_cheat_button,
    init_interface,
    hydrateCheatUi,
    hydratePregnancy,
  };

  const showSection = (navKey, contentKey, hydrate) => {
    const uiRefs = getUiRefs();
    showContent(uiRefs?.[navKey], uiRefs?.[contentKey]);
    hydrate?.();
  };

  // --- Modal / nav ---
  const hydrateMap = {
    hydrateQuickSection,
    hydrateStatsSection,
    hydrateMiscSection,
  };
  NAV_ACTIONS.forEach(({ actionKey, navKey, contentKey, hydrateKey }) => {
    registerHandler(actionKey, () => showSection(navKey, contentKey, hydrateMap[hydrateKey]));
  });
  SIMPLE_UI_ACTIONS.forEach((entry) => registerSimpleUiAction(entry, context));

  // --- Toggle cheat actions (framework-driven definitions) ---
  TOGGLE_DEFINITIONS.forEach(({ id, label }) => {
    registerHandler(id, () => cheatActions.toggleById(id, label));
  });
  METHOD_ACTIONS.forEach(({ actionKey, methodName }) => {
    registerMethodAction(actionKey, cheatActions, methodName);
  });

  // --- Select (change) actions ---
  BOUND_ACTIONS.forEach((entry) => registerBoundAction(entry, context));
}
