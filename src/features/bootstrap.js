import { CHEAT_ROOT_ID } from '../constants/ui.js';
import { factory } from '../core/feature-factory.js';
import { byUiId } from '../ui/helpers/dom-query.js';

import { configureRuntimeObserverPolicy } from './listeners/index.js';
import { configureCheatRuntime } from './cheat-init.js';

import './registry.js'; // side-effect: registers all features into factory

let bootstrapped = false;

function canBootstrap(runtimeEngine) {
  return Boolean(runtimeEngine?.adapter?.isReady?.() && byUiId(CHEAT_ROOT_ID));
}

function bootstrap({ runtimeEngine } = {}) {
  if (bootstrapped) return false;
  if (!canBootstrap(runtimeEngine)) return false;

  configureRuntimeObserverPolicy(runtimeEngine?.observerPolicy ?? {});

  factory.registerAllActions();
  configureCheatRuntime(runtimeEngine);
  factory.initAllFeatures();
  factory.startAllObservers();

  bootstrapped = true;
  return true;
}

export function bootstrapCheat(options = {}) {
  return bootstrap(options);
}
