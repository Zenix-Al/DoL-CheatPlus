/**
 * Feature registry — defines and registers all features into the factory.
 *
 * Registration order matters: features run in registration order per lifecycle phase.
 *   1. storage   → init (initStorage + reactivateToggles)
 *   2. listeners → registerActions then startObservers
 */

import { initStorage, reactivateToggles } from '../services/storage.js';
import { factory } from '../core/feature-factory.js';

import {
  registerListenerActions,
  initGameObservers,
  stopGameObservers,
} from './listeners/index.js';

factory.registerFeature({
  id: 'storage',
  init() {
    initStorage();
    reactivateToggles();
  },
});

factory.registerFeature({
  id: 'listeners',
  registerActions() {
    registerListenerActions();
  },
  startObservers() {
    initGameObservers();
  },
  stopObservers() {
    stopGameObservers();
  },
});
