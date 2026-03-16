import { byUiId } from '../helpers/dom-refs.js';

export function showToast(text) {
  const toastContainer = byUiId('toastContainer');
  if (!toastContainer) return;

  const newToast = document.createElement('div');
  newToast.classList.add('toast');
  newToast.textContent = text;
  toastContainer.appendChild(newToast);
  setTimeout(() => {
    newToast.classList.add('hidden');
    setTimeout(() => {
      toastContainer.removeChild(newToast);
    }, 300);
  }, 3000);
}

export const timedToast = (text, time) => setTimeout(() => showToast(text), time);
