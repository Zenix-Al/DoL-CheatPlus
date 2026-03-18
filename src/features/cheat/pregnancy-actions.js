import {
  named_npc_pregnancy_locked,
  named_npc_pregnancy_locked_day,
  npc_pregnancy_locked,
  npc_pregnancy_locked_day,
  mc_pregnancy_locked,
  mc_pregnancy_locked_hole,
  mc_pregnancy_locked_type,
  mc_pregnancy_locked_day,
} from './pregnancy-lock-state.js';
import { createPregnancyAbortionActions } from './pregnancy-abortion-actions.js';
import { createPregnancyManagerActions } from './pregnancy-manager-actions.js';

const locks = {
  named_npc_pregnancy_locked,
  named_npc_pregnancy_locked_day,
  npc_pregnancy_locked,
  npc_pregnancy_locked_day,
  mc_pregnancy_locked,
  mc_pregnancy_locked_hole,
  mc_pregnancy_locked_type,
  mc_pregnancy_locked_day,
};

let pregnancyActions = {
  ...locks,
};

pregnancyActions = {
  ...pregnancyActions,
  ...createPregnancyManagerActions({ actionBagRef: () => pregnancyActions, locks }),
  ...createPregnancyAbortionActions(),
};

export default pregnancyActions;
