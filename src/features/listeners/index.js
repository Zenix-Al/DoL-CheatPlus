import { showToast } from '../../ui/components/toast.js';
import { openModal, closeModal } from '../../ui/components/modal.js';
import {
  moveButton,
  Enable_cheat_history,
  Enable_sidebar_button,
  simple_cheat_button,
} from '../../ui/components/controls.js';
import { showContent } from '../../ui/helpers/ui-display.js';
import { executeSearch, restoreVariables } from '../../ui/renderers/cheat-form.js';
import {
  getAltFetch,
  getCheat,
  getFirstload,
  getIsLoad,
  getMycode,
  getUiRefs,
  incrementClickCounter,
  initStorage,
  reactivateToggles,
  setButtonId,
  setIsLoad,
} from '../../services/cheat-runtime.js';
import {
  createButtonActions,
  createChangeActions,
  createInputActions,
  createMainActions,
} from './action-maps.js';
import { dispatch, isRegistered, setErrorHook } from '../../core/actions/dispatcher.js';
import { registerAllActions } from '../cheat/register.js';

const mycode = getMycode();
const firstload = getFirstload();
const altFetch = getAltFetch();
function buildMainActions() {
  return createMainActions({
    closeModal,
    moveButton,
    openModal,
    showContent,
    uiRefs: getUiRefs(),
    mycode,
  });
}

let mainActions = buildMainActions();

let buttonActions = createButtonActions({
  Enable_cheat_history,
  Enable_sidebar_button,
  executeSearch,
  simple_cheat_button,
  mycode,
});

let changeActions = createChangeActions({ altFetch, firstload });
let inputActions = createInputActions({ firstload });

// Register all action maps into the central dispatcher and install the toast error hook.
// This runs once at module evaluation; re-registration on re-inject is harmless (handlers overwrite).
registerAllActions({ buttonActions, mainActions, changeActions, inputActions });
setErrorHook((key, _err) => showToast(`Action "${key}" failed.`));

function initListeners() {
  const cheat = getCheat();
  if (!cheat) return;

  cheat.addEventListener('click', function (event) {
    let target = event.target;
    if (target && typeof target.closest === 'function') {
      target = target.closest('[id]') || target;
    }
    if (!target.id) return;
    setButtonId(target.id);

    // Fast path: metadata-rendered controls carry data-action — route through dispatcher.
    const dataAction = (event.target || target).dataset?.action;
    if (dataAction && isRegistered(dataAction)) {
      dispatch(dataAction);
      event.stopPropagation();
      return;
    }

    if (
      (target.tagName === 'A' || target.tagName === 'BUTTON') &&
      target.closest('.modal-content')
    ) {
      if (
        SugarCube.State.variables.passage == 'Start' &&
        !(target.id == 'save_data' || target.id == 'load_data' || target.id == 'VrelCoinsUsage')
      ) {
        showToast('Still in the main menu!');
        return;
      }
      if (target.id in buttonActions) {
        buttonActions[target.id]();
      }
    } else if (target.id in mainActions) {
      // Modal and nav refs are injected lazily, so refresh map before dispatch.
      mainActions = buildMainActions();
      mainActions[target.id]();
    } else if (getIsLoad()) {
      initStorage();
      reactivateToggles();
      showToast('Cheat state loaded');
      setIsLoad(false);
    }
    event.stopPropagation();
  });
  cheat.addEventListener('change', function (event) {
    if (SugarCube.State.variables.passage == 'Start') return;
    let target = event.target;
    // Fast path: data-action on metadata-rendered selects.
    const dataAction = target.dataset?.action;
    if (dataAction && isRegistered(dataAction)) {
      dispatch(dataAction);
      event.stopPropagation();
      return;
    }
    if (target.id in changeActions) {
      changeActions[target.id]();
    }
    event.stopPropagation();
  });

  //input slider listener

  cheat.addEventListener('input', function (event) {
    let target = event.target;
    // Fast path: data-action on metadata-rendered range/text inputs.
    const dataAction = target.dataset?.action;
    if (dataAction && isRegistered(dataAction)) {
      dispatch(dataAction);
      return;
    }
    if (target.id in inputActions) {
      inputActions[target.id]();
    }
    event.stopPropagation();
  });

  //document listener for toggle cheat
  document.addEventListener('click', function (event) {
    if (SugarCube.State.variables.passage === 'Settings') {
      //restore variables in certain passage to avoid error.
      restoreVariables();
    } else {
      incrementClickCounter();
      mycode.runitall();
    }
    //to avoid this variable undefined and causing an error
    let target = event.target;
    if (target.classList.contains('macro-button') && target.innerHTML == 'SAVES') {
      setIsLoad(true);
    } else if (getIsLoad()) {
      initStorage();
      reactivateToggles();
      showToast('Cheat state loaded');
      setIsLoad(false);
    } else if (target.id == 'history-backward' || target.id === 'history-forward') {
      initStorage();
    }
  });

  document.addEventListener('keyup', function () {
    if (SugarCube.State.variables.passage != 'Settings') {
      incrementClickCounter();
      mycode.runitall();
    }
  });
  cheat.addEventListener('keyup', function (event) {
    event.stopPropagation();
  });
}

export function registerGlobals() {
  window.initListeners = initListeners;
  window.mainActions = mainActions;
  window.buttonActions = buttonActions;
  window.changeActions = changeActions;
  window.inputActions = inputActions;
}

export { initListeners, mainActions, buttonActions, changeActions, inputActions };
