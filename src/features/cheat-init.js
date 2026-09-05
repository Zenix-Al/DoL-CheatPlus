import { showToast } from '../ui/components/toast.js';
import { dispatch } from '../core/actions/dispatcher.js';
import { cheatCatalog } from '../cheats/index.js';
import { createCheatRuntimeBuilder } from '../cheats/runtime/builder.js';
import { createAdapterCheatConfigProvider } from '../cheats/runtime/config-provider.js';
import { setActiveCheatBuilder, getActiveCheatBuilder } from '../cheats/runtime/active-builder.js';
import {
  createProductionCheatToggleRuntime,
  createProductionSchedulerAdapter,
} from '../cheats/runtime/toggle-runtime.js';
import { createSectionShells } from '../ui/shell/definitions.js';
import { renderSectionShell } from '../ui/shell/renderer.js';
import { byUiId } from '../ui/helpers/dom-query.js';
import {
  cheatVer,
  cheatVerType,
  curVer,
  isServer,
  testedOn,
} from '../core/game-context.js';
import { getRuntimeWindow } from '../core/global-bridge.js';
import debugLog from '../core/logger.js';
import { safeCall } from '../core/safe-exec.js';
import { createProductionDiagnostics } from '../diagnostics/production.js';
import {
  downloadSite,
  sourceCode,
} from '../config/game-data.js';

//generate interface (ids, inputs, textInputs)
//quick
export function configureCheatRuntime(runtimeEngine) {
  const adapter = runtimeEngine?.adapter;
  if (!adapter) throw new TypeError('Cheat runtime configuration requires an active adapter.');
  const runtimeLogger = {
    error: (message, data) => debugLog('cheat-runtime', message, { data, level: 'error' }),
  };
  const scheduler = createProductionSchedulerAdapter();
  const toggle = createProductionCheatToggleRuntime({ logger: runtimeLogger, scheduler });
  let builder;
  const diagnostics = createProductionDiagnostics({
    catalog: cheatCatalog,
    adapter,
    getHealth: () => builder?.health() ?? { total: 0, mounted: 0, failed: 0 },
    getAliases: () => [],
    scheduler,
  });
  builder = createCheatRuntimeBuilder({
    catalog: cheatCatalog,
    adapter,
    config: createAdapterCheatConfigProvider(adapter),
    document,
    dispatchShellAction: dispatch,
    feedback: {
      success: (message) => showToast(message, { variant: 'success' }),
      error: (message) => showToast(message, { variant: 'error' }),
      warning: (message) => showToast(message, { variant: 'warning' }),
      info: (message) => showToast(message, { variant: 'info' }),
    },
    services: { toggle, scheduler, logger: runtimeLogger, diagnostics },
    logger: {
      error: (message, data) => debugLog('cheat-builder', message, { data, level: 'error' }),
    },
  });
  builder.compile();
  return setActiveCheatBuilder(builder);
}

async function init_interface() {
  safeCall('init_interface-start', () => {
    debugLog('cheat-init', 'init_interface-start');
  });
  const runtimeWindow = getRuntimeWindow();
  const context = {
    data: {
      downloadSite,
      sourceCode,
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

  const shells = createSectionShells(context);

  const builder = getActiveCheatBuilder();
  if (builder) {
    await builder.mountSection('quick', byUiId('quick-content'), shells.quick);
    await builder.mountSection('stats', byUiId('stats-content'), shells.stats);
    await builder.mountSection('misc', byUiId('misc-content'), shells.misc);
  } else {
    for (const section of ['quick', 'stats', 'misc']) {
      renderSectionShell({
        section,
        rows: shells[section],
        container: byUiId(`${section === 'stats' ? 'stats' : section}-content`),
        document,
        dispatchAction: dispatch,
      });
    }
  }

  var element = byUiId('tmpText') || document.getElementById('tmpText');
  if (element) element.classList.add('tmpText');
  safeCall('init_interface-done', () => {
    debugLog('cheat-init', 'init_interface-done');
  });
}

export { init_interface };
