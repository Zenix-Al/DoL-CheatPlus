import {
  getCheatPlus,
  getFarm,
  getVariable,
  getVariablePath,
  setVariable,
} from '../../core/sugarcube/adapter.js';
import { getUi, setText, setValue, withElements } from '../../ui/helpers/hydrate-utils.js';

export function update_cheat_state() {
  const button = getUi('in_game_cheat');
  if (!button) return;
  const debug = getVariable('debug');
  const label = button.textContent?.trim() ?? '';
  if ((debug === 1 && label.startsWith('Enable')) || (debug === 0 && label.startsWith('Disable'))) {
    const isEnabled = button.innerHTML === 'Enable';
    setVariable('debug', isEnabled ? 1 : 0);
    button.innerHTML = isEnabled ? 'Disable' : 'Enable';
  }
}

export function update_farm_assault_day() {
  const timer = getVariable('farm_attack_timer');
  if (timer != null) setValue('assault_time', timer);
}

export function update_farm_buildtime() {
  const timer = getVariablePath('farm.build_timer');
  if (timer != null) setValue('build_time', timer);
}

export function update_farm_animals_like() {
  const farm = getFarm();
  if (!farm) return;
  withElements({ animal: 'animal_choice', input: 'animal_input' }, ({ animal, input }) => {
    input.value = farm.beasts?.[animal.value] ?? '';
  });
}

export function update_array_checker() {
  setText('auto_check_status', getCheatPlus()?.arrayCheck ? 'found' : 'not found');
}

export function randomEncounterUpdate() {
  setText('randomEncounterSet', getVariable('alluremod') === 0 ? 'Disabled' : 'Enabled');
}

const miscUpdates = {
  update_cheat_state,
  update_farm_assault_day,
  update_farm_buildtime,
  update_farm_animals_like,
  update_array_checker,
  randomEncounterUpdate,
};

export default miscUpdates;
