/* global unsafeWindow */

export function getRuntimeWindow() {
  try {
    // Userscript environments can expose page globals via unsafeWindow; keep usage isolated here.
    // eslint-disable-next-line no-restricted-globals
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
  } catch (e) {
    // ignore and fall back to window
  }
  return typeof window !== 'undefined' ? window : undefined;
}
