const intervalByContainer = new WeakMap();

/**
 * Starts a single sync interval for a container, replacing any previous one.
 * @param {Element} container
 * @param {() => void} tick
 * @param {number} [intervalMs=400]
 * @returns {number|null}
 */
export function startUiSync(container, tick, intervalMs = 400) {
  if (!container || typeof tick !== 'function') return null;

  stopUiSync(container);
  const timerId = setInterval(() => {
    tick();
  }, intervalMs);
  intervalByContainer.set(container, timerId);
  return timerId;
}

/**
 * Stops sync interval for a container if one is active.
 * @param {Element} container
 */
export function stopUiSync(container) {
  if (!container) return;
  const timerId = intervalByContainer.get(container);
  if (timerId == null) return;
  clearInterval(timerId);
  intervalByContainer.delete(container);
}
