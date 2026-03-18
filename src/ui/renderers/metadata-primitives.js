import { CONTROL_TYPES } from '../metadata/schema.js';

function normalizeSelectOption(option) {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }
  if (option && typeof option === 'object') {
    return {
      value: String(option.value ?? ''),
      label: option.label == null ? String(option.value ?? '') : String(option.label),
    };
  }
  return { value: '', label: '' };
}

function getSelectOptions(meta) {
  if (typeof meta?.optionsSource === 'function') {
    try {
      const options = meta.optionsSource();
      return Array.isArray(options) ? options.map(normalizeSelectOption) : [];
    } catch (error) {
      console.warn(`[CheatPlus][renderer] optionsSource failed for "${meta?.id}":`, error);
      return [];
    }
  }

  if (Array.isArray(meta?.bindings)) {
    return meta.bindings.map(normalizeSelectOption);
  }

  return [];
}

export function syncSelectOptions(selectEl, meta) {
  if (!(selectEl instanceof HTMLSelectElement)) return { changed: false, selectionChanged: false };

  const options = getSelectOptions(meta);
  const signature = JSON.stringify(options);
  const previousSignature = selectEl.dataset.cpOptionsSignature ?? '';
  const previousValue = selectEl.value;

  if (signature === previousSignature) {
    return { changed: false, selectionChanged: false };
  }

  selectEl.replaceChildren();
  options.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    selectEl.appendChild(optionEl);
  });

  selectEl.dataset.cpOptionsSignature = signature;

  let nextValue = '';
  if (previousValue && options.some((opt) => opt.value === previousValue)) {
    nextValue = previousValue;
  } else if (options.length > 0) {
    nextValue = options[0].value;
  }

  selectEl.value = nextValue;
  return {
    changed: true,
    selectionChanged: previousValue !== nextValue,
  };
}

function renderButton(meta) {
  const btn = document.createElement('button');
  btn.type = 'button';
  if (meta.id) btn.id = meta.id;
  btn.className = 'modal-button';
  btn.textContent = meta.label ?? '';
  if (meta.hiddenWhenEmpty && !(meta.label || '').trim()) btn.style.display = 'none';
  return btn;
}

function renderToggle(meta) {
  const label = document.createElement('label');
  label.className = 'modal-toggle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (meta.id) checkbox.id = meta.id;

  const labelSpan = document.createElement('span');
  labelSpan.className = 'toggle-label';
  labelSpan.textContent = String(meta.label ?? '');

  label.appendChild(checkbox);
  label.appendChild(labelSpan);
  return label;
}

function renderSelect(meta) {
  const select = document.createElement('select');
  if (meta.id) select.id = meta.id;

  syncSelectOptions(select, meta);
  return select;
}

function renderRange(meta) {
  const input = document.createElement('input');
  input.type = 'range';
  if (meta.id) input.id = meta.id;
  input.min = String(meta.min ?? 0);
  input.max = String(meta.max ?? 100);
  input.value = String(meta.value ?? 0);
  return input;
}

function renderInput(meta) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'modal-content-width';
  if (meta.id) input.id = meta.id;
  input.autocomplete = 'off';
  if (meta.placeholder) input.placeholder = meta.placeholder;
  return input;
}

function renderText(meta) {
  const span = document.createElement('span');
  span.className = 'modal-text';
  if (meta.id) span.id = meta.id;
  span.textContent = meta.label ?? '';
  if (meta.hiddenWhenEmpty && !(meta.label || '').trim()) span.style.display = 'none';
  return span;
}

function renderHeader(meta) {
  const span = document.createElement('span');
  span.className = 'gold';
  if (meta.id) span.id = meta.id;
  span.textContent = meta.label ?? '';
  return span;
}

function renderBreak() {
  return document.createElement('br');
}

function renderLink(meta) {
  const anchor = document.createElement('a');
  if (meta.id) anchor.id = meta.id;
  anchor.href = meta.href ?? '#';
  anchor.target = '_blank';
  anchor.className = 'modal-link';
  anchor.textContent = meta.label ?? '';
  return anchor;
}

function renderTooltip(meta) {
  const span = document.createElement('span');
  span.className = 'tooltip-small linkBlue';
  if (meta.id) span.id = meta.id;
  const trigger = meta.label ?? '(?)';
  const tip = meta.tooltip ?? '';
  span.innerHTML = `${trigger}<span>${tip}</span>`;
  return span;
}

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
    case CONTROL_TYPES.INPUT:
      return renderInput(meta);
    case CONTROL_TYPES.TEXT:
      return renderText(meta);
    case CONTROL_TYPES.HEADER:
      return renderHeader(meta);
    case CONTROL_TYPES.BREAK:
      return renderBreak();
    case CONTROL_TYPES.LINK:
      return renderLink(meta);
    case CONTROL_TYPES.TOOLTIP:
      return renderTooltip(meta);
    case CONTROL_TYPES.GROUP:
      return document.createDocumentFragment();
    default:
      console.warn(`[CheatPlus][renderer] Unknown control type: "${meta.type}" (id="${meta.id}")`);
      return document.createDocumentFragment();
  }
}

export function renderRow() {
  const div = document.createElement('div');
  div.className = 'modal-content-padding';
  return div;
}
