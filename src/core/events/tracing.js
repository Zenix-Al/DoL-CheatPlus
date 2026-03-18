/**
 * Event tracing utilities for CheatPlus.
 *
 * Logs routed UI events through debugLog when debug mode is on.
 *
 * API:
 *   traceEvent(type, key)  — log "[type] → key (#n)" under the 'events' feature tag
 */

import debugLog from '../logger.js';

let traceSeq = 0;

function nextSeq() {
  traceSeq += 1;
  return traceSeq;
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
