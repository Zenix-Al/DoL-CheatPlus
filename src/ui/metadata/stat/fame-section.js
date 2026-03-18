import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createFameSection(context) {
  const {
    data: { fame },
  } = context;

  return {
    afterHeader: 'Fame',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_fame',
        inputs: [
          { type: 'select', id: 'fame_name', options: fame, action: 'fame_name' },
          { type: 'input', id: 'input_fame12', coerce: 'number' },
          {
            type: 'button',
            id: 'set_fame12',
            text: 'Set',
            action: 'set_fame12',
            feedback: successFeedback('Fame updated'),
          },
        ],
      },
    ]),
  };
}

export default createFameSection;
