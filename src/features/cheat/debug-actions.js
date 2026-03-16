import {
  byId,
  convertStringIndexedArray,
  executeFunctions,
  getMycode,
  query,
  showToast,
} from '../../services/cheat-runtime.js';

const debugActions = {
  testAll: function () {
    showToast('Testing all functions...');
    executeFunctions(getMycode());
  },

  ArrayChecker: function () {
    function processValue(value, newPath) {
      if (Array.isArray(value) && value.length === 0) {
        const check = Object.keys(value);
        if (check.length > 0) {
          textBox.value += `${newPath}=convertStringIndexArrayToObject(${newPath});`;
          logBrokenArrayValues(value, newPath);
        }
      } else if (Array.isArray(value)) {
        logArrayValues(value, newPath);
      } else if (typeof value === 'object' && value !== null) {
        logObjectValues(value, newPath);
      }
    }

    function logObjectValues(obj, curPath) {
      for (const key in obj) {
        processValue(obj[key], `${curPath}.${key}`);
      }
    }

    function logArrayValues(obj, curPath) {
      for (let index = 0; index < obj.length; index++) {
        processValue(obj[index], `${curPath}[${index}]`);
      }
    }

    function logBrokenArrayValues(obj, curPath) {
      const check = Object.keys(obj);
      for (const key of check) {
        processValue(obj[key], `${curPath}[${key}]`);
      }
    }

    const textBoxId = byId('tmpText');
    textBoxId.value = '';
    const textBox = query('.tmpText');

    logObjectValues(SugarCube.State.variables, 'SugarCube.State.variables');
    textBox.focus();
    textBox.select();

    try {
      const successful = document.execCommand('copy');
      showToast('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
    } catch {
      showToast('Oops, unable to copy');
    }
  },

  stingJSSet: function () {
    function textToJS(str, value) {
      const path = str.split('.');
      let current = window;

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
