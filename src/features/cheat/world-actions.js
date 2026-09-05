import { closeModal } from '../../ui/components/modal.js';
import { showToast } from '../../ui/components/toast.js';
import {
  getChildren,
  getFarm,
  getSexStats,
  getVariable,
  setVariable,
} from '../../core/sugarcube/adapter.js';
import { getVars } from '../../core/sugarcube/state.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { hydrateCheatUi } from '../fetchers/index.js';

const FUNNY_FRUITS = [
  'cabbage',
  'wild_carrot',
  'turnip',
  'potato',
  'onion',
  'garlic_bulb',
  'broccoli',
];

export function VrelCoinsUsage() {
  const vars = getVars();
  if (vars?.featsBoosts?.pointsUsed === undefined) return;
  vars.featsBoosts.pointsUsed = 0;
  showToast('Activated!');
}

export function set_animal_like() {
  const animal = byId('animal_choice')?.value;
  const value = parseInt(byId('animal_input')?.value);
  if (isNaN(value)) {
    showToast('failed : input is not a number!');
    return;
  }
  const farm = getFarm();
  if (farm?.beasts === undefined) {
    showToast('failed!');
    return;
  }
  showToast('Activated!');
  farm.beasts[animal] = value;
}

export function set_build_time() {
  const value = parseInt(byId('build_time')?.value);
  if (isNaN(value)) {
    showToast('failed : input is not a number!');
    return;
  }
  const farm = getFarm();
  if (farm?.build_timer === undefined) {
    showToast('failed!');
    return;
  }
  showToast('Activated!');
  farm.build_timer = value;
}

export function set_assault_time() {
  const value = parseInt(byId('assault_time')?.value);
  if (!isNaN(value)) {
    showToast('Activated!');
    setVariable('farm_attack_timer', value);
  }
}

export function clean_cum() {
  const vars = getVars();
  if (vars?.player?.bodyliquid === undefined) return;
  for (const key in vars.player.bodyliquid) {
    for (const innerKey in vars.player.bodyliquid[key]) {
      vars.player.bodyliquid[key][innerKey] = 0;
    }
  }
  showToast('Activated!');
}

export function dirty_cum() {
  const vars = getVars();
  if (vars?.player?.bodyliquid === undefined) return;
  for (const key in vars.player.bodyliquid) {
    for (const innerKey in vars.player.bodyliquid[key]) {
      vars.player.bodyliquid[key][innerKey] = 100;
    }
  }
  showToast('Activated!');
}

export function clean_cum_uretus() {
  const sexStats = getSexStats();
  if (sexStats?.vagina?.sperm === undefined) return;
  sexStats.vagina.sperm = [];
  showToast('Activated!');
}

export function check_fruit_selling() {
  const vars = getVars();
  if (vars?.farmersProduce?.selling === undefined) return;
  const selling = vars.farmersProduce.selling;
  const totals = FUNNY_FRUITS.reduce((acc, fruit) => {
    acc[fruit] = selling[fruit] || 0;
    return acc;
  }, {});
  const placeholder = Object.entries(totals)
    .sort((left, right) => right[1] - left[1])
    .map(([fruit, amount], index) => `${index + 1}. ${fruit}: ${amount} | `)
    .join('');
  const placeholderEl = byId('placeholder_fruits');
  if (placeholderEl) placeholderEl.innerHTML = placeholder;
}

export function set_school_rep() {
  showToast('Activated!');
  const selected = byId('select_school_rep')?.value;
  const input = parseInt(byId('input_school_rep')?.value);
  if (isNaN(input)) {
    showToast('failed : input is not a number!');
    return;
  }
  setVariable(selected, input);
}

export function sidebar_cheat() {
  byId('ui-bar-toggle')?.click();
}

export function cheat_backwards() {
  const button = byId('history-backward');
  if (!button) {
    showToast('Failed, history probably disabled.');
    return;
  }
  button.click();
  update_history();
}

export function cheat_forwards() {
  const button = byId('history-forward');
  if (!button) {
    showToast('Failed, history probably disabled.');
    return;
  }
  button.click();
  update_history();
}

export function update_history() {
  const backwards = byId('cheat-history-backwards');
  const forwards = byId('cheat-history-forwards');
  const backwardHistory = byId('history-backward');
  const forwardHistory = byId('history-forward');
  if (backwards && backwardHistory) backwards.disabled = backwardHistory.disabled;
  if (forwards && forwardHistory) forwards.disabled = forwardHistory.disabled;
}

export function in_game_cheat() {
  const button = byId('in_game_cheat');
  if (!button) return;
  const isEnabled = button.innerHTML === 'Enable';
  setVariable('debug', isEnabled ? 1 : 0);
  button.innerHTML = isEnabled ? 'Disable' : 'Enable';
}

export function alt_cheat() {
  const overlay = byId('overlayButtons');
  if (!overlay) return;
  const cheatButton = [...overlay.getElementsByClassName('link-internal')].find(
    (button) => button.innerHTML === 'CHEATS'
  );
  if (cheatButton) {
    closeModal();
    cheatButton.click();
    return;
  }
  showToast(
    getVariable('debug') === 1
      ? 'move passage to see the change'
      : 'cheat not enabled, please re-enable it again.'
  );
}

export function randomEncounterSet() {
  const button = byId('randomEncounterSet');
  if (!button) return;
  const isEnabled = getVariable('alluremod') === 0;
  setVariable('alluremod', isEnabled ? 1 : 0);
  button.innerHTML = isEnabled ? 'Enabled' : 'Disabled';
  showToast(isEnabled ? 'Enabled.' : 'Disabled.');
}

export function purgeNPCBaby() {
  const selectAction = byId('mc_baby_action_select')?.value;
  if (selectAction !== 'abandon') {
    showToast('Pick abandon to purge.');
    return;
  }
  const input =
    byId('mc_baby_input').type === 'checkbox'
      ? byId('mc_baby_input').checked
      : byId('mc_baby_input').value;
  if (input == true) {
    const children = getChildren();
    if (children) {
      Object.keys(children).forEach((key) => delete children[key]);
    }
    hydrateCheatUi.update_mc_baby_list();
    showToast('All of your baby has been abandoned!');
    return;
  }
  showToast('check the checkbox to confirm');
}

const worldActions = {
  VrelCoinsUsage,
  set_animal_like,
  set_build_time,
  set_assault_time,
  clean_cum,
  dirty_cum,
  clean_cum_uretus,
  check_fruit_selling,
  set_school_rep,
  sidebar_cheat,
  cheat_backwards,
  cheat_forwards,
  update_history,
  in_game_cheat,
  alt_cheat,
  randomEncounterSet,
  purgeNPCBaby,
};

export default worldActions;
