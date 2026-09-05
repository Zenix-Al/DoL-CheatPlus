import { getVars } from '../../core/sugarcube/state.js';

export function createToggleDomainBasicActions() {
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
