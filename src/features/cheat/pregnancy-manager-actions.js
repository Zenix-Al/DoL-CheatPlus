import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { hydrateCheatUi } from '../fetchers/index.js';
import { getVars } from '../../core/sugarcube/state.js';

import { applyNpcPregnancySet, updateToggleBundle } from './pregnancy-shared.js';

export function createPregnancyManagerActions({ actionBagRef, locks }) {
  return {
    named_npc_pregnancy_set() {
      const selectElement = byId('named_npc_pregnancy_manager').value;
      const input = parseInt(byId('named_npc_pregnancy_input').value);
      const toggle = byId('named_npc_pregnancy_toggle').checked;
      const actionBag = actionBagRef();

      applyNpcPregnancySet({
        selectElement,
        input,
        toggle,
        locked: locks.named_npc_pregnancy_locked,
        lockedDays: locks.named_npc_pregnancy_locked_day,
        toggleKey: 'named_npc_pregnancy_manager_toggle',
        toggleHandler: actionBag.named_npc_pregnancy_manager_toggle,
        resolvePregnancy: (id) => getVars().NPCName?.[id]?.pregnancy,
      });
    },

    npc_pregnancy_set() {
      const selectElement = byId('npc_pregnancy_manager').value;
      const input = parseInt(byId('npc_pregnancy_input').value);
      const toggle = byId('npc_pregnancy_toggle').checked;
      const actionBag = actionBagRef();

      applyNpcPregnancySet({
        selectElement,
        input,
        toggle,
        locked: locks.npc_pregnancy_locked,
        lockedDays: locks.npc_pregnancy_locked_day,
        toggleKey: 'npc_pregnancy_manager_toggle',
        toggleHandler: actionBag.npc_pregnancy_manager_toggle,
        resolvePregnancy: (id) => getVars().storedNPCs?.[id]?.pregnancy,
      });
    },

    mc_pregnancy_set() {
      const selectElement = byId('mc_pregnancy_manager').value;
      const selectHole = byId('mc_pregnancy_hole').value;
      const input = parseInt(byId('mc_pregnancy_input').value);
      const toggle = byId('mc_pregnancy_toggle').checked;
      const actionBag = actionBagRef();
      if (!selectElement || isNaN(input)) return;

      const pregType = getVars().sexStats[selectHole].pregnancy.type;
      const index = locks.mc_pregnancy_locked.findIndex((name) => name == selectElement);
      const state =
        index === -1
          ? 0
          : locks.mc_pregnancy_locked_hole[index] != selectHole
          ? 1
          : locks.mc_pregnancy_locked_type[index] != pregType
          ? 2
          : 3;

      if (toggle && state === 0) {
        locks.mc_pregnancy_locked.push(selectElement);
        locks.mc_pregnancy_locked_hole.push(selectHole);
        locks.mc_pregnancy_locked_type.push(pregType);
        locks.mc_pregnancy_locked_day.push(input);
        updateToggleBundle(
          'mc_pregnancy_manager_toggle',
          true,
          actionBag.mc_pregnancy_manager_toggle
        );
      } else if (!toggle && state !== 0) {
        locks.mc_pregnancy_locked.splice(index, 1);
        locks.mc_pregnancy_locked_hole.splice(index, 1);
        locks.mc_pregnancy_locked_type.splice(index, 1);
        locks.mc_pregnancy_locked_day.splice(index, 1);
        updateToggleBundle('mc_pregnancy_manager_toggle', false);
      }

      if (pregType == 'parasite') {
        getVars().sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft = input;
      } else {
        const sexPregnancy = getVars().sexStats[selectHole].pregnancy;
        let time = sexPregnancy.timerEnd - input * 3;
        if (time < 0) time = 0;
        sexPregnancy.timer = time;
      }
      showToast('Activated!');
    },

    mc_tentacle_set() {
      const selectElement = byId('mc_tentacle_select').value;
      const selectlocation = byId('mc_tentacle_location').value;
      const input = parseInt(byId('mc_tentacle_input').value);
      if (!selectElement || isNaN(input)) return;
      getVars().container[selectlocation].creatures[selectElement].stats.speed = input;
      showToast('Activated!');
    },

    mc_baby_set() {
      const selectElement = byId('mc_baby_select').value;
      const selectAction = byId('mc_baby_action_select').value;
      const input =
        byId('mc_baby_input').type == 'checkbox'
          ? byId('mc_baby_input').checked
          : byId('mc_baby_input').value;
      const vars = getVars();
      if (!vars.children[selectElement]) return;
      if (selectAction == 'abandon') {
        if (input == true) {
          showToast(vars.children[selectElement].name + ' has been abandoned!');
          delete vars.children[selectElement];
          hydrateCheatUi.update_mc_baby_list();
        } else {
          showToast('check the checkbox to confirm');
        }
        return true;
      }
      vars.children[selectElement][selectAction] = input;
      showToast('Activated!');
    },
  };
}

export default createPregnancyManagerActions;
