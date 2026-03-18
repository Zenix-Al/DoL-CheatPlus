import { byUiId as byId, replaceSelectOptions } from './dom-query.js';

export function getUi(id) {
  return byId(id);
}

export function withElements(ids, cb) {
  const elements = {};
  for (const [key, id] of Object.entries(ids)) {
    const element = byId(id);
    if (!element) return false;
    elements[key] = element;
  }
  cb(elements);
  return true;
}

export function setText(id, text, { hideWhenEmpty = false } = {}) {
  const element = byId(id);
  if (!element) return false;

  const normalized = String(text ?? '');
  element.textContent = normalized;

  if (hideWhenEmpty) {
    element.style.display = normalized.trim() ? '' : 'none';
  }

  return true;
}

export function setValue(id, value, { skipWhenNullish = false } = {}) {
  const element = byId(id);
  if (!element) return false;

  if (skipWhenNullish && value == null) return false;
  element.value = value == null ? '' : value;
  return true;
}

export function setChecked(id, checked) {
  const element = byId(id);
  if (!element) return false;

  element.checked = Boolean(checked);
  return true;
}

export function setOptions(id, options) {
  const element = byId(id);
  if (!element) return false;

  replaceSelectOptions(element, options);
  return true;
}

export function setRangeOptions(id, length, { start = 0 } = {}) {
  const count = Number.isFinite(length) ? Math.max(0, Number(length)) : 0;
  const options = Array.from({ length: count }, (_, index) => {
    const value = start + index;
    return { value, label: String(value) };
  });
  return setOptions(id, options);
}

export function syncInputFromSelect({ selectId, inputId, readValue }) {
  return withElements({ select: selectId, input: inputId }, ({ select, input }) => {
    if (select.value === '') return;
    input.value = readValue(select.value) ?? '';
  });
}
