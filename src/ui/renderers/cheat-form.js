import { byUiId } from '../helpers/dom-query.js';
import { getIsTestingAllFunction, setIsTestingAllFunction } from '../../core/runtime-state.js';
import { set as setState } from '../../core/state/index.js';
import { timedToast } from '../components/toast.js';

export const convertStringIndexArrayToObject = (arr) => {
  const obj = {};
  for (const key in arr) {
    if (typeof key === 'string') {
      obj[key] = arr[key];
    }
  }
  return obj;
};

export function deleteText() {
  setState('modal.isDelete', true);

  ['quick-content', 'stats-content', 'misc-content'].forEach((id) => {
    const content = byUiId(id);
    if (!content) return;
    while (content.firstChild) {
      content.firstChild.remove();
    }
  });

  setState('modal.isDelete', false);
}

export function executeFunctionsInObject(obj) {
  if (getIsTestingAllFunction()) return;
  setIsTestingAllFunction(true);
  let total = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      console.log(`Executing function at key: ${key}`);
      obj[key]();
      total++;
    }
  }
  timedToast('testing complete', 5000);
  timedToast(`Total function tested ${total}`, 5000);
  setIsTestingAllFunction(false);
}
