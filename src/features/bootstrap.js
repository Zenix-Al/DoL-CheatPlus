import { initListeners, mainActions } from './listeners/index.js';
import { initStorage, reactivateToggles } from '../services/storage.js';
import { byUiId } from '../ui/helpers/dom-refs.js';
import { getRuntimeWindow } from '../core/global-bridge.js';
import { BOOTSTRAP_FLAG_KEY, CHEAT_ROOT_ID } from '../constants/index.js';

function canBootstrap() {
  const runtimeWindow = getRuntimeWindow();
  return Boolean(
    (runtimeWindow?.SugarCube?.State?.variables || globalThis.SugarCube?.State?.variables) &&
      byUiId(CHEAT_ROOT_ID)
  );
}

function bootstrap() {
  if (globalThis[BOOTSTRAP_FLAG_KEY]) return false;
  if (!canBootstrap()) return false;

  initStorage();
  reactivateToggles();
  initListeners();

  globalThis[BOOTSTRAP_FLAG_KEY] = true;
  return true;
}

export function bootstrapCheat() {
  return bootstrap();
}
