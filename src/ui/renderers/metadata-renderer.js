/**
 * Metadata render pipeline.
 *
 * Converts metadata control descriptors (see ui/metadata/schema.js) into DOM
 * elements using the same HTML structure that generatetext() produces, so both
 * pipelines can coexist while sections are incrementally migrated (Phase 7).
 *
 * Public API:
 *   renderControl(meta)          → Element | DocumentFragment
 *   renderRow(meta)              → Element  (wrapped in .modal-content-padding)
 *   renderRegistry(controls, container) → void
 *
 * Primitive renderers (exported for unit-testing and direct reuse):
 *   renderButton, renderToggle, renderSelect, renderRange, renderTooltip, renderGroup
 */

import { CONTROL_TYPES } from '../metadata/schema.js';

// ---------------------------------------------------------------------------
// Primitive renderers — each returns a single DOM node or DocumentFragment
// ---------------------------------------------------------------------------

/**
 * <button class="modal-button" id="{meta.id}" data-action="{meta.action}">
 *   {meta.label}
 * </button>
 *
 * @param {{ id?: string, label: string, action?: string }} meta
 * @returns {HTMLButtonElement}
 */
export function renderButton(meta) {
  const btn = document.createElement('button');
  btn.type = 'button';
  if (meta.id) btn.id = meta.id;
  btn.className = 'modal-button';
  btn.textContent = meta.label ?? '';
  if (meta.action) btn.dataset.action = meta.action;
  return btn;
}

/**
 * <label class="modal-toggle">
 *   <input type="checkbox" id="{meta.id}" data-action="{meta.action}">
 *   {meta.label}
 * </label>
 *
 * @param {{ id?: string, label: string, action?: string }} meta
 * @returns {HTMLLabelElement}
 */
export function renderToggle(meta) {
  const label = document.createElement('label');
  label.className = 'modal-toggle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (meta.id) checkbox.id = meta.id;
  if (meta.action) checkbox.dataset.action = meta.action;

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' ' + (meta.label ?? '')));
  return label;
}

/**
 * <select id="{meta.id}" data-action="{meta.action}">
 *   <option value="{opt}">...</option>
 * </select>
 *
 * meta.bindings: string[] | { value: string, label?: string }[]
 *
 * @param {{ id?: string, bindings?: Array<string|{value:string,label?:string}>, action?: string }} meta
 * @returns {HTMLSelectElement}
 */
export function renderSelect(meta) {
  const select = document.createElement('select');
  if (meta.id) select.id = meta.id;
  if (meta.action) select.dataset.action = meta.action;

  (meta.bindings ?? []).forEach((opt) => {
    const option = document.createElement('option');
    if (typeof opt === 'string') {
      option.value = opt;
      option.textContent = opt;
    } else {
      option.value = opt.value;
      option.textContent = opt.label ?? opt.value;
    }
    select.appendChild(option);
  });

  return select;
}

/**
 * <input type="range" id="{meta.id}" min="{meta.min}" max="{meta.max}" value="{meta.value}">
 *
 * @param {{ id?: string, min?: number, max?: number, value?: number, action?: string }} meta
 * @returns {HTMLInputElement}
 */
export function renderRange(meta) {
  const input = document.createElement('input');
  input.type = 'range';
  if (meta.id) input.id = meta.id;
  input.min = String(meta.min ?? 0);
  input.max = String(meta.max ?? 100);
  input.value = String(meta.value ?? 0);
  if (meta.action) input.dataset.action = meta.action;
  return input;
}

/**
 * <input type="text" class="modal-content-width" id="{meta.id}"
 *        autocomplete="off" placeholder="{meta.placeholder}">
 *
 * @param {{ id?: string, placeholder?: string, action?: string }} meta
 * @returns {HTMLInputElement}
 */
export function renderText(meta) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'modal-content-width';
  if (meta.id) input.id = meta.id;
  input.autocomplete = 'off';
  if (meta.placeholder) input.placeholder = meta.placeholder;
  if (meta.action) input.dataset.action = meta.action;
  return input;
}

/**
 * <span class="tooltip-small linkBlue" id="{meta.id}">
 *   (?)<span>{meta.tooltip}</span>
 * </span>
 *
 * The tooltip text comes from meta.tooltip; meta.label is the visible trigger
 * text (defaults to "(?)" if absent).
 *
 * @param {{ id?: string, label?: string, tooltip?: string }} meta
 * @returns {HTMLSpanElement}
 */
export function renderTooltip(meta) {
  const span = document.createElement('span');
  span.className = 'tooltip-small linkBlue';
  if (meta.id) span.id = meta.id;
  const trigger = meta.label ?? '(?)';
  const tip = meta.tooltip ?? '';
  span.innerHTML = `${trigger}<span>${tip}</span>`;
  return span;
}

/**
 * Renders a row of controls (maps to a single generatetext() call with multiple
 * elements). Produces:
 *
 * <div class="modal-content-padding">
 *   {optional text label}
 *   {child1} | {child2} | ...
 * </div>
 *
 * GROUP children that are of type TEXT produce plain text nodes, matching
 * the original generatetext('text') behaviour.
 *
 * @param {{ id?: string, label?: string, children: object[] }} meta
 * @returns {HTMLDivElement}
 */
export function renderGroup(meta) {
  const div = document.createElement('div');
  div.className = 'modal-content-padding';
  if (meta.id) div.id = meta.id;

  const children = meta.children ?? [];
  children.forEach((child, i) => {
    // Separator between controls (not before the first one)
    if (i > 0) div.appendChild(document.createTextNode(' | '));
    div.appendChild(renderControl(child));
  });

  return div;
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

/**
 * Render a single control descriptor into a DOM node.
 * For TEXT type, returns a plain text node.
 * For all other types, returns an Element.
 *
 * @param {object} meta
 * @returns {Element | Text | DocumentFragment}
 */
export function renderControl(meta) {
  switch (meta.type) {
    case CONTROL_TYPES.BUTTON:
      return renderButton(meta);
    case CONTROL_TYPES.TOGGLE:
      return renderToggle(meta);
    case CONTROL_TYPES.SELECT:
      return renderSelect(meta);
    case CONTROL_TYPES.RANGE:
      return renderRange(meta);
    case CONTROL_TYPES.TEXT:
      return renderText(meta);
    case CONTROL_TYPES.TOOLTIP:
      return renderTooltip(meta);
    case CONTROL_TYPES.GROUP:
      return renderGroup(meta);
    default:
      console.warn(`[CheatPlus][renderer] Unknown control type: "${meta.type}" (id="${meta.id}")`);
      return document.createDocumentFragment();
  }
}

// ---------------------------------------------------------------------------
// Row wrapper
// ---------------------------------------------------------------------------

/**
 * Wrap a single non-group control in a .modal-content-padding div so it
 * renders as a standalone row, consistent with how generatetext() wraps
 * each entry.
 *
 * GROUP controls already produce their own wrapper — pass them directly to
 * renderControl (or use renderRegistry, which handles both cases).
 *
 * @param {object} meta
 * @returns {HTMLDivElement}
 */
export function renderRow(meta) {
  const div = document.createElement('div');
  div.className = 'modal-content-padding';
  div.appendChild(renderControl(meta));
  return div;
}

// ---------------------------------------------------------------------------
// Registry-level render
// ---------------------------------------------------------------------------

/**
 * Iterate a metadata registry and append each control as a row to `container`.
 *
 * GROUP controls produce their own wrapper div.
 * All other controls are wrapped in a .modal-content-padding row.
 *
 * Skips any control whose `visibility` resolves to false.
 *
 * @param {object[]} controls   – metadata registry array
 * @param {Element}  container  – DOM node to append into (e.g. byUiId('quick-content'))
 */
export function renderRegistry(controls, container) {
  if (!container) {
    console.warn('[CheatPlus][renderer] renderRegistry: container is null/undefined');
    return;
  }

  controls.forEach((meta) => {
    // Evaluate visibility gate
    const visible =
      meta.visibility == null
        ? true
        : typeof meta.visibility === 'function'
        ? meta.visibility()
        : Boolean(meta.visibility);

    if (!visible) return;

    const node = meta.type === CONTROL_TYPES.GROUP ? renderGroup(meta) : renderRow(meta);

    container.appendChild(node);
  });
}
