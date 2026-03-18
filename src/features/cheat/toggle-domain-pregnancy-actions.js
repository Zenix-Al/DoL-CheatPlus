import {
  getPcPregnant,
  getTotalNpcPregnant,
  setPcPregnant,
  setTotalNpcPregnant,
} from '../../core/runtime-state.js';
import {
  getBaseNpcPregnancyChance,
  getStoredCheatNPCs,
  getStoredNPCsDate,
  setBaseNpcPregnancyChance,
  setStoredCheatNPCs,
  setStoredNPCsDate,
} from '../../core/sugarcube/cheat-config.js';
import { SECONDS_PER_DAY } from '../../constants/runtime.js';
import { getVars } from '../../core/sugarcube/state.js';
import { showToast } from '../../ui/components/toast.js';

import {
  mc_pregnancy_locked,
  mc_pregnancy_locked_day,
  mc_pregnancy_locked_hole,
  mc_pregnancy_locked_type,
  named_npc_pregnancy_locked,
  named_npc_pregnancy_locked_day,
  npc_pregnancy_locked,
  npc_pregnancy_locked_day,
} from './pregnancy-lock-state.js';

export function createToggleDomainPregnancyActions(toggleState, actionBagRef) {
  return {
    pregnancy_detection() {
      const vars = getVars();
      if (Object.keys(vars.storedNPCs).length === 0 || vars.NPCName === undefined) return;

      function countNpc() {
        let total = Object.keys(vars.storedNPCs).length;
        total += Object.keys(getStoredCheatNPCs()).length;
        for (let index = 0; index < vars.NPCName.length; index++) {
          if (vars?.NPCName[index]?.pregnancy?.fetus?.length > 0) total++;
        }
        return total;
      }

      function countPc() {
        if (
          vars.sexStats?.vagina?.pregnancy?.fetus === undefined ||
          vars.sexStats?.anus?.pregnancy?.fetus === undefined
        ) {
          return 0;
        }
        return (
          vars.sexStats.vagina.pregnancy.fetus.length + vars.sexStats.anus.pregnancy.fetus.length
        );
      }

      const nextNpc = countNpc();
      const nextPc = countPc();
      const actionBag = actionBagRef();

      if (getTotalNpcPregnant() === 0) {
        setTotalNpcPregnant(nextNpc);
        setPcPregnant(nextPc);
        return;
      }

      if (nextNpc > getTotalNpcPregnant()) {
        showToast('NPC is impregnated!');
        actionBag.invinityNPCPregnancy();
        setTotalNpcPregnant(nextNpc);
      } else if (nextNpc < getTotalNpcPregnant()) {
        showToast("NPC's baby has been born!");
        actionBag.invinityNPCPregnancy();
        setTotalNpcPregnant(nextNpc);
      }

      if (nextPc > getPcPregnant()) {
        showToast('MC is impregnated!');
        setPcPregnant(nextPc);
      } else if (nextPc < getPcPregnant()) {
        showToast('your baby has been born!!');
        setPcPregnant(nextPc);
      }
    },

    named_npc_pregnancy_manager_toggle() {
      const vars = getVars();
      if (named_npc_pregnancy_locked.length === 0 || named_npc_pregnancy_locked_day.length === 0) {
        return;
      }
      for (const key in named_npc_pregnancy_locked) {
        let total =
          vars.NPCName[named_npc_pregnancy_locked[key]].pregnancy.timerEnd -
          named_npc_pregnancy_locked_day[key] * 3;
        if (total < 0) total = 0;
        vars.NPCName[named_npc_pregnancy_locked[key]].pregnancy.timer = total;
      }
    },

    npc_pregnancy_manager_toggle() {
      const vars = getVars();
      if (npc_pregnancy_locked.length === 0 || npc_pregnancy_locked_day.length === 0) {
        return;
      }
      for (const key in npc_pregnancy_locked) {
        let total =
          vars.storedNPCs[npc_pregnancy_locked[key]].pregnancy.timerEnd -
          npc_pregnancy_locked_day[key] * 3;
        if (total < 0) total = 0;
        vars.storedNPCs[npc_pregnancy_locked[key]].pregnancy.timer = total;
      }
    },

    mc_pregnancy_manager_toggle() {
      const vars = getVars();
      if (mc_pregnancy_locked.length === 0 || mc_pregnancy_locked_day.length === 0) return;

      let offset = 0;
      for (const key in mc_pregnancy_locked) {
        if (mc_pregnancy_locked_type[offset] === 'parasite') {
          vars.sexStats[mc_pregnancy_locked_hole[offset]].pregnancy.fetus[key].daysLeft =
            mc_pregnancy_locked_day[offset];
        } else {
          const timeEnd = vars.sexStats[mc_pregnancy_locked_hole[offset]].pregnancy.timerEnd;
          let time = timeEnd - mc_pregnancy_locked_day[offset] * 3;
          if (time < 0) time = 0;
          vars.sexStats[mc_pregnancy_locked_hole[offset]].pregnancy.timer = time;
        }
        offset++;
      }
    },

    invinityNPCPregnancy() {
      const vars = getVars();
      if (getStoredNPCsDate()) return;
      let priorityQueue = 0;
      let waitQueue = 0;
      const limit = 8;
      const activeNpcStore = {};
      const waitingNpcStore = {};
      let dateLeft = 0;
      const gameTime = vars.timeStamp;
      const date = (gameTime - (gameTime % SECONDS_PER_DAY)) / SECONDS_PER_DAY;

      if (getStoredNPCsDate() !== 0) {
        dateLeft = (date - getStoredNPCsDate()) * 3;
      }
      setStoredNPCsDate(date);

      for (const key in vars.storedNPCs) {
        const left = vars.storedNPCs[key].pregnancy.timerEnd - vars.storedNPCs[key].pregnancy.timer;
        if (left <= 3 && priorityQueue <= limit) {
          activeNpcStore['stored_' + priorityQueue] = vars.storedNPCs[key];
          if (priorityQueue === 8) {
            showToast('NPC about to give abirth, you cant bustin nuts in people for today!');
          }
          priorityQueue++;
        } else {
          waitingNpcStore['stored_' + waitQueue] = vars.storedNPCs[key];
          waitQueue++;
        }
      }

      const storedCheatNPCs = getStoredCheatNPCs();
      for (const key in storedCheatNPCs) {
        const timerEnd = storedCheatNPCs[key].pregnancy.timerEnd;
        const timer = storedCheatNPCs[key].pregnancy.timer;
        if (dateLeft > 0) {
          storedCheatNPCs[key].pregnancy.timer += dateLeft;
          if (storedCheatNPCs[key].pregnancy.timer > timerEnd) {
            storedCheatNPCs[key].pregnancy.timer = timerEnd;
          }
        }
        const left = timerEnd - timer;
        if (left <= 3 && priorityQueue <= limit) {
          activeNpcStore['stored_' + priorityQueue] = storedCheatNPCs[key];
          if (priorityQueue === 8) {
            showToast('NPC about to give abirth, you cant bustin nuts in people for today!');
          }
          priorityQueue++;
        } else {
          waitingNpcStore['stored_' + waitQueue] = storedCheatNPCs[key];
          waitQueue++;
        }
      }

      vars.storedNPCs = activeNpcStore;
      setStoredCheatNPCs(waitingNpcStore);
    },

    allNPCInstaPregnant() {
      const vars = getVars();
      if (toggleState.toggleDeactivated) {
        vars.baseNpcPregnancyChance = getBaseNpcPregnancyChance();
        if (vars?.baseNpcPregnancyChance > 16) vars.baseNpcPregnancyChance = 16;
        toggleState.initNPCinstapreg = false;
        return;
      }
      if (!toggleState.initNPCinstapreg) {
        toggleState.initNPCinstapreg = true;
        setBaseNpcPregnancyChance(vars.baseNpcPregnancyChance);
        vars.baseNpcPregnancyChance = 19;
      }
      for (let index = 0; index < vars.NPCList.length; index++) {
        if (vars?.NPCList[index].pregnancyAvoidance > 0) {
          vars.NPCList[index].pregnancyAvoidance = 0;
        }
      }
    },

    allNPCMultiplePregnancy() {
      const vars = getVars();
      if (vars.NPCList === undefined) return;
      for (let index = 0; index < vars.NPCList.length; index++) {
        if (vars?.NPCList[index].pregnancy === 1) {
          vars.NPCList[index].pregnancy = 0;
        }
      }
    },
  };
}

export default createToggleDomainPregnancyActions;
