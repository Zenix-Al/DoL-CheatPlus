import { createManualFrameDriver } from './manual-frame-driver.js';

export function createFakeCheatScheduler({ frameDriver = createManualFrameDriver() } = {}) {
  const entries = new Map();
  const operations = [];
  let currentDay;

  function record(operation, id, details = {}) {
    operations.push(Object.freeze({ operation, id, ...details }));
  }

  function register(id, effect, options = {}) {
    if (!id || typeof effect !== 'function')
      throw new Error('Scheduler registration needs id/effect.');
    entries.set(id, {
      effect,
      cadence: options.cadence ?? 'frame',
      cooldownMs: options.cooldownMs ?? 0,
      maxFailures: options.maxFailures ?? 5,
      failures: 0,
      lastRun: null,
      onFailureThreshold: options.onFailureThreshold,
    });
    record('register', id, {
      cadence: options.cadence ?? 'frame',
      cooldownMs: options.cooldownMs ?? 0,
    });
  }

  function unregister(id) {
    const removed = entries.delete(id);
    record('unregister', id, { removed });
    return removed;
  }

  async function execute(id, entry, reason, timestamp) {
    try {
      await entry.effect({ reason, timestamp });
      entry.failures = 0;
      entry.lastRun = timestamp;
      record('execute', id, { reason, timestamp });
      return true;
    } catch (error) {
      entry.failures += 1;
      record('failure', id, { reason, failures: entry.failures, message: error.message });
      if (entry.failures >= entry.maxFailures) {
        unregister(id);
        if (typeof entry.onFailureThreshold === 'function') {
          await entry.onFailureThreshold({ id, reason, failures: entry.failures, error });
        }
      }
      return false;
    }
  }

  async function runFrame(timestamp = frameDriver.timestamp + 16) {
    const pending = [];
    frameDriver.requestAnimationFrame((frameTimestamp) => {
      for (const [id, entry] of entries) {
        if (entry.cadence !== 'frame') continue;
        if (entry.lastRun != null && frameTimestamp - entry.lastRun < entry.cooldownMs) continue;
        pending.push(execute(id, entry, 'frame', frameTimestamp));
      }
    });
    frameDriver.step(timestamp);
    return Promise.all(pending);
  }

  async function runDaily(day) {
    if (day === currentDay) return [];
    currentDay = day;
    const pending = [];
    for (const [id, entry] of entries) {
      if (entry.cadence !== 'daily') continue;
      pending.push(execute(id, entry, 'daily', day));
    }
    return Promise.all(pending);
  }

  function clearAll(reason = 'manual') {
    const ids = [...entries.keys()];
    entries.clear();
    record('clear-all', '*', { reason, ids });
    return ids;
  }

  async function restore({ onRestore } = {}) {
    const cleared = clearAll('watchdog');
    record('watchdog-restore', '*', { cleared });
    if (typeof onRestore === 'function') await onRestore();
    return cleared;
  }

  return {
    register,
    unregister,
    runFrame,
    runDaily,
    clearAll,
    restore,
    has(id) {
      return entries.has(id);
    },
    list() {
      return [...entries.keys()];
    },
    getOperations() {
      return [...operations];
    },
    clearOperations() {
      operations.splice(0, operations.length);
    },
    frameDriver,
  };
}
