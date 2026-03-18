import { createRowsFromSettingDefs } from '../factory.js';
import { successFeedback } from '../feedback-presets.js';

export function createPlayerSection(context) {
  const {
    data: { bodyparts, parasitename },
  } = context;

  return {
    afterHeader: 'Player',
    rows: createRowsFromSettingDefs([
      {
        key: 'stat_money',
        text: 'Money',
        inputs: [
          {
            type: 'input',
            id: 'moneyinput',
            binding: { path: 'money', required: true, onMissing: 'mark-section-broken' },
            defaultValue: 0,
            coerce: 'number',
          },
          {
            type: 'button',
            id: 'moneyset',
            text: 'set',
            action: 'moneyset',
            feedback: successFeedback('Money updated'),
          },
        ],
      },
      {
        key: 'stat_spray',
        text: 'Unlimited spray',
        inputs: [
          {
            type: 'button',
            id: 'sprayset',
            text: 'set',
            action: 'sprayset',
            feedback: successFeedback('Unlimited spray enabled'),
          },
        ],
      },
      {
        key: 'stat_body',
        text: 'Body Size : ',
        inputs: [
          { type: 'button', id: 'bodycurrent', text: '' },
          {
            type: 'select',
            id: 'bodypick',
            options: ['Tiny', 'Small', 'Normal', 'Large'],
          },
          {
            type: 'button',
            id: 'bodyset',
            text: 'set',
            action: 'bodyset',
            feedback: successFeedback('Body size updated'),
          },
        ],
      },
      {
        key: 'stat_bodytype',
        text: 'Natural features : ',
        inputs: [
          { type: 'button', id: 'bodytypecurrent', text: '' },
          {
            type: 'select',
            id: 'bodytypepick',
            options: ['Masculine', 'Feminine', 'Androgynous'],
          },
          {
            type: 'button',
            id: 'bodytypeset',
            text: 'set',
            action: 'bodytypeset',
            feedback: successFeedback('Body type updated'),
          },
        ],
      },
      {
        key: 'stat_balls',
        text: 'Balls : ',
        inputs: [
          {
            type: 'button',
            id: 'ballsset',
            text: 'Remove',
            action: 'ballsset',
            feedback: successFeedback('Balls removed'),
          },
        ],
      },
      {
        key: 'stat_virginity',
        text: 'Virginity : ',
        inputs: [
          {
            type: 'select',
            id: 'virginitypick',
            options: ['anal', 'oral', 'penile', 'vaginal', 'temple', 'handholding', 'kiss'],
          },
          { type: 'button', id: 'virginitycurrent', text: '' },
          {
            type: 'button',
            id: 'virginityset',
            text: 'Restore',
            action: 'virginityset',
            feedback: successFeedback('Virginity restored'),
          },
          {
            type: 'button',
            id: 'virginpure',
            text: 'pure',
            action: 'virginpure',
            feedback: successFeedback('Purity applied'),
          },
        ],
      },
      {
        key: 'stat_crime',
        text: 'Crime',
        inputs: [
          {
            type: 'button',
            id: 'sheesh',
            text: '-100',
            action: 'sheesh',
            feedback: successFeedback('Crime reduced'),
          },
          {
            type: 'button',
            id: 'jk-lol',
            text: '+100',
            action: 'jk-lol',
            feedback: successFeedback('Crime increased'),
          },
        ],
      },
      {
        key: 'stat_parasite',
        text: 'Parasite',
        inputs: [
          { type: 'select', id: 'parasitename', options: parasitename },
          { type: 'select', id: 'bodyparts', options: bodyparts },
          {
            type: 'button',
            id: 'infect',
            text: 'infect',
            action: 'infect',
            feedback: successFeedback('Parasite infected'),
          },
          {
            type: 'button',
            id: 'desinfect',
            text: 'remove',
            action: 'desinfect',
            feedback: successFeedback('Parasite removed'),
          },
        ],
      },
    ]),
  };
}

export default createPlayerSection;
