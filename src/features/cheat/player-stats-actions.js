import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import { getVars } from '../../core/sugarcube/state.js';
import { hydrateCheatUi } from '../fetchers/index.js';

export function createPlayerStatsActions() {
  return {
    arousal_player() {
      const value = byId('arousal_val').value;
      if (isNaN(value)) return;
      showToast('Activated!');
      getVars().arousal = parseInt((10000 * value) / 100);
    },

    arousal_enemy() {
      const value = byId('arousal_val').value;
      if (isNaN(value)) return;
      const arousal = getVars().enemyarousalmax || 0;
      getVars().enemyarousal = parseInt((arousal * value) / 100);
      showToast('Activated!');
    },

    aezakmi() {
      if (!getVars().crime) return;
      let total = 0;
      let totalKeys = 0;

      for (const key in getVars().crime) {
        const crime = getVars().crime[key];
        const currentVal = parseInt(crime.current);
        if (!isNaN(currentVal)) {
          total += currentVal;
          totalKeys++;
        }
      }

      if (totalKeys === 0) return;

      total = parseInt((total - 100) / totalKeys);

      for (const key in getVars().crime) {
        const crime = getVars().crime[key];
        if (!isNaN(parseInt(crime.current))) {
          crime.current = total;
          crime.count = total;
          crime.countHistory = total;
          crime.history = total;
        }
      }

      hydrateCheatUi.crimecurrent();
      showToast('Activated!');
    },

    imdonefor() {
      if (!getVars().crime) return;
      let total = 0;
      let totalKeys = 0;

      for (const key in getVars().crime) {
        const crime = getVars().crime[key];
        const currentVal = parseInt(crime.current);
        if (!isNaN(currentVal)) {
          total += currentVal;
          totalKeys++;
        }
      }

      if (totalKeys === 0) return;

      total = parseInt((total + 100) / totalKeys);

      for (const key in getVars().crime) {
        const crime = getVars().crime[key];
        if (!isNaN(parseInt(crime.current))) {
          crime.current = total;
        }
      }

      hydrateCheatUi.crimecurrent();
      showToast('Activated!');
    },

    imvirgintemple() {
      if (getVars()?.player?.virginity === undefined) {
        showToast('Failed!');
        return;
      }
      showToast('Activated!');
      getVars().player.virginity.temple = !getVars().player.virginity.temple;
      hydrateCheatUi.vowcurrent();
    },

    hesoyam() {
      showToast('Activated!');
      getVars().pain = 0;
      getVars().arousal = 0;
      getVars().tiredness = 0;
      getVars().stress = 0;
      getVars().trauma = 0;
      getVars().control = 1000;
      getVars().drunk = 0;
      getVars().drugged = 0;
      getVars().hallucinogen = 0;
    },

    statmanager() {
      const statpick = byId('statpick').value;
      const value = parseFloat(byId('statinput').value);
      if (!isNaN(value)) {
        showToast('Activated!');
        getVars()[statpick] = value;
      } else {
        showToast('Value is not a number!');
      }
    },

    kill_player() {
      showToast('Activated!');
      getVars().pain = 200;
      getVars().arousal = 10000;
      getVars().tiredness = 2000;
      getVars().stress = 10000;
      getVars().trauma = 5000;
      getVars().control = 0;
      getVars().drunk = 1000;
      getVars().drugged = 1000;
      getVars().hallucinogen = 1000;
    },

    kill_enemy() {
      showToast('Activated!');
      getVars().enemyhealth = 0;
      getVars().enemytrust = 100;
      getVars().enemyanger = 0;
    },

    enemycalm() {
      showToast('Activated!');
      getVars().enemyhealth = getVars().enemyhealthmax > 0 ? 100 : 0;
      getVars().enemytrust = 100;
      getVars().enemyanger = 0;
    },

    statmanagere() {
      const statpicke = byId('statpicke')?.value;
      const value = Number(byId('statinpute')?.value);
      if (!statpicke || isNaN(value)) {
        showToast('Failed!');
        return;
      }
      showToast('Activated!');
      getVars()[statpicke] = value;
    },
  };
}

export default createPlayerStatsActions;
