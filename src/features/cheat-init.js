import {
  buildMiscSection,
  buildQuickSection,
  buildStatsSection,
} from '../ui/renderers/sections/cheat-sections.js';
import { generatetext } from '../ui/renderers/cheat-form.js';
import { byUiId } from '../ui/helpers/dom-refs.js';
import { getRuntimeWindow } from '../core/global-bridge.js';
import debugLog from '../core/logger.js';

// prefer debug helper if present
const dbg = globalThis.CheatPlusDebug ?? null;

//generate interface (ids, inputs, textInputs)
//quick
function init_interface() {
  try {
    dbg?.dump('init_interface-start');
    debugLog('cheat-init', 'init_interface-start');
  } catch (e) {}
  const runtimeWindow = getRuntimeWindow();
  const context = {
    generatetext,
    data: {
      animals: globalThis.animals || runtimeWindow?.animals,
      babyOptions: globalThis.babyOptions || runtimeWindow?.babyOptions,
      bodyparts: globalThis.bodyparts || runtimeWindow?.bodyparts,
      characteristics: globalThis.characteristics || runtimeWindow?.characteristics,
      downloadSite: globalThis.downloadSite || runtimeWindow?.downloadSite,
      exam: globalThis.exam || runtimeWindow?.exam,
      fame: globalThis.fame || runtimeWindow?.fame,
      hentaiSkill: globalThis.hentaiSkill || runtimeWindow?.hentaiSkill,
      npcnamelist: globalThis.npcnamelist || runtimeWindow?.npcnamelist,
      npctrait: globalThis.npctrait || runtimeWindow?.npctrait,
      parasitename: globalThis.parasitename || runtimeWindow?.parasitename,
      school_rep: globalThis.school_rep || runtimeWindow?.school_rep,
      sourceCode: globalThis.sourceCode || runtimeWindow?.sourceCode,
      talent_skill: globalThis.talent_skill || runtimeWindow?.talent_skill,
    },
    runtime: {
      testedOn: globalThis.testedOn || runtimeWindow?.testedOn,
      curVer: globalThis.curVer || runtimeWindow?.curVer,
      isCheatWorkSymbol: globalThis.isCheatWorkSymbol || runtimeWindow?.isCheatWorkSymbol,
      isCheatWork: globalThis.isCheatWork || runtimeWindow?.isCheatWork,
      isServer: globalThis.isServer || runtimeWindow?.isServer,
      cheatVer: globalThis.cheatVer || runtimeWindow?.cheatVer,
      cheatVerType: globalThis.cheatVerType || runtimeWindow?.cheatVerType,
    },
  };

  // Ensure generatetext exists; if not, render a visible diagnostic message into modal
  if (typeof context.generatetext !== 'function') {
    console.warn('[CheatPlus] generatetext missing during init_interface');
    try {
      dbg?.dump('generatetext-missing');
      debugLog('cheat-init', 'generatetext-missing', { data: { byUiId_modal: !!byUiId('modal') } });
    } catch (e) {}
    const container = byUiId('modal-content-container') || byUiId('cheat') || document.body;
    const msg = document.createElement('div');
    msg.style.cssText = 'color:#f88; padding:8px;';
    msg.textContent = 'Cheat UI: runtime not ready (generatetext missing). Try reloading the page.';
    container.appendChild(msg);
    return;
  }

  // Clear existing section contents so repeated calls are idempotent
  try {
    ['quick-content', 'stats-content', 'misc-content'].forEach((id) => {
      const el = byUiId(id) || document.getElementById(id);
      if (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
      }
    });
  } catch (e) {
    // non-fatal
    debugLog('cheat-init', 'failed to clear existing sections', { data: e, level: 'warn' });
  }

  buildQuickSection(context);
  buildStatsSection(context);
  buildMiscSection(context);

  var element = byUiId('tmpText') || document.getElementById('tmpText');
  if (element) element.classList.add('tmpText');
  try {
    dbg?.dump('init_interface-done');
    debugLog('cheat-init', 'init_interface-done');
  } catch (e) {}
}

export function registerGlobals() {
  window.init_interface = init_interface;
}

export { init_interface };
