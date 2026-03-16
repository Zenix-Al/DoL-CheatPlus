import {
  animals,
  babyOptions,
  babyOptionsText,
  bodyparts,
  characteristics,
  downloadSite,
  exam,
  fame,
  hentaiSkill,
  npcinterest,
  npctrait,
  parasitename,
  school_rep,
  sourceCode,
  talent_skill,
} from '../../config/game-data.js';
import { GAME_VERSION_ELEMENT_ID, SHADOW_HOST_ID } from '../../constants/ui.js';
import { getRuntimeWindow, linkGlobalBindings } from '../../core/global-bridge.js';
import debugLog from '../../core/logger.js';

const runtimeWindow = getRuntimeWindow();
const runtimeSugarCube = runtimeWindow?.SugarCube || globalThis.SugarCube;

export let testedOn = globalThis.testedOn ?? '0.0.0';
export let cheatVer = globalThis.cheatVer ?? 'dev';
export let isServer = globalThis.isServer ?? 0;

export let shadowHost = null;
export let shadowRoot = null;

export let isLoad = false;
export let isDelete = false;
export let vars = runtimeSugarCube?.State?.variables ?? {};
export let isCheatPressed = false;
export let curVer = document.getElementById(GAME_VERSION_ELEMENT_ID)?.innerHTML ?? '';
export let quicklink = null;
export let statlink = null;
export let misclink = null;
export let quickcontent = null;
export let statscontent = null;
export let misccontent = null;
export let toastContainer = null;
export let modal = null;
export let modalContentContainer = null;
export let cheatVerType;
export let modalOpen;
export let functionsInProcess = 0;
export let functionsCompleted = 0;

export let functionbundle = {};
export let dailyfunctionbundle = {};
export let errorFunctions;
export let progressFunctions = 0;
export let totalFunctions = 0;
export let prevHour = -1;
export let extra_notif = false;

export let cheat = null;
export let clickCounter = 0;
export let curDate = 0;
export let buttonId;

export let npcnamelist = runtimeSugarCube?.setup?.NPCNameList ?? [];
export let orgasm_toggle = 0;
export let textBox = document.getElementById('tmpText');

export let isFetching = false;
export let totalFetchFunction;
export let currentFetch;

if (!vars.cheatPlus) vars.cheatPlus = {};
export let reactivatingToggles;
if (curVer?.startsWith('.')) curVer = '0' + curVer;

export let isTestingAllFunction = false;

export function getUiRoot() {
  return shadowRoot || document;
}

export function byUiId(id) {
  if (shadowRoot) {
    // Try getElementById (Chrome 105+), then fall back to querySelector
    if (typeof shadowRoot.getElementById === 'function') {
      const el = shadowRoot.getElementById(id);
      if (el) return el;
    }
    const el = shadowRoot.querySelector('#' + id);
    if (el) return el;
  }
  return document.getElementById(id);
}

export function ensureShadowRoot() {
  if (shadowRoot) return shadowRoot;
  if (!document.body) return null;

  shadowHost = document.getElementById(SHADOW_HOST_ID);
  if (!shadowHost) {
    shadowHost = document.createElement('div');
    shadowHost.id = SHADOW_HOST_ID;
    document.body.appendChild(shadowHost);
    try {
      debugLog('ui', 'ensureShadowRoot: created shadow host', { data: { id: SHADOW_HOST_ID } });
    } catch (e) {}
  }

  shadowRoot = shadowHost.shadowRoot || shadowHost.attachShadow({ mode: 'open' });
  try {
    debugLog('ui', 'ensureShadowRoot: shadowRoot attached', {
      data: { hasShadowRoot: !!shadowRoot },
    });
  } catch (e) {}
  return shadowRoot;
}

export function refreshUiRefs() {
  quicklink = byUiId('quick-link');
  statlink = byUiId('stats-link');
  misclink = byUiId('misc-link');
  quickcontent = byUiId('quick-content');
  statscontent = byUiId('stats-content');
  misccontent = byUiId('misc-content');
  toastContainer = byUiId('toastContainer');
  modal = byUiId('modal');
  modalContentContainer = byUiId('modal-content-container');
  cheat = byUiId('cheat');
  try {
    debugLog('ui', 'refreshUiRefs', {
      data: {
        cheat: !!cheat,
        modal: !!modal,
        modalContentContainer: !!modalContentContainer,
      },
    });
  } catch (e) {}
}

refreshUiRefs();

// Bridge SugarCube into userscript scope so isolated listeners can reference it directly.
try {
  const _rw = getRuntimeWindow();
  if (_rw && _rw !== globalThis && _rw.SugarCube) {
    Object.defineProperty(globalThis, 'SugarCube', {
      configurable: true,
      enumerable: false,
      get: () => _rw.SugarCube,
      set: () => {},
    });
  }
} catch (e) {}

linkGlobalBindings({
  testedOn: { get: () => testedOn, set: () => {} },
  cheatVer: { get: () => cheatVer, set: () => {} },
  isServer: { get: () => isServer, set: () => {} },
  shadowHost: { get: () => shadowHost, set: (value) => (shadowHost = value) },
  shadowRoot: { get: () => shadowRoot, set: (value) => (shadowRoot = value) },
  isLoad: { get: () => isLoad, set: (value) => (isLoad = value) },
  isDelete: { get: () => isDelete, set: (value) => (isDelete = value) },
  vars: { get: () => vars, set: (value) => (vars = value) },
  isCheatPressed: { get: () => isCheatPressed, set: (value) => (isCheatPressed = value) },
  curVer: { get: () => curVer, set: (value) => (curVer = value) },
  quicklink: { get: () => quicklink, set: (value) => (quicklink = value) },
  statlink: { get: () => statlink, set: (value) => (statlink = value) },
  misclink: { get: () => misclink, set: (value) => (misclink = value) },
  quickcontent: { get: () => quickcontent, set: (value) => (quickcontent = value) },
  statscontent: { get: () => statscontent, set: (value) => (statscontent = value) },
  misccontent: { get: () => misccontent, set: (value) => (misccontent = value) },
  toastContainer: { get: () => toastContainer, set: (value) => (toastContainer = value) },
  modal: { get: () => modal, set: (value) => (modal = value) },
  modalContentContainer: {
    get: () => modalContentContainer,
    set: (value) => (modalContentContainer = value),
  },
  cheatVerType: { get: () => cheatVerType, set: (value) => (cheatVerType = value) },
  modalOpen: { get: () => modalOpen, set: (value) => (modalOpen = value) },
  functionsInProcess: {
    get: () => functionsInProcess,
    set: (value) => (functionsInProcess = value),
  },
  functionsCompleted: {
    get: () => functionsCompleted,
    set: (value) => (functionsCompleted = value),
  },
  functionbundle: { get: () => functionbundle, set: (value) => (functionbundle = value) },
  dailyfunctionbundle: {
    get: () => dailyfunctionbundle,
    set: (value) => (dailyfunctionbundle = value),
  },
  errorFunctions: { get: () => errorFunctions, set: (value) => (errorFunctions = value) },
  progressFunctions: { get: () => progressFunctions, set: (value) => (progressFunctions = value) },
  totalFunctions: { get: () => totalFunctions, set: (value) => (totalFunctions = value) },
  prevHour: { get: () => prevHour, set: (value) => (prevHour = value) },
  extra_notif: { get: () => extra_notif, set: (value) => (extra_notif = value) },
  cheat: { get: () => cheat, set: (value) => (cheat = value) },
  clickCounter: { get: () => clickCounter, set: (value) => (clickCounter = value) },
  curDate: { get: () => curDate, set: (value) => (curDate = value) },
  buttonId: { get: () => buttonId, set: (value) => (buttonId = value) },
  npctrait: { get: () => npctrait, set: () => {} },
  characteristics: { get: () => characteristics, set: () => {} },
  npcinterest: { get: () => npcinterest, set: () => {} },
  npcnamelist: { get: () => npcnamelist, set: (value) => (npcnamelist = value) },
  bodyparts: { get: () => bodyparts, set: () => {} },
  parasitename: { get: () => parasitename, set: () => {} },
  fame: { get: () => fame, set: () => {} },
  school_rep: { get: () => school_rep, set: () => {} },
  animals: { get: () => animals, set: () => {} },
  orgasm_toggle: { get: () => orgasm_toggle, set: (value) => (orgasm_toggle = value) },
  exam: { get: () => exam, set: () => {} },
  talent_skill: { get: () => talent_skill, set: () => {} },
  hentaiSkill: { get: () => hentaiSkill, set: () => {} },
  textBox: { get: () => textBox, set: (value) => (textBox = value) },
  babyOptions: { get: () => babyOptions, set: () => {} },
  babyOptionsText: { get: () => babyOptionsText, set: () => {} },
  isFetching: { get: () => isFetching, set: (value) => (isFetching = value) },
  totalFetchFunction: {
    get: () => totalFetchFunction,
    set: (value) => (totalFetchFunction = value),
  },
  currentFetch: { get: () => currentFetch, set: (value) => (currentFetch = value) },
  reactivatingToggles: {
    get: () => reactivatingToggles,
    set: (value) => (reactivatingToggles = value),
  },
  isTestingAllFunction: {
    get: () => isTestingAllFunction,
    set: (value) => (isTestingAllFunction = value),
  },
  downloadSite: { get: () => downloadSite, set: () => {} },
  sourceCode: { get: () => sourceCode, set: () => {} },
});

// Small accessors/mutators to avoid assigning to imported bindings elsewhere
export function getUiRefs() {
  refreshUiRefs();
  return {
    quicklink,
    quickcontent,
    statlink,
    statscontent,
    misclink,
    misccontent,
  };
}

export function getIsLoad() {
  return isLoad;
}

export function setIsLoad(value) {
  isLoad = value;
}

export function getButtonId() {
  return buttonId;
}

export function setButtonId(value) {
  buttonId = value;
}

export function incrementClickCounter() {
  clickCounter += 1;
  return clickCounter;
}
