import { byUiId as byId } from '../../ui/helpers/dom-refs.js';
import { getMycode } from '../../services/cheat-runtime.js';

const pregnancyUpdates = {
  update_pregnancy_list_named_npc: function () {
    const selectElement = byId('named_npc_pregnancy_manager');
    if (!selectElement) return;
    selectElement.innerHTML = '';

    SugarCube.State.variables.NPCName.forEach((npc, index) => {
      if (npc.pregnancy.timer != null) {
        selectElement.appendChild(new Option(npc.description, index));
      }
    });
  },
  update_pregnancy_day_named_npc: function () {
    const selectEl = byId('named_npc_pregnancy_manager');
    const inputEl = byId('named_npc_pregnancy_input');
    const toggleEl = byId('named_npc_pregnancy_toggle');
    if (!selectEl || !inputEl || !toggleEl || !selectEl.value) return;

    inputEl.value =
      (SugarCube.State.variables.NPCName[selectEl.value].pregnancy.timerEnd -
        SugarCube.State.variables.NPCName[selectEl.value].pregnancy.timer) /
      3;

    const _mycode1 = (typeof getMycode === 'function' ? getMycode() : globalThis.mycode) || {};
    toggleEl.checked = Array.isArray(_mycode1.named_npc_pregnancy_locked)
      ? _mycode1.named_npc_pregnancy_locked.includes(selectEl.value)
      : false;
  },
  update_pregnancy_list_npc: function () {
    const selectElement = byId('npc_pregnancy_manager');
    if (!selectElement) return;
    selectElement.innerHTML = '';

    for (const key in SugarCube.State.variables.storedNPCs) {
      selectElement.appendChild(
        new Option(SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother, key)
      );
    }
  },
  update_pregnancy_day_npc: function () {
    const selectEl = byId('npc_pregnancy_manager');
    const inputEl = byId('npc_pregnancy_input');
    const toggleEl = byId('npc_pregnancy_toggle');
    if (!selectEl || !inputEl || !toggleEl || !selectEl.value) return;

    inputEl.value =
      (SugarCube.State.variables.storedNPCs[selectEl.value].pregnancy.timerEnd -
        SugarCube.State.variables.storedNPCs[selectEl.value].pregnancy.timer) /
      3;

    const _mycode2 = (typeof getMycode === 'function' ? getMycode() : globalThis.mycode) || {};
    toggleEl.checked = Array.isArray(_mycode2.npc_pregnancy_locked)
      ? _mycode2.npc_pregnancy_locked.includes(selectEl.value)
      : false;
  },
  update_pregnancy_list_mc: function () {
    const selectElement = byId('mc_pregnancy_manager');
    const holeEl = byId('mc_pregnancy_hole');
    if (!selectElement || !holeEl) return;
    const selectHole = holeEl.value;
    selectElement.innerHTML = '';

    if (SugarCube.State.variables.sexStats[selectHole].pregnancy.type == 'parasite') {
      for (const key in SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus) {
        const option = document.createElement('option');
        option.value = key;
        option.text = SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[key].creature;
        selectElement.appendChild(option);
      }
    } else if (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd != null) {
      selectElement.appendChild(new Option('baby', 'baby'));
    }
  },
  update_pregnancy_day_mc: function () {
    const selectEl = byId('mc_pregnancy_manager');
    const holeEl = byId('mc_pregnancy_hole');
    const mcPregnancyInput = byId('mc_pregnancy_input');
    const mcPregnancyToggle = byId('mc_pregnancy_toggle');
    const mycode = (typeof getMycode === 'function' ? getMycode() : globalThis.mycode) || {};
    if (!selectEl || !holeEl || !mcPregnancyInput || !mcPregnancyToggle || !selectEl.value) return;
    const selectElement = selectEl.value;
    const selectHole = holeEl.value;

    const pregType = SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
    if (pregType == 'parasite') {
      mcPregnancyInput.value =
        SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft;
    } else {
      mcPregnancyInput.value =
        (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd -
          SugarCube.State.variables.sexStats[selectHole].pregnancy.timer) /
        3;
    }

    const lockIndex = Array.isArray(mycode.mc_pregnancy_locked)
      ? mycode.mc_pregnancy_locked.findIndex((name) => name == selectElement)
      : -1;
    const lockState =
      lockIndex === -1
        ? 0
        : mycode.mc_pregnancy_locked_hole[lockIndex] != selectHole
        ? 1
        : mycode.mc_pregnancy_locked_type[lockIndex] != pregType
        ? 2
        : 3;

    mcPregnancyToggle.checked = lockState === 3;
  },
};

export default pregnancyUpdates;
