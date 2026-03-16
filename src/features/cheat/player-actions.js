import { byId, getFirstload, showToast } from '../../services/cheat-runtime.js';

const playerActions = {
  arousal_player: function () {
    const value = byId('arousal_val').value;
    if (isNaN(value)) return;
    showToast('Activated!');
    SugarCube.State.variables.arousal = parseInt((10000 * value) / 100);
  },
  arousal_enemy: function () {
    const value = byId('arousal_val').value;
    if (isNaN(value)) return;
    const arousal = SugarCube.State.variables.enemyarousalmax || 0;
    SugarCube.State.variables.enemyarousal = parseInt((arousal * value) / 100);
    showToast('Activated!');
  },
  aezakmi: function () {
    if (!SugarCube.State.variables.crime) return;
    let total = 0;
    let totalKeys = 0;

    for (const key in SugarCube.State.variables.crime) {
      const crime = SugarCube.State.variables.crime[key];
      const currentVal = parseInt(crime.current);
      if (!isNaN(currentVal)) {
        total += currentVal;
        totalKeys++;
      }
    }

    if (totalKeys === 0) return;

    total = parseInt((total - 100) / totalKeys);

    for (const key in SugarCube.State.variables.crime) {
      const crime = SugarCube.State.variables.crime[key];
      if (!isNaN(parseInt(crime.current))) {
        crime.current = total;
        crime.count = total;
        crime.countHistory = total;
        crime.history = total;
      }
    }

    getFirstload().crimecurrent();
    showToast('Activated!');
  },
  imdonefor: function () {
    if (!SugarCube.State.variables.crime) return;
    let total = 0;
    let totalKeys = 0;

    for (const key in SugarCube.State.variables.crime) {
      const crime = SugarCube.State.variables.crime[key];
      const currentVal = parseInt(crime.current);
      if (!isNaN(currentVal)) {
        total += currentVal;
        totalKeys++;
      }
    }

    if (totalKeys === 0) return;

    total = parseInt((total + 100) / totalKeys);

    for (const key in SugarCube.State.variables.crime) {
      const crime = SugarCube.State.variables.crime[key];
      if (!isNaN(parseInt(crime.current))) {
        crime.current = total;
      }
    }

    getFirstload().crimecurrent();
    showToast('Activated!');
  },
  imvirgintemple: function () {
    if (SugarCube.State.variables?.player?.virginity === undefined) {
      showToast('Failed!');
      return;
    }
    showToast('Activated!');
    SugarCube.State.variables.player.virginity.temple =
      !SugarCube.State.variables.player.virginity.temple;
    getFirstload().vowcurrent();
  },
  hesoyam: function () {
    showToast('Activated!');
    SugarCube.State.variables.pain = 0;
    SugarCube.State.variables.arousal = 0;
    SugarCube.State.variables.tiredness = 0;
    SugarCube.State.variables.stress = 0;
    SugarCube.State.variables.trauma = 0;
    SugarCube.State.variables.control = 1000;
    SugarCube.State.variables.drunk = 0;
    SugarCube.State.variables.drugged = 0;
    SugarCube.State.variables.hallucinogen = 0;
  },
  statmanager: function () {
    const statpick = byId('statpick').value;
    const value = parseFloat(byId('statinput').value);
    if (!isNaN(value)) {
      showToast('Activated!');
      SugarCube.State.variables[statpick] = value;
    } else {
      showToast('Value is not a number!');
    }
  },
  kill_player: function () {
    showToast('Activated!');
    SugarCube.State.variables.pain = 200;
    SugarCube.State.variables.arousal = 10000;
    SugarCube.State.variables.tiredness = 2000;
    SugarCube.State.variables.stress = 10000;
    SugarCube.State.variables.trauma = 5000;
    SugarCube.State.variables.control = 0;
    SugarCube.State.variables.drunk = 1000;
    SugarCube.State.variables.drugged = 1000;
    SugarCube.State.variables.hallucinogen = 1000;
  },
  kill_enemy: function () {
    showToast('Activated!');
    SugarCube.State.variables.enemyhealth = 0;
    SugarCube.State.variables.enemytrust = 100;
    SugarCube.State.variables.enemyanger = 0;
  },
  enemycalm: function () {
    showToast('Activated!');
    SugarCube.State.variables.enemyhealth = SugarCube.State.variables.enemyhealthmax > 0 ? 100 : 0;
    SugarCube.State.variables.enemytrust = 100;
    SugarCube.State.variables.enemyanger = 0;
  },
  statmanagere: function () {
    const statpicke = byId('statpicke')?.value;
    const value = Number(byId('statinpute')?.value);
    if (!statpicke || isNaN(value)) {
      showToast('Failed!');
      return;
    }
    showToast('Activated!');
    SugarCube.State.variables[statpicke] = value;
  },
  moneymanager: function () {
    const input = parseInt(byId('moneyinput').value);
    if (isNaN(input)) {
      showToast('failed : input is not a number!');
      return;
    }
    showToast('Activated!');
    SugarCube.State.variables.money = input;
  },
  bodymanager: function () {
    const bodypick = byId('bodypick')?.value;
    const bodySizes = { Tiny: 0, Small: 1, Normal: 2, Large: 3 };
    if (bodypick in bodySizes) {
      SugarCube.State.variables.bodysize = bodySizes[bodypick];
      showToast('Activated!');
      getFirstload().bodycurrent();
    } else {
      showToast('Failed!');
    }
  },
  bodytypemanager: function () {
    const bodytypepick = byId('bodytypepick')?.value;
    const bodyTypes = { Masculine: 'm', Feminine: 'f', Androgynous: 'a' };
    if (bodytypepick in bodyTypes) {
      SugarCube.State.variables.player.gender_body = bodyTypes[bodytypepick];
      showToast('Activated!');
      getFirstload().bodytypecurrent();
    } else {
      showToast('Failed!');
    }
  },
  sprayunlimited: function () {
    SugarCube.State.variables.infinitespray = SugarCube.State.variables.infinitespray === 1 ? 0 : 1;
    showToast('Activated!');
    getFirstload().spraystate();
  },
  ballsmanager: function () {
    if (SugarCube.State.variables.player.ballsExist === undefined) return;
    SugarCube.State.variables.player.ballsExist = !SugarCube.State.variables.player.ballsExist;
    showToast('Activated!');
    getFirstload().ballscurrent();
  },
  virginitymanager: function () {
    const virginitypick = byId('virginitypick').value;
    if (SugarCube.State.variables.player.virginity === undefined) return;
    SugarCube.State.variables.player.virginity[virginitypick] = true;
    getFirstload().virginitycurrent();
    showToast('Activated!');
  },
  virginitypure: function () {
    if (SugarCube.State.variables.player.virginity === undefined) return;
    const virginitypick = byId('virginitypick');
    const options = virginitypick.getElementsByTagName('option');
    for (let index = 0; index < options.length; index++) {
      SugarCube.State.variables.player.virginity[options[index].value] = true;
    }
    getFirstload().virginitycurrent();
    showToast('Activated!');
  },
  charamanager: function () {
    const statpick = byId('charapick').value;
    const value = parseInt(byId('charainput').value);
    if (!isNaN(value)) {
      showToast('Activated!');
      SugarCube.State.variables[statpick] = value;
    }
  },
  lactatingmanager: function () {
    SugarCube.State.variables.lactating = SugarCube.State.variables.lactating == 1 ? 0 : 1;
    getFirstload().lactatingcurrent();
    showToast('Activated!');
  },
  cummanager: function () {
    const value = parseInt(byId('cuminput').value);
    if (!isNaN(value)) {
      showToast('Activated!');
      SugarCube.State.variables.semen_volume = value;
      getFirstload().cumcurrent();
    }
  },
  milkmanager: function () {
    const value = parseInt(byId('milkinput').value);
    if (!isNaN(value)) {
      showToast('Activated!');
      SugarCube.State.variables.milk_volume = value;
      getFirstload().milkcurrent();
    }
  },
  cumfill: function () {
    SugarCube.State.variables.semen_amount = SugarCube.State.variables.semen_volume;
    showToast('Activated!');
  },
  milkfill: function () {
    SugarCube.State.variables.milk_amount = SugarCube.State.variables.milk_volume;
    showToast('Activated!');
  },
  infect: function () {
    if (SugarCube.State.variables.parasite === undefined) return;
    showToast('Activated!');
    const parasite = byId('parasitename').value;
    const body = byId('bodyparts').value;
    SugarCube.State.variables.parasite[parasite].push(body);
    SugarCube.State.variables.parasite[body].name = parasite;
  },
  desinfect: function () {
    if (SugarCube.State.variables.parasite === undefined) return;
    showToast('Activated!');
    const parasite = byId('parasitename').value;
    const body = byId('bodyparts').value;
    SugarCube.State.variables.parasite[body] = [];
    SugarCube.State.variables.parasite[parasite] = SugarCube.State.variables.parasite[
      parasite
    ].filter((item) => item !== body);
  },
  changetraitbro: function () {
    if (SugarCube.State.variables.NPCName === undefined) return;
    const npcName = byId('npcnames').value;
    const trait = byId('npctraits').value;
    const value = parseInt(byId('npcchangeinput').value);
    if (!isNaN(value)) {
      for (let index = 0; index < globalThis.npcnamelist.length; index++) {
        if (SugarCube.State.variables.NPCName[index].description === npcName) {
          SugarCube.State.variables.NPCName[index][trait] = value;
          showToast('Activated!');
          break;
        }
      }
    }
  },
  set_fame12: function () {
    const selected = byId('fame_name').value;
    const input = parseInt(byId('input_fame12').value);
    if (isNaN(input)) {
      showToast('failed : input is not a number!');
      return;
    }
    if (SugarCube.State.variables.fame[selected] === undefined) {
      showToast('failed!');
      return;
    }
    SugarCube.State.variables.fame[selected] = input;
    showToast('Activated!');
  },
  exammanager: function () {
    const selected = byId('select_exam').value;
    const input = parseInt(byId('input_exam').value);
    if (isNaN(input)) {
      showToast('failed : input is not a number!');
      return;
    }
    SugarCube.State.variables[selected] = input;
    showToast('Activated!');
  },
  talentmanager: function () {
    const selected = byId('select_talent').value;
    const input = parseInt(byId('input_talent').value);
    if (isNaN(input)) {
      showToast('failed : input is not a number!');
      return;
    }
    SugarCube.State.variables[selected] = input;
    showToast('Activated!');
  },
  set_hentai_skill: function () {
    showToast('Activated!');
    const selected = byId('select_hentai_skill').value;
    const input = parseInt(byId('input_hentai_skill').value);
    if (!selected || isNaN(input)) return;
    SugarCube.State.variables[selected] = input;
  },
};

export default playerActions;
