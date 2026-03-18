import { CONTROL_TYPES } from './schema.js';

const TYPE_MAP = {
  text: CONTROL_TYPES.TEXT,
  header: CONTROL_TYPES.HEADER,
  newline: CONTROL_TYPES.BREAK,
  break: CONTROL_TYPES.BREAK,
  button: CONTROL_TYPES.BUTTON,
  range: CONTROL_TYPES.RANGE,
  tooltip: CONTROL_TYPES.TOOLTIP,
  link: CONTROL_TYPES.LINK,
  input: CONTROL_TYPES.INPUT,
  select: CONTROL_TYPES.SELECT,
  checkbox: CONTROL_TYPES.TOGGLE,
  toggle: CONTROL_TYPES.TOGGLE,
};

function normalizeType(type) {
  if (!type) return null;
  const key = String(type).toLowerCase();
  return TYPE_MAP[key] ?? type;
}

export function normalizeBindingPath(path) {
  if (typeof path !== 'string') return path;
  return path
    .replace(/^SugarCube\.(State|state)\.variables\./, '')
    .replace(/^State\.variables\./, '')
    .trim();
}

function isBindableType(type) {
  return (
    type === CONTROL_TYPES.INPUT ||
    type === CONTROL_TYPES.RANGE ||
    type === CONTROL_TYPES.SELECT ||
    type === CONTROL_TYPES.TOGGLE
  );
}

function buildLegacyControl(kind, id, value, overrides = {}) {
  const type = normalizeType(kind);

  let control;
  switch (type) {
    case CONTROL_TYPES.TEXT:
      control = { type, label: String(value ?? '') };
      break;
    case CONTROL_TYPES.HEADER:
      control = { type, id, label: String(value ?? '') };
      break;
    case CONTROL_TYPES.BREAK:
      control = { type };
      break;
    case CONTROL_TYPES.BUTTON:
      control = { type, id, label: String(value ?? ''), action: id };
      break;
    case CONTROL_TYPES.RANGE:
      control = {
        type,
        id,
        max: Number(value ?? 100),
        value: 0,
        action: id,
      };
      break;
    case CONTROL_TYPES.TOOLTIP:
      control = { type, id, label: '(?)', tooltip: String(value ?? '') };
      break;
    case CONTROL_TYPES.LINK:
      control = { type, href: id, label: String(value ?? '') };
      break;
    case CONTROL_TYPES.INPUT:
      control = {
        type,
        id,
        placeholder: String(value ?? ''),
        action: id,
      };
      break;
    case CONTROL_TYPES.SELECT:
      control = {
        type,
        id,
        bindings: value ?? [],
        action: id,
      };
      break;
    case CONTROL_TYPES.TOGGLE:
      control = {
        type,
        id,
        label: String(value ?? ''),
        action: id,
      };
      break;
    default:
      control = { type: CONTROL_TYPES.TEXT, label: String(value ?? '') };
      break;
  }

  // Ensure legacy definitions that supply an id get it propagated to the control
  if (id && !control.id) control.id = id;

  // Mark controls with an empty initial value so the renderer can hide them
  // until a runtime update populates them.
  if (value === '') {
    control.hiddenWhenEmpty = true;
  }

  const override = id ? overrides[id] : null;
  if (!override) return control;

  const merged = { ...control, ...override };
  if (merged.binding && typeof merged.binding === 'object' && merged.binding.path) {
    merged.binding = { ...merged.binding, path: normalizeBindingPath(merged.binding.path) };
  }
  return merged;
}

export function createRowFromLegacyDef(rowDef, overrides = {}) {
  const { ids = [], inputs = [], values = [] } = rowDef;
  const children = inputs.map((kind, i) => buildLegacyControl(kind, ids[i], values[i], overrides));
  return { type: CONTROL_TYPES.GROUP, children };
}

export function createRowsFromLegacyDefs(rowDefs, overrides = {}) {
  return rowDefs.map((row) => createRowFromLegacyDef(row, overrides));
}

function createControlFromInputDef(inputDef, rowDef, idx) {
  const type = normalizeType(inputDef.type);
  const control = {
    type,
    id: inputDef.id,
    label: inputDef.text,
    tooltip: inputDef.tooltip,
    bindings: inputDef.options,
    optionsSource: inputDef.optionsSource,
    max: inputDef.max,
    min: inputDef.min,
    value: inputDef.value,
    placeholder: inputDef.placeholder,
    href: inputDef.href,
    action: inputDef.action ?? inputDef.listener,
    event: inputDef.event,
    feedback: inputDef.feedback,
    binding: inputDef.binding,
    defaultValue: inputDef.defaultValue,
    requiredBinding: inputDef.requiredBinding,
    onMissing: inputDef.onMissing,
    coerce: inputDef.coerce,
  };

  if (isBindableType(type) && !control.binding && rowDef.bindingPath) {
    control.binding = { path: normalizeBindingPath(rowDef.bindingPath) };
    if (rowDef.requiredBinding != null) control.requiredBinding = rowDef.requiredBinding;
    if (rowDef.onMissing) control.onMissing = rowDef.onMissing;
    if (rowDef.coerce) control.coerce = rowDef.coerce;
    if (rowDef.defaultValue !== undefined) control.defaultValue = rowDef.defaultValue;
  }

  if (!control.id && rowDef.key && type !== CONTROL_TYPES.TEXT && type !== CONTROL_TYPES.BREAK) {
    control.id = `${rowDef.key}_${idx + 1}`;
  }

  if (control.binding && typeof control.binding === 'object' && control.binding.path) {
    control.binding = { ...control.binding, path: normalizeBindingPath(control.binding.path) };
  }

  Object.keys(control).forEach((k) => {
    if (control[k] == null) delete control[k];
  });

  return control;
}

export function createRowFromSettingDef(rowDef) {
  const children = [];

  if (rowDef.text) {
    children.push({ type: CONTROL_TYPES.TEXT, label: rowDef.text });
  }

  (rowDef.inputs ?? []).forEach((inputDef, idx) => {
    children.push(createControlFromInputDef(inputDef, rowDef, idx));
  });

  if (rowDef.tooltip) {
    children.push({
      type: CONTROL_TYPES.TOOLTIP,
      id: rowDef.tooltipId,
      label: '(?)',
      tooltip: rowDef.tooltip,
    });
  }

  return {
    type: CONTROL_TYPES.GROUP,
    id: rowDef.key,
    children,
  };
}

export function createRowsFromSettingDefs(rowDefs) {
  return rowDefs.map((rowDef) => createRowFromSettingDef(rowDef));
}
