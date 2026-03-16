export const convertStringIndexArrayToObject = (arr) => {
  const obj = {};
  for (const key in arr) {
    if (typeof key === 'string') {
      obj[key] = arr[key];
    }
  }
  return obj;
};

import {
  byUiId,
  isFetching,
  currentFetch,
  totalFetchFunction,
  getButtonId,
} from '../helpers/dom-refs.js';
import { set as setState } from '../../core/state/index.js';

export function generatetext(ids, inputs, textInputs, category) {
  const inputcategory = byUiId(category);
  const modalInputs = document.createElement('div');
  modalInputs.className = 'modal-content-padding';

  for (let i = 0; i < inputs.length; i++) {
    let element;

    switch (inputs[i]) {
      case 'input':
        element = document.createElement('input');
        element.id = ids[i];
        element.className = 'modal-content-width';
        element.autocomplete = 'off';
        break;

      case 'textarea':
        element = document.createElement('textarea');
        element.id = ids[i];
        element.className = 'modal-content-width';
        element.style = 'height: 100px; line-height: 1.5; width: 100%; min-width: 0;';
        element.autocomplete = 'off';
        element.spellcheck = false;
        break;

      case 'select':
        element = document.createElement('select');
        element.id = ids[i];
        textInputs[i].forEach((optionText) => {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          element.appendChild(option);
        });
        break;

      case 'button':
        element = document.createElement('button');
        element.type = 'button';
        element.id = ids[i];
        element.className = 'modal-button';
        element.textContent = textInputs[i];
        break;

      case 'radio':
        element = document.createDocumentFragment();
        textInputs[i].forEach((radioText, j) => {
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.id = `${ids[i]}${j}`;
          radio.name = ids[i];
          radio.value = radioText;

          const label = document.createElement('label');
          label.htmlFor = `${ids[i]}${j}`;
          label.className = 'modal-content-right';
          label.textContent = radioText;

          element.appendChild(radio);
          element.appendChild(label);
        });
        break;

      case 'header':
        element = document.createElement('span');
        element.className = 'gold';
        element.textContent = textInputs[i];
        break;

      case 'newline':
        element = document.createElement('br');
        break;

      case 'text':
        element = document.createTextNode(textInputs[i]);
        break;

      case 'range':
        element = document.createElement('input');
        element.type = 'range';
        element.id = ids[i];
        element.min = '0';
        element.max = textInputs[i];
        element.value = '0';
        break;

      case 'link':
        element = document.createElement('a');
        element.href = ids[i];
        element.target = '_blank';
        element.className = 'modal-link';
        element.textContent = textInputs[i];
        break;

      case 'tooltip':
        element = document.createElement('span');
        element.className = 'tooltip-small linkBlue';
        element.id = ids[i];
        element.innerHTML = `(?)<span>${textInputs[i]}</span>`;
        break;

      case 'checkbox': {
        element = document.createElement('input');
        element.id = ids[i];
        element.type = 'checkbox';
        element.className = 'modal-content-color';

        const label = document.createTextNode(textInputs[i]);
        modalInputs.appendChild(element);
        modalInputs.appendChild(label);
        continue;
      }
    }

    if (element) modalInputs.appendChild(element);
    if (inputs.length > 1 && i < inputs.length - 1)
      modalInputs.appendChild(document.createTextNode(' | '));
  }

  inputcategory.appendChild(modalInputs);
}

export function deleteText() {
  // isFetching is backed by the dom-refs module var (via linkGlobalBindings proxy).
  // Writing through window keeps the live binding in sync so the guard below resolves.
  if (currentFetch === totalFetchFunction) window.isFetching = false;
  if (isFetching) {
    requestAnimationFrame(deleteText);
    return;
  }
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

export function executeSearch(action) {
  if (action == null) action = getButtonId();
  const searchTypeMap = ['startsWith', 'includes', 'endsWith'];
  const searchTypeEl = byUiId('search_type');
  const searchType = searchTypeMap[(searchTypeEl && searchTypeEl.value) || 0] || 'startsWith';
  const searchValueEl = byUiId('search_value');
  const searchTerm = (searchValueEl && searchValueEl.value.trim().toLowerCase()) || '';
  const searchResult = byUiId('search_result');

  searchResult.value = 'Result :\n';

  if (!searchTerm) {
    if (typeof window.showToast === 'function') window.showToast('failed, Search key is blank!');
    return;
  }

  function processValue(value, newPath) {
    if (Array.isArray(value)) {
      value.length ? logArrayValues(value, newPath) : logObjectValues(value, newPath);
    } else if (typeof value === 'object' && value !== null) {
      logObjectValues(value, newPath);
    } else if (String(value).toLowerCase()[searchType](searchTerm) && value !== '') {
      searchResult.value += `${newPath}=${value}\n`;
    }
  }

  function checkObject(key, value, newPath) {
    if (key.toLowerCase()[searchType](searchTerm) && value !== '') {
      searchResult.value += `${newPath}=${value}\n`;
    }
  }

  function logObjectValues(obj, curPath) {
    for (const key in obj) {
      const value = obj[key];
      const newPath = `${curPath}.${key}`;
      processValue(value, newPath);
      checkObject(key, value, newPath);
    }
  }

  function logArrayValues(arr, curPath) {
    arr.forEach((value, i) => processValue(value, `${curPath}[${i}]`));
  }

  if (action === 'search123') {
    if (typeof window.showToast === 'function') window.showToast('Searching... might take a while');
    logObjectValues(SugarCube.State.variables, 'SugarCube.State.variables');
  } else if (action === 'search456') {
    if (typeof window.showToast === 'function') window.showToast('Searching...');
    for (const prop in SugarCube.State.variables) {
      if (prop.toLowerCase()[searchType](searchTerm)) {
        searchResult.value += `SugarCube.State.variables.${prop}=${SugarCube.State.variables[prop]}\n`;
      }
    }
  }
}

export function restoreVariables() {
  var triggered = false;
  if (SugarCube.State.variables.alluremod === 0) {
    SugarCube.State.variables.alluremod = 1;
    if (typeof window.showToast === 'function') window.showToast('Encounter rate enabled!');
  }
  if (
    typeof window.functionbundle !== 'undefined' &&
    typeof window.functionbundle['allNPCInstaPregnant'] === 'function'
  ) {
    if (
      typeof window.buttonActions === 'object' &&
      typeof window.buttonActions['allNPCInstaPregnant'] === 'function'
    )
      window.buttonActions['allNPCInstaPregnant']();
    if (typeof window.showToast === 'function')
      window.showToast('NPC instant pregnant is disabled!');
    triggered = true;
  }
  if (triggered) {
    if (typeof window.showToast === 'function')
      window.showToast('This ensure the game settings isnt break.');
    if (typeof window.showToast === 'function')
      window.showToast('You can re-enable it after youre done.');
  }
}

export function executeFunctionsInObject(obj) {
  if (window.isTestingAllFunction) return;
  window.isTestingAllFunction = true;
  let total = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      console.log(`Executing function at key: ${key}`);
      obj[key]();
      total++;
    }
  }
  if (typeof window.timedToast === 'function') window.timedToast('testing complete', 5000);
  if (typeof window.timedToast === 'function')
    window.timedToast(`Total function tested ${total}`, 5000);
  window.isTestingAllFunction = false;
}
