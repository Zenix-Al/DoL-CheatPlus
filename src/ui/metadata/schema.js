/**
 * Metadata schema contract for CheatPlus UI controls.
 *
 * Controls are described as plain data objects. This module defines:
 *   - CONTROL_TYPES  — valid values for the `type` field
 *   - validateControl(meta) — dev-time validation returning { valid, errors }
 */

/** All valid control type values. */
export const CONTROL_TYPES = Object.freeze({
  BUTTON: 'button',
  TOGGLE: 'toggle',
  SELECT: 'select',
  RANGE: 'range',
  TEXT: 'text',
  TOOLTIP: 'tooltip',
  GROUP: 'group',
});

const VALID_TYPES = new Set(Object.values(CONTROL_TYPES));

/**
 * Required properties every control must define.
 * @type {string[]}
 */
export const SCHEMA_REQUIRED = ['id', 'type', 'label'];

/**
 * Optional properties (not required, but validated if present).
 * @type {string[]}
 */
export const SCHEMA_OPTIONAL = [
  'tooltip',
  'action',
  'bindings',
  'visibility',
  'engineScope',
  'children',
];

/**
 * Validate a single control metadata object.
 *
 * Usage (dev-time only — strip calls in release builds):
 *   const { valid, errors } = validateControl(meta);
 *   if (!valid) console.warn('[CheatPlus][schema]', errors);
 *
 * @param {object} meta
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateControl(meta) {
  const errors = [];

  if (!meta || typeof meta !== 'object') {
    return { valid: false, errors: ['Control must be a plain object.'] };
  }

  // Required fields
  for (const key of SCHEMA_REQUIRED) {
    if (meta[key] == null || meta[key] === '') {
      errors.push(`Missing required field: "${key}".`);
    }
  }

  // type must be a known CONTROL_TYPE
  if (meta.type != null && !VALID_TYPES.has(meta.type)) {
    errors.push(`Unknown type "${meta.type}". Valid types: ${[...VALID_TYPES].join(', ')}.`);
  }

  // id must be a non-empty string
  if (meta.id != null && typeof meta.id !== 'string') {
    errors.push(`"id" must be a string.`);
  }

  // action, if present, must be a string (command key)
  if (meta.action != null && typeof meta.action !== 'string') {
    errors.push(`"action" must be a string command key.`);
  }

  // bindings, if present, must be an array
  if (meta.bindings != null && !Array.isArray(meta.bindings)) {
    errors.push(`"bindings" must be an array.`);
  }

  // visibility, if present, must be a function or boolean
  if (
    meta.visibility != null &&
    typeof meta.visibility !== 'function' &&
    typeof meta.visibility !== 'boolean'
  ) {
    errors.push(`"visibility" must be a boolean or function.`);
  }

  // GROUP type must have children array
  if (meta.type === CONTROL_TYPES.GROUP) {
    if (!Array.isArray(meta.children) || meta.children.length === 0) {
      errors.push(`GROUP type requires a non-empty "children" array.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an array of control metadata objects, logging any failures.
 * No-ops silently in release builds when debugLog is stripped.
 *
 * @param {object[]} controls
 * @param {string} registryName
 * @returns {boolean} true if all controls are valid
 */
export function validateRegistry(controls, registryName = 'unknown') {
  if (!Array.isArray(controls)) {
    console.warn(`[CheatPlus][schema] Registry "${registryName}" is not an array.`);
    return false;
  }

  let allValid = true;
  controls.forEach((meta, idx) => {
    const { valid, errors } = validateControl(meta);
    if (!valid) {
      allValid = false;
      console.warn(
        `[CheatPlus][schema] Invalid control at ${registryName}[${idx}] (id="${meta?.id}"):`,
        errors
      );
    }
  });
  return allValid;
}
