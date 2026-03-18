/**
 * Event listener registry for CheatPlus.
 *
 * Stores teardown functions so re-injection and navigation changes do not leak
 * handlers.
 *
 * API:
 *   on(target, type, handler, options?)  — attach and track
 *   off(target, type, handler)           — detach and untrack
 *   reset()                              — remove ALL tracked listeners
 *   getCount()                           — number of tracked entries (debug)
 */

const registryStore = [];

/** @returns {Array<{target: EventTarget, type: string, handler: Function, options: any}>} */
function getStore() {
  return registryStore;
}

/**
 * Attach an event listener and record it for later teardown.
 * @param {EventTarget} target
 * @param {string} type
 * @param {Function} handler
 * @param {AddEventListenerOptions|boolean} [options]
 */
export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  getStore().push({ target, type, handler, options });
}

/**
 * Detach an event listener and remove it from the registry.
 * @param {EventTarget} target
 * @param {string} type
 * @param {Function} handler
 */
export function off(target, type, handler) {
  target.removeEventListener(type, handler);
  const store = getStore();
  const idx = store.findIndex(
    (e) => e.target === target && e.type === type && e.handler === handler
  );
  if (idx !== -1) store.splice(idx, 1);
}

/**
 * Remove all tracked listeners. Call before re-running initListeners to
 * ensure idempotent re-injection.
 */
export function reset() {
  const store = getStore();
  for (const { target, type, handler, options } of store) {
    try {
      target.removeEventListener(type, handler, options);
    } catch (_) {
      /* no-op */
    }
  }
  store.length = 0;
}

/** @returns {number} Number of currently tracked listeners. */
export function getCount() {
  return getStore().length;
}
