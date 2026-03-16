import {
  byId,
  closeModal,
  getFirstload,
  getMycode,
  showToast,
} from '../../services/cheat-runtime.js';

const worldActions = {
  VrelCoinsUsage: function () {
    if (SugarCube.State.variables?.featsBoosts?.pointsUsed === undefined) return;
    SugarCube.State.variables.featsBoosts.pointsUsed = 0;
    showToast('Activated!');
  },

  set_animal_like: function () {
    const animal = byId('animal_choice').value;
    const value = parseInt(byId('animal_input').value);
    if (isNaN(value)) {
      showToast('failed : input is not a number!');
      return;
    }
    if (SugarCube.State.variables?.farm?.beasts === undefined) {
      showToast('failed!');
      return;
    }
    showToast('Activated!');
    SugarCube.State.variables.farm.beasts[animal] = value;
  },
  set_build_time: function () {
    const value = parseInt(byId('build_time').value);
    if (isNaN(value)) {
      showToast('failed : input is not a number!');
      return;
    }
    if (SugarCube.State.variables?.farm?.build_timer === undefined) {
      showToast('failed!');
      return;
    }
    showToast('Activated!');
    SugarCube.State.variables.farm.build_timer = value;
  },
  set_assault_time: function () {
    const value = parseInt(byId('assault_time').value);
    if (!isNaN(value)) {
      showToast('Activated!');
      SugarCube.State.variables.farm_attack_timer = value;
    }
  },
  clean_cum: function () {
    if (SugarCube.State.variables?.player?.bodyliquid === undefined) return;
    for (const key in SugarCube.State.variables.player.bodyliquid) {
      for (const innerKey in SugarCube.State.variables.player.bodyliquid[key]) {
        SugarCube.State.variables.player.bodyliquid[key][innerKey] = 0;
      }
    }
    showToast('Activated!');
  },
  dirty_cum: function () {
    if (SugarCube.State.variables?.player?.bodyliquid === undefined) return;
    for (const key in SugarCube.State.variables.player.bodyliquid) {
      for (const innerKey in SugarCube.State.variables.player.bodyliquid[key]) {
        SugarCube.State.variables.player.bodyliquid[key][innerKey] = 100;
      }
    }
    showToast('Activated!');
  },
  clean_cum_uretus: function () {
    if (SugarCube.State.variables?.sexStats?.vagina?.sperm === undefined) return;
    SugarCube.State.variables.sexStats.vagina.sperm = [];
    showToast('Activated!');
  },
  funny_fruits: ['cabbage', 'wild_carrot', 'turnip', 'potato', 'onion', 'garlic_bulb', 'broccoli'],
  check_fruit_selling: function () {
    if (SugarCube.State.variables?.farmersProduce?.selling === undefined) return;
    const selling = SugarCube.State.variables.farmersProduce.selling;
    const mycode = getMycode();
    const totals = mycode.funny_fruits.reduce((acc, fruit) => {
      acc[fruit] = selling[fruit] || 0;
      return acc;
    }, {});
    const placeholder = Object.entries(totals)
      .sort((left, right) => right[1] - left[1])
      .map(([fruit, amount], index) => `${index + 1}. ${fruit}: ${amount} | `)
      .join('');
    byId('placeholder_fruits').innerHTML = placeholder;
  },
  set_school_rep: function () {
    showToast('Activated!');
    const selected = byId('select_school_rep').value;
    const input = parseInt(byId('input_school_rep').value);
    if (isNaN(input)) {
      showToast('failed : input is not a number!');
      return;
    }
    SugarCube.State.variables[selected] = input;
  },
  max_Ferocity: function () {
    SugarCube.State.variables.wolfpackferocity = 22;
    showToast('Activated!');
  },
  max_harmony: function () {
    SugarCube.State.variables.wolfpackharmony = 22;
    showToast('Activated!');
  },
  sidebar_cheat: function () {
    byId('ui-bar-toggle').click();
  },
  cheat_backwards: function () {
    const button = byId('history-backward');
    if (!button) {
      showToast('Failed, history probably disabled.');
      return;
    }
    button.click();
    getMycode().update_history();
  },
  cheat_forwards: function () {
    const button = byId('history-forward');
    if (!button) {
      showToast('Failed, history probably disabled.');
      return;
    }
    button.click();
    getMycode().update_history();
  },
  update_history: function () {
    const backwards = byId('cheat-history-backwards');
    const forwards = byId('cheat-history-forwards');
    backwards.disabled = byId('history-backward').disabled;
    forwards.disabled = byId('history-forward').disabled;
  },
  in_game_cheat: function () {
    const button = byId('in_game_cheat');
    const altButton = byId('alt_cheat');
    const isEnabled = button.innerHTML === 'Enable';
    SugarCube.State.variables.debug = isEnabled ? 1 : 0;
    button.innerHTML = isEnabled ? 'Disable' : 'Enable';
    altButton.innerHTML = isEnabled ? 'Open' : '';
  },
  alt_cheat: function () {
    const overlay = byId('overlayButtons');
    const cheatButton = [...overlay.getElementsByClassName('link-internal')].find(
      (button) => button.innerHTML === 'CHEATS'
    );
    if (cheatButton) {
      closeModal();
      cheatButton.click();
      return;
    }
    showToast(
      SugarCube.State.variables.debug === 1
        ? 'move passage to see the change'
        : 'cheat not enabled, please re-enable it again.'
    );
  },
  randomEncounterSet: function () {
    const button = byId('randomEncounterSet');
    const isEnabled = SugarCube.State.variables.alluremod === 0;
    SugarCube.State.variables.alluremod = isEnabled ? 1 : 0;
    button.innerHTML = isEnabled ? 'Enabled' : 'Disabled';
    showToast(isEnabled ? 'Enabled.' : 'Disabled.');
  },
  purgeNPCBaby: function () {
    const selectAction = byId('mc_baby_action_select').value;
    if (selectAction !== 'abandon') {
      showToast('Pick abandon to purge.');
      return;
    }
    const input =
      byId('mc_baby_input').type === 'checkbox'
        ? byId('mc_baby_input').checked
        : byId('mc_baby_input').value;
    if (input == true) {
      SugarCube.State.variables.children = {};
      getFirstload().update_mc_baby_list();
      showToast('All of your baby has been abandoned!');
      return;
    }
    showToast('check the checkbox to confirm');
  },
};

export default worldActions;
