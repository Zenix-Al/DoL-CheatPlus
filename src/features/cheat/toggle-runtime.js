import { createToggleEngine } from '../../core/toggle/engine.js';
import toggleState from '../../core/toggle/state-repository.js';
import { TOGGLE_DEFINITIONS } from '../listeners/action-map-toggle.js';

import { createToggleDomainActions } from './toggle-domain-actions.js';

const toggleDefinitionMap = new Map(TOGGLE_DEFINITIONS.map((entry) => [entry.id, entry]));

const domainActions = createToggleDomainActions(toggleState);

let toggleRuntime = {
  ...domainActions,
};

const engineActions = createToggleEngine(
  toggleState,
  (id) => toggleRuntime[id],
  (id) => toggleDefinitionMap.get(id)
);

toggleRuntime = {
  ...engineActions,
  ...domainActions,
  toggleActive: toggleState.toggleActive,
  toggleActiveDaily: toggleState.toggleActiveDaily,
  get toggleDeactivated() {
    return toggleState.toggleDeactivated;
  },
  set toggleDeactivated(value) {
    toggleState.toggleDeactivated = Boolean(value);
  },
};

export default toggleRuntime;
