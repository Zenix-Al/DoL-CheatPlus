// Central debug logger for CheatPlus
export function isDebugEnabled() {
  try {
    if (typeof __F95UE_DEBUG__ !== 'undefined') return Boolean(__F95UE_DEBUG__);
  } catch (e) {}
  return Boolean(globalThis.CheatPlusDebugEnabled || globalThis.CheatPlusDebug || false);
}

export function setDebugEnabled(value) {
  globalThis.CheatPlusDebugEnabled = Boolean(value);
}

function debugLog(feature, msg, { data = null, level = 'log' } = {}) {
  if (!isDebugEnabled()) return;

  const logMethod = console[level] || console.log;
  const style = level === 'warn' ? 'color: orange;' : level === 'error' ? 'color: red;' : '';

  try {
    console.groupCollapsed(`%c[CheatPlus][${feature}] ${msg}`, style);
    logMethod(msg);
    if (data !== null && typeof data !== 'undefined') logMethod(data);
  } catch (e) {
    try {
      logMethod(`[CheatPlus][${feature}] ${msg}`);
      if (data) logMethod(data);
    } catch (err) {}
  } finally {
    try {
      console.groupEnd();
    } catch (e) {}
  }
}

export default debugLog;
