import { CONTROL_TYPES } from './schema.js';

/**
 * Returns metadata-derived tooltip text.
 * @param {any} meta
 * @returns {string}
 */
export function getMetaTooltipText(meta) {
  if (!meta || typeof meta !== 'object') return '';
  if (typeof meta.tooltip === 'string' && meta.tooltip.trim()) return meta.tooltip.trim();

  const feedbackBits = [];
  if (meta?.feedback?.enabled) feedbackBits.push(`On: ${meta.feedback.enabled}`);
  if (meta?.feedback?.disabled) feedbackBits.push(`Off: ${meta.feedback.disabled}`);
  if (meta?.feedback?.success) feedbackBits.push(meta.feedback.success);

  if (feedbackBits.length) return feedbackBits.join(' | ');
  if (meta.action) return `Action: ${meta.action}`;
  return '';
}

/**
 * Computes toast payload for a control feedback event.
 * @param {any} meta
 * @param {HTMLElement|HTMLInputElement|HTMLSelectElement|HTMLButtonElement|null} controlEl
 * @param {boolean} actionOk
 * @param {{actionEmittedToast?: boolean, eventType?: string}} [runtime]
 * @returns {{message: string, options: {variant: 'info'|'success'|'warning'|'error', title?: string}}|null}
 */
export function getControlFeedbackToast(meta, controlEl, actionOk, runtime = {}) {
  const fb = meta?.feedback;
  if (!fb) return null;

  if (runtime.actionEmittedToast) return null;
  if (runtime.eventType === 'input') return null;

  if (!actionOk && fb.fail) {
    return {
      message: fb.fail,
      options: { variant: 'error', title: fb.title || 'Action Failed' },
    };
  }

  if (meta.type === CONTROL_TYPES.TOGGLE) {
    const enabled = Boolean(controlEl?.checked);
    if (enabled && fb.enabled) {
      return {
        message: fb.enabled,
        options: { variant: fb.variant || 'success', title: fb.title },
      };
    }
    if (!enabled && fb.disabled) {
      return {
        message: fb.disabled,
        options: { variant: fb.variant || 'info', title: fb.title },
      };
    }
  }

  if (fb.success) {
    return {
      message: fb.success,
      options: { variant: fb.variant || 'success', title: fb.title },
    };
  }

  return null;
}
