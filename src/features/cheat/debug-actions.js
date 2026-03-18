import { showToast } from '../../ui/components/toast.js';
import { byUiId as byId } from '../../ui/helpers/dom-query.js';
import {
  convertStringIndexArrayToObject as convertStringIndexedArray,
  executeFunctionsInObject as executeFunctions,
} from '../../ui/renderers/cheat-form.js';
import { getRuntimeWindow } from '../../core/global-bridge.js';
import { getVars } from '../../core/sugarcube/state.js';
import { isBrokenStringIndexedArray, walkValueTree } from '../utils/value-tree.js';

const query = (selector) => document.querySelector(selector);

const debugActions = {
  testAll: function (actionBag = debugActions) {
    showToast('Testing all functions...');
    executeFunctions(actionBag);
  },

  ArrayChecker: function () {
    const textBoxId = byId('tmpText');
    const vars = getVars();
    textBoxId.value = '';
    const textBox = query('.tmpText');
    if (!textBox || !vars) return;

    walkValueTree(vars, 'SugarCube.State.variables', (value, path) => {
      if (!isBrokenStringIndexedArray(value)) return;
      textBox.value += `${path}=convertStringIndexArrayToObject(${path});`;
    });

    textBox.focus();
    textBox.select();

    try {
      const successful = document.execCommand('copy');
      showToast('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch {
      showToast('Oops, unable to copy');
    }
  },

  stringJSSet: function () {
    function textToJS(str, value) {
      const path = str.split('.');
      let current = getRuntimeWindow();

      for (let index = 0; index < path.length - 1; index++) {
        current = current?.[path[index]];
        if (!current) {
          showToast('error');
          return;
        }
      }

      current[path[path.length - 1]] = value;
      showToast('Activated.');
    }

    const string = byId('stringJS').value;
    const value = byId('stringValue').value;
    textToJS(string, isNaN(parseFloat(value)) ? value : parseFloat(value));
  },

  convertStringIndexedArray,
};

export default debugActions;
