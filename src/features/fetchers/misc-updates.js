import { byUiId as byId } from '../../ui/helpers/dom-refs.js';
import { getMycode } from '../../services/cheat-runtime.js';

const miscUpdates = {
  update_cheat_state: function () {
    const button = byId('in_game_cheat');
    if (!button) return;
    if (
      (SugarCube.State.variables.debug === 1 && button.innerHTML === 'Enable') ||
      (SugarCube.State.variables.debug === 0 && button.innerHTML === 'Disable')
    ) {
      getMycode().in_game_cheat();
    }
  },
  update_farm_assault_day: function () {
    const assaultTime = byId('assault_time');
    if (assaultTime && SugarCube.State.variables.farm_attack_timer) {
      assaultTime.value = SugarCube.State.variables.farm_attack_timer;
    }
  },
  update_farm_buildtime: function () {
    const buildTime = byId('build_time');
    if (buildTime && SugarCube.State.variables.farm?.build_timer) {
      buildTime.value = SugarCube.State.variables.farm.build_timer;
    }
  },
  update_farm_animals_like: function () {
    const farm = SugarCube.State.variables.farm;
    if (farm) {
      const animalEl = byId('animal_choice');
      const inputEl = byId('animal_input');
      if (animalEl && inputEl) inputEl.value = farm.beasts?.[animalEl.value] ?? '';
    }
  },
  update_array_checker: function () {
    const el = byId('auto_check_status');
    if (el) el.innerHTML = SugarCube.State.variables.cheatPlus.arrayCheck ? 'found' : 'not found';
  },
  randomEncounterUpdate: function () {
    const el = byId('randomEncounterSet');
    if (el) el.innerHTML = SugarCube.State.variables.alluremod === 0 ? 'Disabled' : 'Enabled';
  },
};

export default miscUpdates;
