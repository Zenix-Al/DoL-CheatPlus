import { getToastSequence, showToast } from '../components/toast.js';
import { dispatchUiAction } from '../helpers/action-dispatch.js';
import { getControlFeedbackToast, getMetaTooltipText } from '../metadata/feedback-utils.js';

export function dispatchAction(actionKey) {
  return dispatchUiAction(actionKey);
}

export function showControlFeedback(meta, controlEl, actionOk, runtime = {}) {
  const toastPayload = getControlFeedbackToast(meta, controlEl, actionOk, runtime);
  if (!toastPayload) return;
  showToast(toastPayload.message, toastPayload.options);
}

export function applyMetaTooltip(controlNode, controlEl, rowNode, meta) {
  const tooltip = getMetaTooltipText(meta);
  if (!tooltip) return;

  if (controlEl) controlEl.title = tooltip;
  if (controlNode instanceof HTMLElement) controlNode.title = tooltip;
  if (rowNode instanceof HTMLElement && !rowNode.title) rowNode.title = tooltip;
}

export function bindControlRuntimeEvent({
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
}) {
  if (!eventType || !controlEl) return;

  const handler = () => {
    if (path) {
      const raw = readControlValue(controlEl, meta);
      const coerced = coerceValue(raw, getBindingCoerce(meta));
      setVariablePath(path, coerced);
      updateBoundValueHint(hintEl, coerced);
    }

    updateToggleActiveClass(controlEl, meta);

    const toastSequenceBeforeAction = getToastSequence();
    const actionOk = meta.action ? dispatchAction(meta.action) : true;
    showControlFeedback(meta, controlEl, actionOk, {
      actionEmittedToast: getToastSequence() > toastSequenceBeforeAction,
      eventType,
    });

    syncNow?.();
  };

  controlEl.addEventListener(eventType, handler);
  cleanupList.push(() => controlEl.removeEventListener(eventType, handler));
}
