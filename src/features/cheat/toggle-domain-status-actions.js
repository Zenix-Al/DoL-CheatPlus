import { dispatch } from '../../core/actions/dispatcher.js';
import { getExtraNotif } from '../../core/runtime-state.js';
import {
  getAngel,
  getAngelMode,
  getOrgasmCount,
  getUnlicumMode,
  incrementOrgasmCount,
  resetOrgasmCount,
  setAngel,
  setAngelMode,
  setTrueDivine,
  setUnlicumMode,
} from '../../core/sugarcube/cheat-config.js';
import { getVars } from '../../core/sugarcube/state.js';
import { showToast, timedToast } from '../../ui/components/toast.js';

export function createToggleDomainStatusActions(toggleState) {
  return {
    invincibleAngel() {
      const vars = getVars();
      if (getExtraNotif()) {
        if (vars?.demon > 0) {
          showToast('Youre a demon!');
          timedToast('but, okay', 3000);
        } else if (vars?.fallenangel > 0) {
          showToast('Im sorry, youre already a fallen angel.');
          timedToast('im turning this off', 3000);
          dispatch('invincibleAngel');
          return;
        }
      }
      if (vars?.penisstate != 0 || vars?.vaginastate != 0) {
        if (!getAngelMode()) return;
        setAngel(vars.angel);
        vars.angel = 0;
        vars.angelbuild = 100;
        setAngelMode(true);
      } else if (!getAngelMode()) {
        setAngelMode(false);
        vars.angel = getAngel();
      }
    },

    updateUserDivine() {
      const vars = getVars();
      if (vars?.penisstate != 0 || vars?.vaginastate != 0) return;
      if (vars?.demon > 0) {
        setTrueDivine('demon');
      } else if (vars?.angel > 0) {
        setTrueDivine('angel');
      }
    },

    unlicum() {
      const vars = getVars();
      if (vars.semen_amount < vars.semen_volume) {
        vars.semen_amount = vars.semen_volume;
        vars.orgasmcount = 0;
      }
    },

    intenseCum() {
      const vars = getVars();
      if (vars.orgasmcurrent != 0 && !getUnlicumMode()) {
        resetOrgasmCount();
        toggleState.tmpArousal = vars.arousal;
        vars.orgasmdown = 1000;
        toggleState.orgasmdown = 1000;
        setUnlicumMode(true);
      } else if (vars.orgasmdown < toggleState.orgasmdown && getUnlicumMode()) {
        toggleState.orgasmdown = vars.orgasmdown;
        vars.arousal = toggleState.tmpArousal;
        incrementOrgasmCount();
        if (getOrgasmCount() > 2) {
          setUnlicumMode(false);
          vars.orgasmdown = -1;
          toggleState.orgasmdown = -1;
          resetOrgasmCount();
          vars.orgasmcurrent = 0;
        }
      }
    },

    unliarousal() {
      getVars().arousal = 10000;
    },
  };
}

export default createToggleDomainStatusActions;
