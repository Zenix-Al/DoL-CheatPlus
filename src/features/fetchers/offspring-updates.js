import { babyOptions, babyOptionsText } from '../../config/game-data.js';
import { byUiId as byId } from '../../ui/helpers/dom-refs.js';
import { getFirstload } from '../../services/cheat-runtime.js';

const offspringUpdates = {
  update_mc_baby_list_options: 0,

  update_mc_tentacle: function () {
    const selectElement = byId('mc_tentacle_select');
    const locationEl = byId('mc_tentacle_location');
    if (!selectElement || !locationEl) return;
    const selectLocation = locationEl.value;
    selectElement.innerHTML = '';

    for (const key in SugarCube.State.variables.container[selectLocation].creatures) {
      const creature = SugarCube.State.variables.container[selectLocation].creatures[key];
      if (creature != null) {
        const option = document.createElement('option');
        option.value = key;
        option.text = creature.creature;
        selectElement.appendChild(option);
      }
    }

    const _firstload =
      (typeof getFirstload === 'function' ? getFirstload() : globalThis.firstload) || null;
    if (_firstload && typeof _firstload.update_mc_tentacle_input === 'function') {
      _firstload.update_mc_tentacle_input();
    }
  },
  update_mc_tentacle_input: function () {
    const selectEl = byId('mc_tentacle_select');
    const locationEl = byId('mc_tentacle_location');
    const inputEl = byId('mc_tentacle_input');
    if (!selectEl || !locationEl || !inputEl || !selectEl.value) return;
    inputEl.value =
      SugarCube.State.variables.container[locationEl.value].creatures[selectEl.value].stats.speed;
  },
  update_mc_baby_info: function () {
    const babySelect = byId('mc_baby_select');
    const actionSelect = byId('mc_baby_action_select');
    const mcBabyInput = byId('mc_baby_input');
    const tooltip = byId('mc_baby_tooltip');
    if (!babySelect || !actionSelect || !mcBabyInput || !tooltip) return;
    const child = SugarCube.State.variables.children[babySelect.value];

    if (!child) return;

    const tooltipText = tooltip.querySelector('span');
    if (tooltipText) {
      tooltipText.textContent = `Name: ${child.name}, Father: ${child.father}, Mother: ${child.mother}, Location: ${child.birthLocation}`;
    }

    if (actionSelect.value === 'name') {
      mcBabyInput.type = 'text';
      mcBabyInput.value = child[actionSelect.value] || '';
    } else {
      mcBabyInput.type = 'checkbox';
      mcBabyInput.checked = Boolean(child[actionSelect.value]);
    }
  },
  update_mc_baby_list: function () {
    const firstload =
      (typeof getFirstload === 'function' ? getFirstload() : globalThis.firstload) || null;
    const babySelect = byId('mc_baby_select');
    const babyActionSelect = byId('mc_baby_action_select');
    const babyInput = byId('mc_baby_input');
    if (!babySelect || !babyActionSelect || !babyInput) return;

    babySelect.innerHTML = '';

    Object.entries(SugarCube.State.variables.children).forEach(([key]) => {
      babySelect.append(new Option(key, key));
    });

    if (firstload && typeof firstload.update_mc_baby_info === 'function')
      firstload.update_mc_baby_info();

    if (!firstload || !firstload.update_mc_baby_list_options) {
      if (firstload) firstload.update_mc_baby_list_options = 1;
      babyInput.style.display = '';
      babyActionSelect.innerHTML = '';

      Object.entries(babyOptions).forEach(([key, value]) => {
        babyActionSelect.append(new Option(babyOptionsText[key], value));
      });
    }
  },
  update_mc_abortion_list: function () {
    const locationEl = byId('mc_abortion_location');
    const abortionSelect = byId('mc_abortion_select');
    if (!locationEl || !abortionSelect) return;
    const totalFetus = SugarCube.State.variables.sexStats[locationEl.value].pregnancy.fetus.length;
    abortionSelect.innerHTML = '';

    for (let index = 0; index < totalFetus; index++) {
      abortionSelect.appendChild(new Option(index, index));
    }
  },
  update_named_npc_abortion_list: function () {
    const selectedNpcEl = byId('named_npc_abortion_chara_select');
    const abortionSelect = byId('named_npc_abortion_select');
    if (!selectedNpcEl || !abortionSelect) return;
    let totalFetus = 0;

    for (const npc of SugarCube.State.variables.NPCName) {
      if (npc.description === selectedNpcEl.value && typeof npc.pregnancy.fetus === 'object') {
        totalFetus = npc.pregnancy.fetus.length;
      }
    }

    abortionSelect.innerHTML = '';
    for (let index = 0; index < totalFetus; index++) {
      abortionSelect.appendChild(new Option(index, index));
    }
  },
  update_npc_abortion_list: function () {
    if (typeof SugarCube.State.variables.storedNPCs.pregnancy_0 !== 'object') return false;
    const abortionCharaSelect = byId('npc_abortion_chara_select');
    if (!abortionCharaSelect) return false;
    abortionCharaSelect.innerHTML = '';

    let number = 1;
    for (const key in SugarCube.State.variables.storedNPCs) {
      abortionCharaSelect.appendChild(
        new Option(
          number + '. ' + SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother,
          key
        )
      );
      number++;
    }

    for (const key in SugarCube.State.variables.cheatPlus.storedNPCs) {
      abortionCharaSelect.appendChild(
        new Option(
          number +
            '. ' +
            SugarCube.State.variables.cheatPlus.storedNPCs[key].pregnancy.fetus[0].mother,
          key
        )
      );
      number++;
    }

    return true;
  },
  update_npc_fetus_abortion_list: function () {
    const abortionSelect = byId('npc_abortion_select');
    const abortionCharaSelectEl = byId('npc_abortion_chara_select');
    if (!abortionSelect || !abortionCharaSelectEl) return;
    const abortionCharaSelect = abortionCharaSelectEl.value;
    let totalFetus = 0;

    if (abortionCharaSelect.match(/pregnancy/)) {
      totalFetus = SugarCube.State.variables.storedNPCs[abortionCharaSelect].pregnancy.fetus.length;
    } else if (abortionCharaSelect.match(/stored/)) {
      totalFetus =
        SugarCube.State.variables.cheatPlus.storedNPCs[abortionCharaSelect].pregnancy.fetus.length;
    }

    abortionSelect.innerHTML = '';
    for (let index = 0; index < totalFetus; index++) {
      abortionSelect.appendChild(new Option(index, index));
    }
  },
};

export default offspringUpdates;
