import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createSchoolSection(context) {
  const {
    data: { exam, school_rep },
  } = context;

  return {
    afterHeader: 'School',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_school_exam',
        text: 'Exam',
        inputs: [
          { type: 'select', id: 'select_exam', options: exam, action: 'select_exam' },
          { type: 'input', id: 'input_exam', coerce: 'number' },
          {
            type: 'button',
            id: 'set_exam',
            text: 'Set',
            action: 'set_exam',
            feedback: successFeedback('Exam updated'),
          },
        ],
      },
      {
        key: 'stat_school_rep',
        text: 'School reputation',
        inputs: [
          {
            type: 'select',
            id: 'select_school_rep',
            options: school_rep,
            action: 'select_school_rep',
          },
          { type: 'input', id: 'input_school_rep', coerce: 'number' },
          {
            type: 'button',
            id: 'set_school_rep',
            text: 'Set',
            action: 'set_school_rep',
            feedback: successFeedback('School reputation updated'),
          },
        ],
      },
    ]),
  };
}

export default createSchoolSection;
