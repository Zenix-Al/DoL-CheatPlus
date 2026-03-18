import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createTalentSection(context) {
  const {
    data: { hentaiSkill, talent_skill },
  } = context;

  return {
    afterHeader: 'Talent',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_talent',
        text: 'Talent',
        inputs: [
          { type: 'select', id: 'select_talent', options: talent_skill, action: 'select_talent' },
          { type: 'input', id: 'input_talent', coerce: 'number' },
          {
            type: 'button',
            id: 'set_talent',
            text: 'Set',
            action: 'set_talent',
            feedback: successFeedback('Talent updated'),
          },
        ],
      },
      {
        key: 'stat_hentai_talent',
        text: 'Ero Talent',
        inputs: [
          {
            type: 'select',
            id: 'select_hentai_skill',
            options: hentaiSkill,
          },
          { type: 'input', id: 'input_hentai_skill', coerce: 'number' },
          {
            type: 'button',
            id: 'set_hentai_skill',
            text: 'Set',
            action: 'set_hentai_skill',
            feedback: successFeedback('Ero talent updated'),
          },
        ],
      },
    ]),
  };
}

export default createTalentSection;
