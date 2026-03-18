/**
 * Action command dispatcher for CheatPlus.
 *
 * Acts as the central command bus between the metadata renderer (which stamps
 * `data-action` on controls) and feature handler modules (which register
 * keyed functions).
 *
 * API:
 *   register(key, handler)   – map an action key to a handler function
 *   unregister(key)          – remove a handler
 *   dispatch(key, context?)  – call a handler; catches errors, fires onError hook
 *   isRegistered(key)        – boolean check
 *   getKeys()                – array of all registered keys (for debug)
 *   setErrorHook(fn)         – fn(key, error) called on handler throw
 *   clearErrorHook()         – remove the error hook
 *
 * Design notes:
 * - The registry is module-scoped and accessed via `getStore()`.
 * - `dispatch` never throws — all exceptions are caught and reported.
 * - The dispatcher lives in `core/` and has NO imports from `ui/` or `features/`.
 *   The error hook is injected at init time from the bootstrap layer.
 */

import debugLog from '../logger.js';

const dispatcherStore = {
  handlers: new Map(),
  onError: null,
};

/** @returns {{ handlers: Map<string, Function>, onError: Function|null }} */
function getStore() {
  return dispatcherStore;
}

/**
 * Register an action handler.
 * If a handler is already registered for `key`, it is replaced.
 *
 * @param {string}   key
 * @param {Function} handler  – called as handler(context) on dispatch
 */
export function register(key, handler) {
  if (typeof key !== 'string' || !key) {
    debugLog('dispatcher', 'register: key must be a non-empty string.', { level: 'warn' });
    return;
  }
  if (typeof handler !== 'function') {
    debugLog('dispatcher', `register: handler for "${key}" is not a function.`, {
      level: 'warn',
    });
    return;
  }
  debugLog('dispatcher', `Registered action: ${key}`);
  getStore().handlers.set(key, handler);
}

/**
 * Remove a registered handler.
 *
 * @param {string} key
 */
export function unregister(key) {
  debugLog('dispatcher', `Unregistered action: ${key}`);
  getStore().handlers.delete(key);
}

/**
 * Dispatch an action by key.
 *
 * - If no handler is registered, logs a warning and returns undefined.
 * - If the handler throws, the error is caught, logged, and passed to the
 *   error hook (if set). The caller never receives the exception.
 *
 * @param {string} key
 * @param {*}      [context]  – optional data passed to the handler
 * @returns {*} return value of the handler, or undefined on error / not-found
 */
export function dispatch(key, context) {
  const store = getStore();
  const handler = store.handlers.get(key);

  if (!handler) {
    debugLog('dispatcher', `No handler registered for action: "${key}"`, { level: 'warn' });
    return;
  }

  try {
    debugLog('dispatcher', `Dispatching action: ${key}`);
    return handler(context);
  } catch (err) {
    debugLog('dispatcher', `Handler error for action: ${key}`, { data: err, level: 'error' });
    if (typeof store.onError === 'function') {
      try {
        store.onError(key, err);
      } catch (_) {
        // never let the error hook itself propagate
      }
    }
  }
}

/**
 * Check whether a key has a registered handler.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isRegistered(key) {
  return getStore().handlers.has(key);
}

/**
 * Return an array of all currently registered action keys.
 * Intended for debug/diagnostics only.
 *
 * @returns {string[]}
 */
export function getKeys() {
  return [...getStore().handlers.keys()];
}

/**
 * Install a global error hook (replaces any existing one).
 * Called by the bootstrap layer so the dispatcher itself stays dependency-free.
 *
 * @param {(key: string, err: Error) => void} fn
 */
export function setErrorHook(fn) {
  if (typeof fn !== 'function') return;
  getStore().onError = fn;
}

/** Remove the error hook. */
export function clearErrorHook() {
  getStore().onError = null;
}
