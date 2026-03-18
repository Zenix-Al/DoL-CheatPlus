import { renderRegistry } from '../ui/renderers/metadata-renderer.js';
import {
  createQuickMetadata,
  createStatMetadata,
  createMiscMetadata,
  validateRegistry,
} from '../ui/metadata/index.js';
import { byUiId } from '../ui/helpers/dom-query.js';
import {
  cheatVer,
  cheatVerType,
  curVer,
  isServer,
  npcnamelist,
  testedOn,
} from '../core/game-context.js';
import { getRuntimeWindow } from '../core/global-bridge.js';
import debugLog from '../core/logger.js';
import { safeCall } from '../core/safe-exec.js';
import {
  animals,
  babyOptions,
  bodyparts,
  characteristics,
  downloadSite,
  exam,
  fame,
  hentaiSkill,
  npctrait,
  parasitename,
  school_rep,
  sourceCode,
  talent_skill,
} from '../config/game-data.js';

//generate interface (ids, inputs, textInputs)
//quick
function init_interface() {
  safeCall('init_interface-start', () => {
    debugLog('cheat-init', 'init_interface-start');
  });
  const runtimeWindow = getRuntimeWindow();
  const context = {
    data: {
      animals,
      babyOptions,
      bodyparts,
      characteristics,
      downloadSite,
      exam,
      fame,
      hentaiSkill,
      npcnamelist: npcnamelist || runtimeWindow?.npcnamelist,
      npctrait,
      parasitename,
      school_rep,
      sourceCode,
      talent_skill,
    },
    runtime: {
      testedOn: testedOn || runtimeWindow?.testedOn,
      curVer: curVer || runtimeWindow?.curVer,
      isCheatWorkSymbol: runtimeWindow?.isCheatWorkSymbol,
      isCheatWork: runtimeWindow?.isCheatWork,
      isServer: isServer || runtimeWindow?.isServer,
      cheatVer: cheatVer || runtimeWindow?.cheatVer,
      cheatVerType: cheatVerType || runtimeWindow?.cheatVerType,
    },
  };

  // Clear existing section contents so repeated calls are idempotent
  safeCall(
    'failed to clear existing sections',
    () => {
      ['quick-content', 'stats-content', 'misc-content'].forEach((id) => {
        const el = byUiId(id) || document.getElementById(id);
        if (el) {
          while (el.firstChild) el.removeChild(el.firstChild);
        }
      });
    },
    {
      onError: (err) => {
        debugLog('cheat-init', 'failed to clear existing sections', { data: err, level: 'warn' });
      },
    }
  );

  const quick = createQuickMetadata(context);
  const stat = createStatMetadata(context);
  const misc = createMiscMetadata(context);

  validateRegistry(quick, 'quickMetadata');
  validateRegistry(stat, 'statMetadata');
  validateRegistry(misc, 'miscMetadata');

  renderRegistry(quick, byUiId('quick-content'), {
    requiredPaths: ['passage', 'arousal'],
  });
  renderRegistry(stat, byUiId('stats-content'), {
    requiredPaths: ['passage', 'money'],
  });
  renderRegistry(misc, byUiId('misc-content'), {
    requiredPaths: ['passage'],
  });

  var element = byUiId('tmpText') || document.getElementById('tmpText');
  if (element) element.classList.add('tmpText');
  safeCall('init_interface-done', () => {
    debugLog('cheat-init', 'init_interface-done');
  });
}

export { init_interface };
