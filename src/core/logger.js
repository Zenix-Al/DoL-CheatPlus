// Central debug logger for CheatPlus
const LS_DEBUG_KEY = 'CheatPlus:debug';
let debugEnabled = null;

export function isDebugEnabled() {
  try {
    if (typeof __DOL_DEBUG__ !== 'undefined') return Boolean(__DOL_DEBUG__);
  } catch (e) {
    /* no-op */
  }
  if (debugEnabled != null) return Boolean(debugEnabled);
  try {
    return localStorage.getItem(LS_DEBUG_KEY) === '1';
  } catch (e) {
    /* no-op */
  }
  return false;
}

export function setDebugEnabled(value) {
  debugEnabled = Boolean(value);
  try {
    if (value) localStorage.setItem(LS_DEBUG_KEY, '1');
    else localStorage.removeItem(LS_DEBUG_KEY);
  } catch (e) {
    /* no-op */
  }
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
    } catch (err) {
      /* no-op */
    }
  } finally {
    try {
      console.groupEnd();
    } catch (e) {
      /* no-op */
    }
  }
}

export default debugLog;
