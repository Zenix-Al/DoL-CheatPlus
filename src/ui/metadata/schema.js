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
  INPUT: 'input',
  HEADER: 'header',
  BREAK: 'break',
  LINK: 'link',
  TOOLTIP: 'tooltip',
  GROUP: 'group',
});

const VALID_TYPES = new Set(Object.values(CONTROL_TYPES));

/**
 * Required properties every control must define.
 * @type {string[]}
 */
export const SCHEMA_REQUIRED = ['type'];

/**
 * Optional properties (not required, but validated if present).
 * @type {string[]}
 */
export const SCHEMA_OPTIONAL = [
  'id',
  'label',
  'tooltip',
  'action',
  'event',
  'feedback',
  'bindings',
  'optionsSource',
  'binding',
  'defaultValue',
  'requiredBinding',
  'onMissing',
  'coerce',
  'visibility',
  'engineScope',
  'children',
  'min',
  'max',
  'value',
  'placeholder',
  'href',
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

  // id, if present, must be a non-empty string
  if (meta.id != null && typeof meta.id !== 'string') {
    errors.push(`"id" must be a string.`);
  }

  if (meta.id === '') {
    errors.push(`"id" cannot be an empty string.`);
  }

  // label, if present, must be a string
  if (meta.label != null && typeof meta.label !== 'string') {
    errors.push(`"label" must be a string.`);
  }

  // action, if present, must be a string (command key)
  if (meta.action != null && typeof meta.action !== 'string') {
    errors.push(`"action" must be a string command key.`);
  }

  if (meta.event != null && typeof meta.event !== 'string') {
    errors.push(`"event" must be a string DOM event name.`);
  }

  if (meta.feedback != null) {
    const isObject = typeof meta.feedback === 'object' && !Array.isArray(meta.feedback);
    if (!isObject) {
      errors.push(`"feedback" must be an object.`);
    } else {
      ['success', 'fail', 'enabled', 'disabled', 'title', 'variant'].forEach((key) => {
        if (meta.feedback[key] != null && typeof meta.feedback[key] !== 'string') {
          errors.push(`"feedback.${key}" must be a string.`);
        }
      });
      if (
        meta.feedback.variant != null &&
        !['info', 'success', 'warning', 'error'].includes(meta.feedback.variant)
      ) {
        errors.push(`"feedback.variant" must be one of: info, success, warning, error.`);
      }
    }
  }

  // bindings, if present, must be an array
  if (meta.bindings != null && !Array.isArray(meta.bindings)) {
    errors.push(`"bindings" must be an array.`);
  }

  if (meta.optionsSource != null && typeof meta.optionsSource !== 'function') {
    errors.push(`"optionsSource" must be a function.`);
  }

  // binding can be a path string, or a descriptor object.
  if (meta.binding != null) {
    const isString = typeof meta.binding === 'string';
    const isObject = typeof meta.binding === 'object' && !Array.isArray(meta.binding);
    if (!isString && !isObject) {
      errors.push(`"binding" must be a string path or object descriptor.`);
    }

    if (isObject) {
      if (typeof meta.binding.path !== 'string' || !meta.binding.path.trim()) {
        errors.push(`"binding.path" must be a non-empty string.`);
      }
      if (
        meta.binding.onMissing != null &&
        !['disable', 'hide', 'mark-section-broken'].includes(meta.binding.onMissing)
      ) {
        errors.push(`"binding.onMissing" must be one of: disable, hide, mark-section-broken.`);
      }
      if (
        meta.binding.coerce != null &&
        !['string', 'number', 'boolean', 'raw'].includes(meta.binding.coerce)
      ) {
        errors.push(`"binding.coerce" must be one of: string, number, boolean, raw.`);
      }
    }
  }

  if (
    meta.onMissing != null &&
    !['disable', 'hide', 'mark-section-broken'].includes(meta.onMissing)
  ) {
    errors.push(`"onMissing" must be one of: disable, hide, mark-section-broken.`);
  }

  if (meta.requiredBinding != null && typeof meta.requiredBinding !== 'boolean') {
    errors.push(`"requiredBinding" must be a boolean.`);
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
