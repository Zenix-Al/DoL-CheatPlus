import coreUpdates from './core-updates.js';
import miscUpdates from './misc-updates.js';
import offspringUpdates from './offspring-updates.js';
import pregnancyUpdates from './pregnancy-updates.js';
import { byUiId } from '../../ui/helpers/dom-refs.js';

const firstload = {
  update_toggle: function () {
    const appendCheckmark = (bundle) => {
      for (const id in bundle) {
        if (typeof bundle[id] === 'function') {
          const button = document.getElementById(id);
          if (button) button.innerHTML += '&#10003;';
        }
      }
    };

    appendCheckmark(globalThis.functionbundle ?? {});
    appendCheckmark(globalThis.dailyfunctionbundle ?? {});
  },
  ...coreUpdates,
  ...pregnancyUpdates,
  ...offspringUpdates,
  ...miscUpdates,
};

const alt_fetch = {
  update_pregnancy_mc: function () {
    firstload.update_pregnancy_list_mc();
    firstload.update_pregnancy_day_mc();
  },
};

function loadall() {
  if (SugarCube.State.variables.passage === 'Start') return;

  const moneyInput = byUiId('moneyinput');
  if (moneyInput) moneyInput.value = SugarCube.State.variables.money;

  let interval = 1;
  globalThis.isFetching = true;
  globalThis.totalFetchFunction = Object.keys(firstload).filter(
    (key) => typeof firstload[key] === 'function'
  ).length;
  globalThis.currentFetch = 0;

  Object.keys(firstload).forEach((functionName) => {
    if (typeof firstload[functionName] === 'function') {
      setTimeout(() => {
        firstload[functionName]();
        globalThis.currentFetch++;
      }, interval);
      interval += 1;
    }
  });
}

export function registerGlobals() {
  window.firstload = firstload;
  window.alt_fetch = alt_fetch;
  window.loadall = loadall;
}

export { firstload, alt_fetch, loadall };
export default firstload;
