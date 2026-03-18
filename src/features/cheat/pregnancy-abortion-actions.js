import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { hydrateCheatUi } from '../fetchers/index.js';
import { getNpcNameList } from '../../core/game-context.js';
import { getVars } from '../../core/sugarcube/state.js';
import { getStoredCheatNPCs } from '../../core/sugarcube/cheat-config.js';

import { abortion_notice } from './pregnancy-shared.js';

export function createPregnancyAbortionActions() {
  return {
    abortion_notice,

    mc_abortion_set() {
      const checked = byId('mc_abortion_checkbox').checked;
      if (!checked) {
        showToast('check the checkbox to confirm');
        return false;
      }
      const location = byId('mc_abortion_location').value;
      const selected = byId('mc_abortion_select').value;
      const pregnancy = getVars().sexStats[location].pregnancy;
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
      if (getVars().sexStats.anus.pregnancy.fetus[0]?.stats?.gender === 'Hermaphrodite') {
        getVars().sexStats.anus.pregnancy.motherStatus = 1;
      }
      abortion_notice();
      hydrateCheatUi.update_mc_abortion_list();
    },

    named_npc_abortion_set() {
      const checked = byId('named_npc_abortion_checkbox').checked;
      if (!checked) {
        showToast('check the checkbox to confirm');
        return false;
      }
      const selectedName = byId('named_npc_abortion_chara_select').value;
      const fetus = byId('named_npc_abortion_select').value;
      let selectedIndex = -1;
      let totalFetus = 0;
      const npcnamelist = getNpcNameList();
      const npcNames = getVars().NPCName;
      for (let index = 0; index < npcnamelist.length; index++) {
        if (npcNames[index].description === selectedName) {
          selectedIndex = index;
          if (typeof npcNames[index].pregnancy.fetus === 'object') {
            totalFetus = npcNames[index].pregnancy.fetus.length;
          }
        }
      }
      if (totalFetus === 0) {
        showToast('No baby!');
        return false;
      }
      const pregnancy = npcNames[selectedIndex].pregnancy;
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
      abortion_notice();
      hydrateCheatUi.update_named_npc_abortion_list();
    },

    npc_abortion_set() {
      const checked = byId('npc_abortion_checkbox').checked;
      if (!checked) {
        showToast('check the checkbox to confirm');
        return false;
      }
      const selected = byId('npc_abortion_chara_select').value;
      if (!selected) return false;
      const fetus = byId('npc_abortion_select').value;
      const inGame = selected.match(/pregnancy/);
      const vars = getVars();
      const targetStore = inGame ? vars.storedNPCs : getStoredCheatNPCs();
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
        abortion_notice();
        hydrateCheatUi.update_npc_abortion_list();
      } else {
        targetStore[selected].pregnancy.fetus.splice(fetus, 1);
        abortion_notice();
      }
      hydrateCheatUi.update_npc_fetus_abortion_list();
    },
  };
}

export default createPregnancyAbortionActions;
