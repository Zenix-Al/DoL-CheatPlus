import { getPcPregnant, getTotalNpcPregnant } from '../../core/runtime-state.js';
import { getNPCName, getVariable, getVariablePath } from '../../core/sugarcube/adapter.js';
import {
  getUi,
  setText,
  setValue,
  syncInputFromSelect,
  withElements,
} from '../../ui/helpers/hydrate-utils.js';

export function setButtonText(id, text) {
  setText(id, text, { hideWhenEmpty: true });
}

export function statpick() {
  syncInputFromSelect({
    selectId: 'statpick',
    inputId: 'statinput',
    readValue: (key) => getVariable(key),
  });
}

export function statpicke() {
  syncInputFromSelect({
    selectId: 'statpicke',
    inputId: 'statinpute',
    readValue: (key) => getVariable(key),
  });
}

export function spraystate() {
  setButtonText('sprayset', getVariable('infinitespray') == 1 ? 'unset' : 'set');
}

export function bodycurrent() {
  const sizeNames = ['Tiny', 'Small', 'Normal', 'Large'];
  setButtonText('bodycurrent', sizeNames[getVariable('bodysize')] || 'Unknown');
}

export function bodytypecurrent() {
  const genderMap = { m: 'Masculine', f: 'Feminine', a: 'Androgynous' };
  setButtonText('bodytypecurrent', genderMap[getVariablePath('player.gender_body')] || 'Unknown');
}

export function ballscurrent() {
  getVariablePath('player.ballsExist')
    ? setButtonText('ballsset', 'remove')
    : setButtonText('ballsset', 'add');
}

export function virginitycurrent() {
  const pick = getUi('virginitypick');
  if (!pick) return;
  getVariablePath(`player.virginity.${pick.value}`)
    ? setButtonText('virginitycurrent', 'pure')
    : setButtonText('virginitycurrent', 'taken');
}

export function crimecurrent() {
  const crime = getVariable('crime');
  if (!crime) return;
  let total = 0;
  for (const key in crime) {
    if (key !== 'events') total += crime[key].current;
  }
  setButtonText('crimecurrent', total);
}

export function vowcurrent() {
  setButtonText('vow-virgin', getVariablePath('player.virginity.temple') ? 'Virgin' : 'Not Virgin');
}

export function characurrent() {
  syncInputFromSelect({
    selectId: 'charapick',
    inputId: 'charainput',
    readValue: (key) => getVariable(key),
  });
}

export function lactatingcurrent() {
  getVariable('lactating')
    ? setButtonText('lactatingset', 'No')
    : setButtonText('lactatingset', 'Yes');
}

export function milkcurrent() {
  setValue('milkinput', getVariable('milk_volume'));
}

export function cumcurrent() {
  setValue('cuminput', getVariable('semen_volume'));
}

export function famecurrent() {
  syncInputFromSelect({
    selectId: 'fame_name',
    inputId: 'input_fame12',
    readValue: (key) => getVariablePath(`fame.${key}`),
  });
}

export function npccurrent() {
  withElements(
    {
      name: 'npcnames',
      trait: 'npctraits',
      input: 'npcchangeinput',
    },
    ({ name, trait, input }) => {
      const npc = (getNPCName() ?? []).find((entry) => entry.description === name.value);
      if (npc) input.value = npc[trait.value];
    }
  );
}

export function examcurrent() {
  syncInputFromSelect({
    selectId: 'select_exam',
    inputId: 'input_exam',
    readValue: (key) => getVariable(key),
  });
}

export function talentcurrent() {
  syncInputFromSelect({
    selectId: 'select_talent',
    inputId: 'input_talent',
    readValue: (key) => getVariable(key),
  });
}

export function arousalpicked() {
  const val = getUi('arousal_val');
  if (val) setButtonText('arousal_preview', val.value + '%');
}

export function update_pregnancy() {
  setButtonText('pc_pregnancy', 'MC = ' + (getPcPregnant() ?? 0));
  setButtonText('npc_pregnancy', 'NPC = ' + (getTotalNpcPregnant() ?? 0));
}

export function update_school_rep() {
  syncInputFromSelect({
    selectId: 'select_school_rep',
    inputId: 'input_school_rep',
    readValue: (key) => getVariable(key),
  });
}

const coreUpdates = {
  setButtonText,
  statpick,
  statpicke,
  spraystate,
  bodycurrent,
  bodytypecurrent,
  ballscurrent,
  virginitycurrent,
  crimecurrent,
  vowcurrent,
  characurrent,
  lactatingcurrent,
  milkcurrent,
  cumcurrent,
  famecurrent,
  npccurrent,
  examcurrent,
  talentcurrent,
  arousalpicked,
  update_pregnancy,
  update_school_rep,
};

export default coreUpdates;
