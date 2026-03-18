import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createEnemySection() {
  return {
    afterHeader: 'Enemy stats',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_enemy_state',
        inputs: [
          {
            type: 'button',
            id: 'enemycalm',
            text: 'Recover',
            action: 'enemycalm',
            feedback: successFeedback('Enemy recovered'),
          },
          {
            type: 'button',
            id: 'kill_enemy',
            text: 'Ruin',
            action: 'kill_enemy',
            feedback: successFeedback('Enemy ruined'),
          },
        ],
      },
      {
        key: 'stat_enemy_values',
        inputs: [
          {
            type: 'select',
            id: 'statpicke',
            options: ['enemyhealth', 'enemytrust', 'enemyanger'],
            action: 'statpicke',
          },
          { type: 'input', id: 'statinpute', coerce: 'number' },
          {
            type: 'button',
            id: 'statsete',
            text: 'set',
            action: 'statsete',
            feedback: successFeedback('Enemy stat updated'),
          },
        ],
      },
    ]),
  };
}

export default createEnemySection;
