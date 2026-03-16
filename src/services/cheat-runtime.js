import { firstload, alt_fetch } from '../features/fetchers/index.js';
import { mycode } from '../features/actions.js';
import { getRuntimeWindow } from '../core/global-bridge.js';
import { initStorage as _initStorage, reactivateToggles as _reactivateToggles } from './storage.js';
import { showToast as _showToast, timedToast as _timedToast } from '../ui/components/toast.js';
import { bloodEffect as _bloodEffect, closeModal as _closeModal } from '../ui/components/modal.js';
import {
  executeFunctionsInObject,
  convertStringIndexArrayToObject,
} from '../ui/renderers/cheat-form.js';
import {
  byUiId as _byUiId,
  getUiRefs as _getUiRefs,
  getIsLoad as _getIsLoad,
  setIsLoad as _setIsLoad,
  getButtonId as _getButtonId,
  setButtonId as _setButtonId,
  incrementClickCounter as _incrementClickCounter,
} from '../ui/helpers/dom-refs.js';

export const byId = (id) => _byUiId(id);
export const query = (selector) => document.querySelector(selector);

export const getVars = () => {
  const rw = getRuntimeWindow();
  return (rw?.SugarCube ?? globalThis.SugarCube)?.State?.variables;
};
export const getFirstload = () => firstload || globalThis.firstload || null;
export const getMycode = () => mycode || globalThis.mycode || null;
export const getFunctionBundle = () => {
  // functionbundle lives in dom-refs and is exported to global scope for legacy consumers; access via global if needed
  return globalThis.functionbundle ?? {};
};
export const getButtonActions = () => globalThis.buttonActions || {};
export const getAltFetch = () => alt_fetch;
export const getCheat = () => {
  // `cheat` can live in Shadow DOM in the userscript build.
  return _byUiId('cheat') || document.getElementById('cheat');
};
export const getUiRefs = () => _getUiRefs();
export const getIsLoad = () => _getIsLoad();
export const setIsLoad = (value) => _setIsLoad(value);
export const getButtonId = () => _getButtonId();
export const setButtonId = (value) => _setButtonId(value);
export const incrementClickCounter = () => _incrementClickCounter();
export const initStorageService = () => _initStorage();
export const reactivateTogglesService = () => _reactivateToggles();

// Backwards-compatible named exports used by listeners and other modules
export const initStorage = () => _initStorage();
export const reactivateToggles = () => _reactivateToggles();

export const showToastService = (message) => _showToast(message);
export const timedToastService = (message, delay) => _timedToast(message, delay);
export const showToast = (message) => _showToast(message);
export const timedToast = (message, delay) => _timedToast(message, delay);
export const bloodEffectService = () => _bloodEffect();
export const closeModalService = () => _closeModal();
export const bloodEffect = () => _bloodEffect();
export const closeModal = () => _closeModal();
export const executeFunctions = (value) => executeFunctionsInObject(value);
export const convertStringIndexedArray = (value) => convertStringIndexArrayToObject(value);
