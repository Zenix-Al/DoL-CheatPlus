import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { getNpcNameList } from '../../core/game-context.js';
import { getVars } from '../../core/sugarcube/state.js';

export function createPlayerProgressionActions() {
  return {
    changetraitbro() {
      if (getVars().NPCName === undefined) return;
      const npcName = byId('npcnames').value;
      const trait = byId('npctraits').value;
      const value = parseInt(byId('npcchangeinput').value);
      if (!isNaN(value)) {
        const npcnamelist = getNpcNameList();
        for (let index = 0; index < npcnamelist.length; index++) {
          if (getVars().NPCName[index].description === npcName) {
            getVars().NPCName[index][trait] = value;
            showToast('Activated!');
            break;
          }
        }
      }
    },

    set_fame12() {
      const selected = byId('fame_name').value;
      const input = parseInt(byId('input_fame12').value);
      if (isNaN(input)) {
        showToast('failed : input is not a number!');
        return;
      }
      if (getVars().fame[selected] === undefined) {
        showToast('failed!');
        return;
      }
      getVars().fame[selected] = input;
      showToast('Activated!');
    },

    exammanager() {
      const selected = byId('select_exam').value;
      const input = parseInt(byId('input_exam').value);
      if (isNaN(input)) {
        showToast('failed : input is not a number!');
        return;
      }
      getVars()[selected] = input;
      showToast('Activated!');
    },

    talentmanager() {
      const selected = byId('select_talent').value;
      const input = parseInt(byId('input_talent').value);
      if (isNaN(input)) {
        showToast('failed : input is not a number!');
        return;
      }
      getVars()[selected] = input;
      showToast('Activated!');
    },

    set_hentai_skill() {
      showToast('Activated!');
      const selected = byId('select_hentai_skill').value;
      const input = parseInt(byId('input_hentai_skill').value);
      if (!selected || isNaN(input)) return;
      getVars()[selected] = input;
    },
  };
}

export default createPlayerProgressionActions;
