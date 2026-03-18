import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createCharacteristicsSection(context) {
  const {
    data: { characteristics },
  } = context;

  return {
    afterHeader: 'Characteristics',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_characteristics',
        inputs: [
          { type: 'select', id: 'charapick', options: characteristics, action: 'charapick' },
          { type: 'input', id: 'charainput', coerce: 'number' },
          {
            type: 'button',
            id: 'charaset',
            text: 'set',
            action: 'charaset',
            feedback: successFeedback('Characteristic updated'),
          },
        ],
      },
      {
        key: 'stat_lactating',
        text: 'lactating : ',
        inputs: [
          {
            type: 'button',
            id: 'lactatingset',
            text: 'Yes',
            action: 'lactatingset',
            feedback: successFeedback('Lactation enabled'),
          },
        ],
      },
      {
        key: 'stat_milk',
        text: 'milk volume',
        inputs: [
          { type: 'input', id: 'milkinput', coerce: 'number' },
          {
            type: 'button',
            id: 'milkset',
            text: 'set',
            action: 'milkset',
            feedback: successFeedback('Milk volume updated'),
          },
          {
            type: 'button',
            id: 'milkrefil',
            text: 'Refil',
            action: 'milkrefil',
            feedback: successFeedback('Milk refilled'),
          },
        ],
      },
      {
        key: 'stat_cum',
        text: 'cum volume',
        inputs: [
          { type: 'input', id: 'cuminput', coerce: 'number' },
          {
            type: 'button',
            id: 'cumset',
            text: 'set',
            action: 'cumset',
            feedback: successFeedback('Cum volume updated'),
          },
          {
            type: 'button',
            id: 'cumrefil',
            text: 'Refil',
            action: 'cumrefil',
            feedback: successFeedback('Cum refilled'),
          },
        ],
      },
    ]),
  };
}

export default createCharacteristicsSection;
