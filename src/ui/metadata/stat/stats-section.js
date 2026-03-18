import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createStatsSection() {
  return {
    afterHeader: 'Stats',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_player_state',
        inputs: [
          {
            type: 'button',
            id: 'hesoyam',
            text: 'Recover',
            action: 'hesoyam',
            feedback: successFeedback('Player recovered'),
          },
          {
            type: 'button',
            id: 'kill_player',
            text: 'Ruin',
            action: 'kill_player',
            feedback: successFeedback('Player ruined'),
          },
        ],
      },
      {
        key: 'stat_player_values',
        inputs: [
          {
            type: 'select',
            id: 'statpick',
            options: [
              'pain',
              'arousal',
              'tiredness',
              'stress',
              'trauma',
              'control',
              'drunk',
              'drugged',
              'hallucinogen',
            ],
            action: 'statpick',
          },
          { type: 'input', id: 'statinput', coerce: 'number' },
          {
            type: 'button',
            id: 'statset',
            text: 'set',
            action: 'statset',
            feedback: successFeedback('Player stat updated'),
          },
        ],
      },
    ]),
  };
}

export default createStatsSection;
