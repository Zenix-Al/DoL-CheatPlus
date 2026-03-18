import {
  named_npc_pregnancy_locked,
  npc_pregnancy_locked,
  mc_pregnancy_locked,
  mc_pregnancy_locked_hole,
  mc_pregnancy_locked_type,
} from '../cheat/pregnancy-lock-state.js';
import { getNPCName, getSexStats, getStoredNPCs } from '../../core/sugarcube/adapter.js';
import { setChecked, setOptions, setValue, withElements } from '../../ui/helpers/hydrate-utils.js';

export function update_pregnancy_list_named_npc() {
  update_pregnancy_day_named_npc();
}

export function update_pregnancy_day_named_npc() {
  withElements({ select: 'named_npc_pregnancy_manager' }, ({ select }) => {
    if (select.value === '') return;

    const npc = getNPCName()?.[Number(select.value)];
    if (!npc?.pregnancy || npc.pregnancy.timerEnd == null || npc.pregnancy.timer == null) return;

    setValue('named_npc_pregnancy_input', (npc.pregnancy.timerEnd - npc.pregnancy.timer) / 3);
    setChecked(
      'named_npc_pregnancy_toggle',
      Array.isArray(named_npc_pregnancy_locked)
        ? named_npc_pregnancy_locked.includes(select.value)
        : false
    );
  });
}

export function update_pregnancy_list_npc() {
  update_pregnancy_day_npc();
}

export function update_pregnancy_day_npc() {
  withElements({ select: 'npc_pregnancy_manager' }, ({ select }) => {
    if (select.value === '') return;

    const npc = getStoredNPCs()?.[select.value];
    if (!npc?.pregnancy || npc.pregnancy.timerEnd == null || npc.pregnancy.timer == null) return;

    setValue('npc_pregnancy_input', (npc.pregnancy.timerEnd - npc.pregnancy.timer) / 3);
    setChecked(
      'npc_pregnancy_toggle',
      Array.isArray(npc_pregnancy_locked) ? npc_pregnancy_locked.includes(select.value) : false
    );
  });
}

export function update_pregnancy_list_mc() {
  withElements({ hole: 'mc_pregnancy_hole' }, ({ hole }) => {
    const pregnancy = getSexStats()?.[hole.value]?.pregnancy;
    if (!pregnancy) {
      setOptions('mc_pregnancy_manager', []);
      return;
    }

    if (pregnancy.type == 'parasite') {
      const options = Object.entries(pregnancy.fetus ?? {}).map(([key, fetus]) => ({
        value: key,
        label: fetus?.creature ?? key,
      }));
      setOptions('mc_pregnancy_manager', options);
    } else if (pregnancy.timerEnd != null) {
      setOptions('mc_pregnancy_manager', [{ value: 'baby', label: 'baby' }]);
    } else {
      setOptions('mc_pregnancy_manager', []);
    }
  });
}

export function update_pregnancy_day_mc() {
  withElements(
    {
      select: 'mc_pregnancy_manager',
      hole: 'mc_pregnancy_hole',
    },
    ({ select, hole }) => {
      if (select.value === '') return;
      const pregnancy = getSexStats()?.[hole.value]?.pregnancy;
      if (!pregnancy) return;

      const pregType = pregnancy.type;
      if (pregType == 'parasite') {
        setValue('mc_pregnancy_input', pregnancy.fetus?.[select.value]?.daysLeft ?? '');
      } else {
        if (pregnancy.timerEnd == null || pregnancy.timer == null) return;
        setValue('mc_pregnancy_input', (pregnancy.timerEnd - pregnancy.timer) / 3);
      }

      const lockIndex = Array.isArray(mc_pregnancy_locked)
        ? mc_pregnancy_locked.findIndex((name) => name == select.value)
        : -1;
      const lockState =
        lockIndex === -1
          ? 0
          : mc_pregnancy_locked_hole[lockIndex] != hole.value
          ? 1
          : mc_pregnancy_locked_type[lockIndex] != pregType
          ? 2
          : 3;

      setChecked('mc_pregnancy_toggle', lockState === 3);
    }
  );
}

const pregnancyUpdates = {
  update_pregnancy_list_named_npc,
  update_pregnancy_day_named_npc,
  update_pregnancy_list_npc,
  update_pregnancy_day_npc,
  update_pregnancy_list_mc,
  update_pregnancy_day_mc,
};

export default pregnancyUpdates;
