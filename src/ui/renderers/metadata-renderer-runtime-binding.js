import { CONTROL_TYPES } from '../metadata/schema.js';
import {
  getVariablePath,
  setVariablePath,
  hasVariablePath,
  isReady as isSugarCubeReady,
} from '../../core/sugarcube/adapter.js';
import { startUiSync } from '../../services/ui-sync-scheduler.js';

import { applyMissingPolicy } from './metadata-renderer-missing-policy.js';
import {
  applyMetaTooltip,
  bindControlRuntimeEvent,
  dispatchAction,
} from './metadata-renderer-event-wiring.js';

const DEFAULT_EVENT_BY_TYPE = {
  [CONTROL_TYPES.BUTTON]: 'click',
  [CONTROL_TYPES.TOGGLE]: 'change',
  [CONTROL_TYPES.SELECT]: 'change',
  [CONTROL_TYPES.RANGE]: 'input',
  [CONTROL_TYPES.INPUT]: 'input',
};

function normalizeBinding(meta) {
  if (!meta?.binding) return null;
  if (typeof meta.binding === 'string') return { path: meta.binding };
  if (typeof meta.binding === 'object') return meta.binding;
  return null;
}

export function getBindingPath(meta) {
  return normalizeBinding(meta)?.path ?? null;
}

export function getBindingPolicy(meta) {
  return normalizeBinding(meta)?.onMissing ?? meta?.onMissing ?? 'mark-section-broken';
}

export function getBindingCoerce(meta) {
  return normalizeBinding(meta)?.coerce ?? meta?.coerce ?? 'raw';
}

export function getBindingDefault(meta) {
  if (meta?.defaultValue !== undefined) return meta.defaultValue;
  const binding = normalizeBinding(meta);
  if (binding && Object.prototype.hasOwnProperty.call(binding, 'defaultValue')) {
    return binding.defaultValue;
  }
  return undefined;
}

export function isBindingRequired(meta) {
  if (meta?.requiredBinding != null) return Boolean(meta.requiredBinding);
  const binding = normalizeBinding(meta);
  if (binding?.required != null) return Boolean(binding.required);
  return false;
}

export function getControlElement(node, meta) {
  if (!node) return null;
  if (meta.type === CONTROL_TYPES.TOGGLE) {
    return node.querySelector('input[type="checkbox"]');
  }
  if (
    node instanceof HTMLInputElement ||
    node instanceof HTMLSelectElement ||
    node instanceof HTMLButtonElement
  ) {
    return node;
  }
  return null;
}

export function coerceValue(value, coerce) {
  if (coerce === 'string') return String(value ?? '');
  if (coerce === 'number') return Number(value ?? 0);
  if (coerce === 'boolean') return Boolean(value);
  return value;
}

export function readControlValue(el, meta) {
  if (!el) return undefined;
  if (meta.type === CONTROL_TYPES.TOGGLE) return Boolean(el.checked);
  if (meta.type === CONTROL_TYPES.RANGE) return Number(el.value);
  if (meta.type === CONTROL_TYPES.INPUT) return el.value;
  if (meta.type === CONTROL_TYPES.SELECT) return el.value;
  return undefined;
}

export function applyControlValue(el, meta, value) {
  if (!el) return;
  if (meta.type === CONTROL_TYPES.TOGGLE) {
    el.checked = Boolean(value);
    return;
  }
  if (meta.type === CONTROL_TYPES.RANGE) {
    const next = Number(value ?? 0);
    if (!Number.isNaN(next)) el.value = String(next);
    return;
  }
  if (meta.type === CONTROL_TYPES.INPUT || meta.type === CONTROL_TYPES.SELECT) {
    el.value = value == null ? '' : String(value);
  }
}

export function updateToggleActiveClass(controlEl, meta) {
  if (!controlEl || meta?.type !== CONTROL_TYPES.TOGGLE) return;
  const wrapper = controlEl.closest('.modal-toggle');
  if (!wrapper) return;
  wrapper.classList.toggle('cp-toggle-active', Boolean(controlEl.checked));
}

function shouldShowBoundValue(meta) {
  if (!meta) return false;
  return (
    meta.type === CONTROL_TYPES.INPUT ||
    meta.type === CONTROL_TYPES.RANGE ||
    meta.type === CONTROL_TYPES.SELECT ||
    meta.type === CONTROL_TYPES.TOGGLE
  );
}

function formatBoundValue(value) {
  if (value === null || value === undefined || value === '') return 'Current: -';
  if (typeof value === 'boolean') return `Current: ${value ? 'On' : 'Off'}`;
  if (typeof value === 'number') return `Current: ${Number.isFinite(value) ? value : '-'}`;
  if (typeof value === 'string') return `Current: ${value}`;
  return 'Current: [complex value]';
}

function ensureBoundValueHint(rowNode) {
  if (!(rowNode instanceof HTMLElement)) return null;
  let hint = rowNode.querySelector('.cp-bound-value');
  if (hint) return hint;
  hint = document.createElement('span');
  hint.className = 'cp-bound-value';
  hint.setAttribute('aria-live', 'polite');
  rowNode.appendChild(hint);
  return hint;
}

export function updateBoundValueHint(hintEl, value) {
  if (!hintEl) return;
  hintEl.textContent = formatBoundValue(value);
}

export function setupControlRuntime(
  container,
  rowNode,
  controlNode,
  meta,
  cleanupList,
  bindingRefs,
  syncNow
) {
  const controlEl = getControlElement(controlNode, meta);
  if (controlEl) controlEl.dataset.cpControl = '1';
  applyMetaTooltip(controlNode, controlEl, rowNode, meta);

  const hintEl = shouldShowBoundValue(meta) ? ensureBoundValueHint(rowNode) : null;

  const path = getBindingPath(meta);
  if (path && controlEl) {
    let exists = hasVariablePath(path);
    if (!exists) {
      const fallback = getBindingDefault(meta);
      if (fallback !== undefined) {
        setVariablePath(path, fallback);
        exists = true;
      }
    }

    if (!exists && isBindingRequired(meta)) {
      applyMissingPolicy(container, rowNode, controlEl, meta, path, getBindingPolicy);
    } else {
      const value = getVariablePath(path);
      applyControlValue(controlEl, meta, value);
      updateToggleActiveClass(controlEl, meta);
      updateBoundValueHint(hintEl, value);
      bindingRefs.push({ controlEl, meta, path, hintEl });
    }
  } else if (controlEl) {
    updateToggleActiveClass(controlEl, meta);
  }

  const eventType = meta.event || DEFAULT_EVENT_BY_TYPE[meta.type];
  bindControlRuntimeEvent({
    controlEl,
    meta,
    eventType,
    path,
    hintEl,
    cleanupList,
    syncNow,
    readControlValue,
    coerceValue,
    getBindingCoerce,
    setVariablePath,
    updateBoundValueHint,
    updateToggleActiveClass,
  });
}

export function syncBindingsOnce(container, bindingRefs, optionRefs, syncSelectOptions) {
  if (!document.contains(container)) return;
  if (!isSugarCubeReady()) return;

  optionRefs.forEach(({ controlEl, meta }) => {
    if (!document.contains(controlEl) || document.activeElement === controlEl) return;
    const result = syncSelectOptions(controlEl, meta);
    if (result.selectionChanged && meta.action) {
      dispatchAction(meta.action);
    }
  });

  bindingRefs.forEach(({ controlEl, meta, path, hintEl }) => {
    if (!path || !document.contains(controlEl)) return;
    if (document.activeElement === controlEl && meta.type === CONTROL_TYPES.INPUT) return;
    const next = getVariablePath(path);
    applyControlValue(controlEl, meta, next);
    updateToggleActiveClass(controlEl, meta);
    updateBoundValueHint(hintEl, next);
  });
}

export function startBindingSync(container, bindingRefs, optionRefs, options, syncSelectOptions) {
  const hasSyncTargets = bindingRefs.length > 0 || optionRefs.length > 0;
  if (!hasSyncTargets) return null;

  const liveSyncEnabled =
    options.liveSync === true ||
    bindingRefs.some((ref) => ref?.meta?.liveSync === true) ||
    optionRefs.some((ref) => ref?.meta?.liveSync === true);

  if (!liveSyncEnabled) return null;

  return startUiSync(container, () =>
    syncBindingsOnce(container, bindingRefs, optionRefs, syncSelectOptions)
  );
}
