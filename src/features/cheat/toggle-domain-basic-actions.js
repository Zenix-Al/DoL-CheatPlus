import { getNpcNameList } from '../../core/game-context.js';
import { setArrayCheck } from '../../core/sugarcube/cheat-config.js';
import { getVars } from '../../core/sugarcube/state.js';
import { showToast } from '../../ui/components/toast.js';
import { isBrokenStringIndexedArray, walkValueTree } from '../utils/value-tree.js';

export function createToggleDomainBasicActions(toggleState) {
  return {
    everyone_horny() {
      const vars = getVars();
      if (vars.NPCName === undefined) return;
      for (let index = 0; index < vars.NPCName.length; index++) {
        if (vars.NPCName[index].description !== 'Ivory Wraith') vars.NPCName[index].lust = 100;
      }
    },

    edenspring() {
      getVars().edenspring = 4;
    },
    edengarden() {
      getVars().edengarden = 4;
    },
    edentimer() {
      getVars().edendays = 0;
    },
    edenshrooms() {
      getVars().edenshrooms = 4;
    },

    checkArray() {
      const vars = getVars();
      toggleState.checkArrayThreshold += 1;
      if (toggleState.checkArrayThreshold <= 10) return;

      toggleState.checkArrayThreshold = 0;
      setArrayCheck(false);

      walkValueTree(vars, 'SugarCube.State.variables', (value, _path, controls) => {
        if (!isBrokenStringIndexedArray(value)) return;
        setArrayCheck(true);
        showToast('Broken array has been found!');
        controls.stop();
      });
    },

    maxchruchtask() {
      const vars = getVars();
      vars.temple_garden = 100;
      vars.temple_quarters = 100;
      vars.grace = 100;
    },

    maxanimaltask() {
      getVars().stray_happiness = 100;
    },

    purity() {
      getVars().purity = 1000;
    },

    virginity() {
      const vars = getVars();
      if (vars?.player?.virginity === undefined) return;
      vars.player.virginity.penile = true;
      vars.player.virginity.vaginal = true;
    },

    farm_safe() {
      const vars = getVars();
      if (vars.farm === undefined) return;
      vars.farm.aggro = 0;
    },

    interact_child() {
      const vars = getVars();
      if (vars?.children && typeof vars.children === 'object') {
        for (const key in vars.children) {
          const child = vars.children[key];
          const local = child?.localVariables;

          if (local?.event === true) {
            local.interactions = (local.interactions ?? 0) + 1;
            local.interactionsTotal = (local.interactionsTotal ?? 0) + 1;
            local.event = false;
          }
        }
      }
    },
  };
}

export default createToggleDomainBasicActions;
