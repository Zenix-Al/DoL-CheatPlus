/**
 * Event tracing utilities for CheatPlus.
 *
 * Logs routed UI events through debugLog when debug mode is on.
 * The sequence counter lives on globalThis to survive module re-evaluation on
 * userscript re-inject.
 *
 * API:
 *   traceEvent(type, key)  — log "[type] → key (#n)" under the 'events' feature tag
 */

import debugLog from '../logger.js';

function nextSeq() {
  globalThis.__DOL_CP_TRACE_SEQ__ = (globalThis.__DOL_CP_TRACE_SEQ__ ?? 0) + 1;
  return globalThis.__DOL_CP_TRACE_SEQ__;
}

/**
 * Trace a single routed UI event.
 * No-ops when debug mode is off (gated inside debugLog).
 *
 * @param {string} type   — DOM event type, e.g. 'click', 'change', 'input', 'keyup'
 * @param {string} key    — resolved action key or element ID
 */
export function traceEvent(type, key) {
  debugLog('events', `[${type}] → "${key}" (#${nextSeq()})`);
}
