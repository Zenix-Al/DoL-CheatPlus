import { CONTROL_TYPES } from '../metadata/schema.js';
import { hasVariablePath } from '../../core/sugarcube/adapter.js';
import { stopUiSync } from '../../services/ui-sync-scheduler.js';

import { renderControl, renderRow, syncSelectOptions } from './metadata-primitives.js';
import { clearSectionBroken, markSectionBroken } from './metadata-renderer-missing-policy.js';
import {
  getControlElement,
  setupControlRuntime,
  startBindingSync,
  syncBindingsOnce,
} from './metadata-renderer-runtime-binding.js';

const REGISTRY_STATE = new WeakMap();

function teardownRegistry(container) {
  const state = REGISTRY_STATE.get(container);
  if (!state) return;

  state.cleanup.forEach((fn) => {
    try {
      fn();
    } catch (_) {
      /* no-op */
    }
  });
  stopUiSync(container);
  REGISTRY_STATE.delete(container);
}

function renderControlsPhase(controls, container, cleanup, bindingRefs, optionRefs, syncNow) {
  controls.forEach((meta) => {
    const visible =
      meta.visibility == null
        ? true
        : typeof meta.visibility === 'function'
        ? meta.visibility()
        : Boolean(meta.visibility);

    if (!visible) return;

    if (meta.type === CONTROL_TYPES.GROUP) {
      container.appendChild(renderGroup(meta, container, cleanup, bindingRefs, syncNow));
      return;
    }

    const row = renderRow(meta);
    const node = renderControl(meta);
    row.appendChild(node);
    container.appendChild(row);
    setupControlRuntime(container, row, node, meta, cleanup, bindingRefs, syncNow);

    const controlEl = getControlElement(node, meta);
    if (
      meta.type === CONTROL_TYPES.SELECT &&
      controlEl &&
      typeof meta.optionsSource === 'function'
    ) {
      optionRefs.push({ controlEl, meta });
    }
  });
}

function renderGroup(meta, container, cleanupList, bindingRefs, syncNow) {
  const div = document.createElement('div');
  div.className = 'modal-content-padding';
  if (meta.id) div.id = meta.id;

  const children = meta.children ?? [];
  let appendedAny = false;
  children.forEach((child) => {
    const visible =
      child.visibility == null
        ? true
        : typeof child.visibility === 'function'
        ? child.visibility()
        : Boolean(child.visibility);

    if (!visible) return; // skip invisible children entirely (no separator)

    // If this control was marked to be hidden when empty and currently
    // has no label/tooltip, skip it so separators are not emitted.
    const emptyLabel = !(child.label || '').toString().trim();
    const emptyTooltip = !(child.tooltip || '').toString().trim();
    if (child.hiddenWhenEmpty && emptyLabel && emptyTooltip) return;

    if (appendedAny) div.appendChild(document.createTextNode(' | '));
    const node = renderControl(child);
    div.appendChild(node);
    setupControlRuntime(container, div, node, child, cleanupList, bindingRefs, syncNow);
    appendedAny = true;
  });

  return div;
}

/**
 * Renderer-owned section rendering and interaction wiring.
 * - controls are rendered
 * - listeners are attached per control during render
 * - variable bindings are initialized and synced
 * - missing required bindings mark section as broken
 */
export function renderRegistry(controls, container, options = {}) {
  if (!container) {
    console.warn('[CheatPlus][renderer] renderRegistry: container is null/undefined');
    return;
  }

  teardownRegistry(container);
  clearSectionBroken(container);

  const cleanup = [];
  const bindingRefs = [];
  const optionRefs = [];
  const syncNow = () => syncBindingsOnce(container, bindingRefs, optionRefs, syncSelectOptions);

  const requiredPaths = options.requiredPaths ?? [];
  requiredPaths.forEach((path) => {
    if (!hasVariablePath(path)) {
      markSectionBroken(container, `Cheat unavailable: missing variable "${path}".`);
    }
  });

  renderControlsPhase(controls, container, cleanup, bindingRefs, optionRefs, syncNow);
  syncNow();

  const timerId = startBindingSync(container, bindingRefs, optionRefs, options, syncSelectOptions);
  REGISTRY_STATE.set(container, { cleanup, timerId });
}
