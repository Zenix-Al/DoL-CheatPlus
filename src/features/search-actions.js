import { byUiId } from '../ui/helpers/dom-query.js';
import { showToast } from '../ui/components/toast.js';
import { ToggleScheduler } from '../services/toggle-scheduler.js';
import { dispatch } from '../core/actions/dispatcher.js';
import { getVariable, setVariable } from '../core/sugarcube/adapter.js';
import { getVars } from '../core/sugarcube/state.js';

import { walkValueTree } from './utils/value-tree.js';

export function executeSearch(action) {
  const vars = getVars();
  if (!vars) return;

  const searchTypeMap = ['startsWith', 'includes', 'endsWith'];
  const searchTypeEl = byUiId('search_type');
  const searchType = searchTypeMap[(searchTypeEl && searchTypeEl.value) || 0] || 'startsWith';
  const searchValueEl = byUiId('search_value');
  const searchTerm = (searchValueEl && searchValueEl.value.trim().toLowerCase()) || '';
  const searchResult = byUiId('search_result');
  if (!searchResult) return;

  searchResult.value = 'Result :\n';

  if (!searchTerm) {
    showToast('failed, Search key is blank!');
    return;
  }

  function checkObject(key, value, newPath) {
    if (key.toLowerCase()[searchType](searchTerm) && value !== '') {
      searchResult.value += `${newPath}=${value}\n`;
    }
  }

  function shouldMatchValue(value) {
    return !Array.isArray(value) && (typeof value !== 'object' || value === null);
  }

  if (action === 'search123') {
    showToast('Searching... might take a while');
    walkValueTree(vars, 'SugarCube.State.variables', (value, path, meta) => {
      if (
        shouldMatchValue(value) &&
        String(value).toLowerCase()[searchType](searchTerm) &&
        value !== ''
      ) {
        searchResult.value += `${path}=${value}\n`;
      }

      if (!meta.parentIsArray && meta.key) {
        checkObject(meta.key, value, path);
      }
    });
  } else if (action === 'search456') {
    showToast('Searching...');
    for (const prop in vars) {
      if (prop.toLowerCase()[searchType](searchTerm)) {
        searchResult.value += `SugarCube.State.variables.${prop}=${vars[prop]}\n`;
      }
    }
  }
}

export function restoreVariables() {
  let triggered = false;
  const bundles = ToggleScheduler.getBundles();
  if (getVariable('alluremod') === 0) {
    setVariable('alluremod', 1);
    showToast('Encounter rate enabled!');
  }
  if (typeof bundles.functionbundle['allNPCInstaPregnant'] === 'function') {
    dispatch('allNPCInstaPregnant');
    showToast('NPC instant pregnant is disabled!');
    triggered = true;
  }
  if (triggered) {
    showToast('This ensure the game settings isnt break.');
    showToast('You can re-enable it after youre done.');
  }
}
