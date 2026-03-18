import { createToggleDomainBasicActions } from './toggle-domain-basic-actions.js';
import { createToggleDomainPregnancyActions } from './toggle-domain-pregnancy-actions.js';
import { createToggleDomainStatusActions } from './toggle-domain-status-actions.js';

export function createToggleDomainActions(toggleState) {
  let domainActions = {};

  domainActions = {
    ...createToggleDomainBasicActions(toggleState),
    ...createToggleDomainPregnancyActions(toggleState, () => domainActions),
    ...createToggleDomainStatusActions(toggleState),
  };

  return domainActions;
}

export default createToggleDomainActions;
