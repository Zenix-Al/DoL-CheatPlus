import { createPlayerBodyActions } from './player-body-actions.js';
import { createPlayerProgressionActions } from './player-progression-actions.js';
import { createPlayerStatsActions } from './player-stats-actions.js';

const playerActions = {
  ...createPlayerStatsActions(),
  ...createPlayerBodyActions(),
  ...createPlayerProgressionActions(),
};

export default playerActions;
