import { babyOptions, babyOptionsText } from '../../config/game-data.js';
import {
  getCheatPlus,
  getChildren,
  getContainer,
  getNPCName,
  getSexStats,
  getStoredNPCs,
} from '../../core/sugarcube/adapter.js';
import { setOptions, setRangeOptions, withElements } from '../../ui/helpers/hydrate-utils.js';

let mcBabyListOptionsLoaded = false;

export function update_mc_tentacle() {
  withElements({ location: 'mc_tentacle_location' }, ({ location }) => {
    const creatures = getContainer()?.[location.value]?.creatures ?? {};
    const options = Object.entries(creatures)
      .filter(([, creature]) => creature != null)
      .map(([key, creature]) => ({ value: key, label: creature.creature }));
    setOptions('mc_tentacle_select', options);
  });

  update_mc_tentacle_input();
}

export function update_mc_tentacle_input() {
  withElements(
    {
      select: 'mc_tentacle_select',
      location: 'mc_tentacle_location',
      input: 'mc_tentacle_input',
    },
    ({ select, location, input }) => {
      if (select.value === '') return;
      input.value = getContainer()?.[location.value]?.creatures?.[select.value]?.stats?.speed ?? '';
    }
  );
}

export function update_mc_baby_info() {
  withElements(
    {
      babySelect: 'mc_baby_select',
      actionSelect: 'mc_baby_action_select',
      input: 'mc_baby_input',
      tooltip: 'mc_baby_tooltip',
    },
    ({ babySelect, actionSelect, input, tooltip }) => {
      const child = getChildren()?.[babySelect.value];
      if (!child) return;

      const tooltipText = tooltip.querySelector('span');
      if (tooltipText) {
        tooltipText.textContent = `Name: ${child.name}, Father: ${child.father}, Mother: ${child.mother}, Location: ${child.birthLocation}`;
      }

      if (actionSelect.value === 'name') {
        input.type = 'text';
        input.value = child[actionSelect.value] || '';
      } else {
        input.type = 'checkbox';
        input.checked = Boolean(child[actionSelect.value]);
      }
    }
  );
}

export function update_mc_baby_list() {
  const hasUi = withElements(
    { babyActionSelect: 'mc_baby_action_select', babyInput: 'mc_baby_input' },
    ({ babyActionSelect, babyInput }) => {
      setOptions(
        'mc_baby_select',
        Object.keys(getChildren() ?? {}).map((key) => ({ value: key, label: key }))
      );

      update_mc_baby_info();

      if (!mcBabyListOptionsLoaded) {
        mcBabyListOptionsLoaded = true;
        babyInput.style.display = '';
        babyActionSelect.innerHTML = '';

        Object.entries(babyOptions).forEach(([key, value]) => {
          babyActionSelect.append(new Option(babyOptionsText[key], value));
        });
      }
    }
  );

  if (!hasUi) return;
}

export function update_mc_abortion_list() {
  withElements({ location: 'mc_abortion_location' }, ({ location }) => {
    const totalFetus = getSexStats()?.[location.value]?.pregnancy?.fetus?.length ?? 0;
    setRangeOptions('mc_abortion_select', totalFetus);
  });
}

export function update_named_npc_abortion_list() {
  withElements({ selectedNpc: 'named_npc_abortion_chara_select' }, ({ selectedNpc }) => {
    let totalFetus = 0;

    for (const npc of getNPCName() ?? []) {
      if (npc.description === selectedNpc.value && typeof npc.pregnancy.fetus === 'object') {
        totalFetus = npc.pregnancy.fetus.length;
      }
    }

    setRangeOptions('named_npc_abortion_select', totalFetus);
  });
}

export function update_npc_abortion_list() {
  const storedNpcs = getStoredNPCs();
  if (typeof storedNpcs?.pregnancy_0 !== 'object') return false;
  const hasUi = withElements({ abortionSelect: 'npc_abortion_chara_select' }, () => {});
  if (!hasUi) return false;

  const options = [];

  let number = 1;
  for (const key in storedNpcs) {
    options.push({
      value: key,
      label: number + '. ' + storedNpcs[key].pregnancy.fetus[0].mother,
    });
    number++;
  }

  for (const key in getCheatPlus()?.storedNPCs ?? {}) {
    options.push({
      value: key,
      label: number + '. ' + getCheatPlus().storedNPCs[key].pregnancy.fetus[0].mother,
    });
    number++;
  }

  setOptions('npc_abortion_chara_select', options);

  return true;
}

export function update_npc_fetus_abortion_list() {
  withElements({ abortionCharaSelect: 'npc_abortion_chara_select' }, ({ abortionCharaSelect }) => {
    const selected = abortionCharaSelect.value;
    let totalFetus = 0;

    if (selected.match(/pregnancy/)) {
      totalFetus = getStoredNPCs()?.[selected]?.pregnancy?.fetus?.length ?? 0;
    } else if (selected.match(/stored/)) {
      totalFetus = getCheatPlus()?.storedNPCs?.[selected]?.pregnancy?.fetus?.length ?? 0;
    }

    setRangeOptions('npc_abortion_select', totalFetus);
  });
}

const offspringUpdates = {
  update_mc_tentacle,
  update_mc_tentacle_input,
  update_mc_baby_info,
  update_mc_baby_list,
  update_mc_abortion_list,
  update_named_npc_abortion_list,
  update_npc_abortion_list,
  update_npc_fetus_abortion_list,
};

export default offspringUpdates;
