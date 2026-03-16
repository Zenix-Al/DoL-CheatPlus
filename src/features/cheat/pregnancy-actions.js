import {
  bloodEffect,
  byId,
  getFirstload,
  getFunctionBundle,
  getMycode,
  showToast,
} from '../../services/cheat-runtime.js';

function updateToggleBundle(key, enabled, handler) {
  const bundle = getFunctionBundle();
  const mycode = getMycode();
  if (enabled) {
    bundle[key] = handler;
    mycode.toggleActive[key] = true;
  } else {
    delete bundle[key];
    delete mycode.toggleActive[key];
  }
}

const pregnancyActions = {
  named_npc_pregnancy_locked: [],
  named_npc_pregnancy_locked_day: [],
  named_npc_pregnancy_set: function () {
    const mycode = getMycode();
    const selectElement = byId('named_npc_pregnancy_manager').value;
    const input = parseInt(byId('named_npc_pregnancy_input').value);
    const toggle = byId('named_npc_pregnancy_toggle').checked;
    if (!selectElement || isNaN(input)) return;

    const index = mycode.named_npc_pregnancy_locked.findIndex((name) => name == selectElement);
    if (toggle && index === -1) {
      mycode.named_npc_pregnancy_locked.push(selectElement);
      mycode.named_npc_pregnancy_locked_day.push(input);
      updateToggleBundle(
        'named_npc_pregnancy_manager_toggle',
        true,
        mycode.named_npc_pregnancy_manager_toggle.bind(mycode)
      );
    } else if (!toggle && index !== -1) {
      mycode.named_npc_pregnancy_locked.splice(index, 1);
      mycode.named_npc_pregnancy_locked_day.splice(index, 1);
      updateToggleBundle('named_npc_pregnancy_manager_toggle', false);
    }

    const timeEnd = SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd;
    let time = timeEnd - input * 3;
    if (time < 0) time = 0;
    SugarCube.State.variables.NPCName[selectElement].pregnancy.timer = time;
    showToast('Activated!');
  },
  npc_pregnancy_locked: [],
  npc_pregnancy_locked_day: [],
  npc_pregnancy_set: function () {
    const mycode = getMycode();
    const selectElement = byId('npc_pregnancy_manager').value;
    const input = parseInt(byId('npc_pregnancy_input').value);
    const toggle = byId('npc_pregnancy_toggle').checked;
    if (!selectElement || isNaN(input)) return;

    const index = mycode.npc_pregnancy_locked.findIndex((name) => name == selectElement);
    if (toggle && index === -1) {
      mycode.npc_pregnancy_locked.push(selectElement);
      mycode.npc_pregnancy_locked_day.push(input);
      updateToggleBundle(
        'npc_pregnancy_manager_toggle',
        true,
        mycode.npc_pregnancy_manager_toggle.bind(mycode)
      );
    } else if (!toggle && index !== -1) {
      mycode.npc_pregnancy_locked.splice(index, 1);
      mycode.npc_pregnancy_locked_day.splice(index, 1);
      updateToggleBundle('npc_pregnancy_manager_toggle', false);
    }

    const timeEnd = SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd;
    let time = timeEnd - input * 3;
    if (time < 0) time = 0;
    SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer = time;
    showToast('Activated!');
  },
  mc_pregnancy_locked: [],
  mc_pregnancy_locked_hole: [],
  mc_pregnancy_locked_type: [],
  mc_pregnancy_locked_day: [],
  mc_pregnancy_set: function () {
    const mycode = getMycode();
    const selectElement = byId('mc_pregnancy_manager').value;
    const selectHole = byId('mc_pregnancy_hole').value;
    const input = parseInt(byId('mc_pregnancy_input').value);
    const toggle = byId('mc_pregnancy_toggle').checked;
    if (!selectElement || isNaN(input)) return;

    const pregType = SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
    const index = mycode.mc_pregnancy_locked.findIndex((name) => name == selectElement);
    const state =
      index === -1
        ? 0
        : mycode.mc_pregnancy_locked_hole[index] != selectHole
        ? 1
        : mycode.mc_pregnancy_locked_type[index] != pregType
        ? 2
        : 3;

    if (toggle && state === 0) {
      mycode.mc_pregnancy_locked.push(selectElement);
      mycode.mc_pregnancy_locked_hole.push(selectHole);
      mycode.mc_pregnancy_locked_type.push(pregType);
      mycode.mc_pregnancy_locked_day.push(input);
      updateToggleBundle(
        'mc_pregnancy_manager_toggle',
        true,
        mycode.mc_pregnancy_manager_toggle.bind(mycode)
      );
    } else if (!toggle && state !== 0) {
      mycode.mc_pregnancy_locked.splice(index, 1);
      mycode.mc_pregnancy_locked_hole.splice(index, 1);
      mycode.mc_pregnancy_locked_type.splice(index, 1);
      mycode.mc_pregnancy_locked_day.splice(index, 1);
      updateToggleBundle('mc_pregnancy_manager_toggle', false);
    }

    if (pregType == 'parasite') {
      SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft =
        input;
    } else {
      const timeEnd = SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd;
      let time = timeEnd - input * 3;
      if (time < 0) time = 0;
      SugarCube.State.variables.sexStats[selectHole].pregnancy.timer = time;
    }
    showToast('Activated!');
  },
  mc_tentacle_set: function () {
    const selectElement = byId('mc_tentacle_select').value;
    const selectlocation = byId('mc_tentacle_location').value;
    const input = parseInt(byId('mc_tentacle_input').value);
    if (!selectElement || isNaN(input)) return;
    SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed =
      input;
    showToast('Activated!');
  },
  mc_baby_set: function () {
    const selectElement = byId('mc_baby_select').value;
    const selectAction = byId('mc_baby_action_select').value;
    const input =
      byId('mc_baby_input').type == 'checkbox'
        ? byId('mc_baby_input').checked
        : byId('mc_baby_input').value;
    if (!SugarCube.State.variables.children[selectElement]) return;
    if (selectAction == 'abandon') {
      if (input == true) {
        showToast(SugarCube.State.variables.children[selectElement].name + ' has been abandoned!');
        delete SugarCube.State.variables.children[selectElement];
        getFirstload().update_mc_baby_list();
      } else {
        showToast('check the checkbox to confirm');
      }
      return true;
    }
    SugarCube.State.variables.children[selectElement][selectAction] = input;
    showToast('Activated!');
  },
  abortion_notice: function () {
    showToast('Aborting...');
    setTimeout(() => bloodEffect(), 1000);
    setTimeout(() => showToast('baby is aborted!'), 3200);
  },
  mc_abortion_set: function () {
    const mycode = getMycode();
    const checked = byId('mc_abortion_checkbox').checked;
    if (!checked) {
      showToast('check the checkbox to confirm');
      return false;
    }
    const location = byId('mc_abortion_location').value;
    const selected = byId('mc_abortion_select').value;
    const pregnancy = SugarCube.State.variables.sexStats[location].pregnancy;
    const length = pregnancy.fetus.length;
    if (length === 0) {
      showToast('No baby!');
      return false;
    }
    if (length === 1) {
      pregnancy.fetus = [];
      pregnancy.awareOf = null;
      pregnancy.awareOfDetails = null;
      pregnancy.awareOfMultiple = null;
      pregnancy.potentialFathers = [];
      pregnancy.timer = 0;
      pregnancy.timerEnd = null;
      pregnancy.type = null;
      pregnancy.waterBreaking = false;
      pregnancy.waterBreakingTimer = null;
    } else {
      pregnancy.fetus.splice(selected, 1);
    }
    if (
      SugarCube.State.variables.sexStats.anus.pregnancy.fetus[0]?.stats?.gender === 'Hermaphrodite'
    ) {
      SugarCube.State.variables.sexStats.anus.pregnancy.motherStatus = 1;
    }
    mycode.abortion_notice();
    getFirstload().update_mc_abortion_list();
  },
  named_npc_abortion_set: function () {
    const mycode = getMycode();
    const checked = byId('named_npc_abortion_checkbox').checked;
    if (!checked) {
      showToast('check the checkbox to confirm');
      return false;
    }
    const selectedName = byId('named_npc_abortion_chara_select').value;
    const fetus = byId('named_npc_abortion_select').value;
    let selectedIndex = -1;
    let totalFetus = 0;
    for (let index = 0; index < globalThis.npcnamelist.length; index++) {
      if (SugarCube.State.variables.NPCName[index].description === selectedName) {
        selectedIndex = index;
        if (typeof SugarCube.State.variables.NPCName[index].pregnancy.fetus === 'object') {
          totalFetus = SugarCube.State.variables.NPCName[index].pregnancy.fetus.length;
        }
      }
    }
    if (totalFetus === 0) {
      showToast('No baby!');
      return false;
    }
    const pregnancy = SugarCube.State.variables.NPCName[selectedIndex].pregnancy;
    if (totalFetus === 1) {
      pregnancy.fetus = [];
      pregnancy.potentialFathers = [];
      pregnancy.timer = 0;
      pregnancy.timerEnd = null;
      pregnancy.type = null;
      pregnancy.waterBreaking = false;
      pregnancy.waterBreakingTimer = null;
    } else {
      pregnancy.fetus.splice(fetus, 1);
    }
    mycode.abortion_notice();
    getFirstload().update_named_npc_abortion_list();
  },
  npc_abortion_set: function () {
    const mycode = getMycode();
    const checked = byId('npc_abortion_checkbox').checked;
    if (!checked) {
      showToast('check the checkbox to confirm');
      return false;
    }
    const selected = byId('npc_abortion_chara_select').value;
    if (!selected) return false;
    const fetus = byId('npc_abortion_select').value;
    const inGame = selected.match(/pregnancy/);
    const targetStore = inGame
      ? SugarCube.State.variables.storedNPCs
      : SugarCube.State.variables.cheatPlus.storedNPCs;
    const totalFetus = targetStore[selected].pregnancy.fetus.length;
    if (totalFetus === 0) {
      showToast('No baby!');
      return false;
    }
    if (totalFetus === 1) {
      targetStore[selected].pregnancy.fetus = [];
      targetStore[selected].pregnancy.potentialFathers = [];
      targetStore[selected].pregnancy.timer = 0;
      targetStore[selected].pregnancy.timerEnd = null;
      targetStore[selected].pregnancy.type = null;
      targetStore[selected].pregnancy.waterBreaking = false;
      targetStore[selected].pregnancy.waterBreakingTimer = null;
      delete targetStore[selected];
      mycode.abortion_notice();
      getFirstload().update_npc_abortion_list();
    } else {
      targetStore[selected].pregnancy.fetus.splice(fetus, 1);
      mycode.abortion_notice();
    }
    getFirstload().update_npc_fetus_abortion_list();
  },
};

export default pregnancyActions;
