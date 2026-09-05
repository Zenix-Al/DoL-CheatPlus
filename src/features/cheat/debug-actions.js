import { showToast } from '../../ui/components/toast.js';
import { executeFunctionsInObject as executeFunctions } from '../../ui/renderers/cheat-form.js';

const debugActions = {
  testAll: function (actionBag = debugActions) {
    showToast('Testing all functions...');
    executeFunctions(actionBag);
  },
};

export default debugActions;
