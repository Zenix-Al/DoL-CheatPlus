import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { getVars } from '../../core/sugarcube/state.js';
import { hydrateCheatUi } from '../fetchers/index.js';

export function createPlayerBodyActions() {
  return {
    bodytypemanager() {
      const bodytypepick = byId('bodytypepick')?.value;
      const bodyTypes = { Masculine: 'm', Feminine: 'f', Androgynous: 'a' };
      if (bodytypepick in bodyTypes) {
        getVars().player.gender_body = bodyTypes[bodytypepick];
        showToast('Activated!');
        hydrateCheatUi.bodytypecurrent();
      } else {
        showToast('Failed!');
      }
    },

    sprayunlimited() {
      getVars().infinitespray = getVars().infinitespray === 1 ? 0 : 1;
      showToast('Activated!');
      hydrateCheatUi.spraystate();
    },

    ballsmanager() {
      if (getVars().player.ballsExist === undefined) return;
      getVars().player.ballsExist = !getVars().player.ballsExist;
      showToast('Activated!');
      hydrateCheatUi.ballscurrent();
    },

    virginitymanager() {
      const virginitypick = byId('virginitypick').value;
      if (getVars().player.virginity === undefined) return;
      getVars().player.virginity[virginitypick] = true;
      hydrateCheatUi.virginitycurrent();
      showToast('Activated!');
    },

    virginitypure() {
      if (getVars().player.virginity === undefined) return;
      const virginitypick = byId('virginitypick');
      const options = virginitypick.getElementsByTagName('option');
      for (let index = 0; index < options.length; index++) {
        getVars().player.virginity[options[index].value] = true;
      }
      hydrateCheatUi.virginitycurrent();
      showToast('Activated!');
    },

    charamanager() {
      const statpick = byId('charapick').value;
      const value = parseInt(byId('charainput').value);
      if (!isNaN(value)) {
        showToast('Activated!');
        getVars()[statpick] = value;
      }
    },

    lactatingmanager() {
      getVars().lactating = getVars().lactating == 1 ? 0 : 1;
      hydrateCheatUi.lactatingcurrent();
      showToast('Activated!');
    },

    cummanager() {
      const value = parseInt(byId('cuminput').value);
      if (!isNaN(value)) {
        showToast('Activated!');
        getVars().semen_volume = value;
        hydrateCheatUi.cumcurrent();
      }
    },

    milkmanager() {
      const value = parseInt(byId('milkinput').value);
      if (!isNaN(value)) {
        showToast('Activated!');
        getVars().milk_volume = value;
        hydrateCheatUi.milkcurrent();
      }
    },

    cumfill() {
      getVars().semen_amount = getVars().semen_volume;
      showToast('Activated!');
    },

    milkfill() {
      getVars().milk_amount = getVars().milk_volume;
      showToast('Activated!');
    },

    infect() {
      if (getVars().parasite === undefined) return;
      showToast('Activated!');
      const parasite = byId('parasitename').value;
      const body = byId('bodyparts').value;
      getVars().parasite[parasite].push(body);
      getVars().parasite[body].name = parasite;
    },

    desinfect() {
      if (getVars().parasite === undefined) return;
      showToast('Activated!');
      const parasite = byId('parasitename').value;
      const body = byId('bodyparts').value;
      getVars().parasite[body] = [];
      getVars().parasite[parasite] = getVars().parasite[parasite].filter((item) => item !== body);
    },
  };
}

export default createPlayerBodyActions;
