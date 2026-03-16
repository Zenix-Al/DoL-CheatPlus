export function getRuntimeWindow() {
  try {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow) return unsafeWindow;
  } catch (e) {}
  return globalThis;
}

function defineBinding(target, name, access) {
  try {
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: false,
      get: access.get,
      set: access.set,
    });
  } catch (e) {
    // Some page globals may be locked/non-configurable; ignore safely.
  }
}

export function linkGlobalBindings(bindings) {
  const runtimeWindow = getRuntimeWindow();

  Object.entries(bindings).forEach(([name, access]) => {
    defineBinding(globalThis, name, access);
    if (runtimeWindow && runtimeWindow !== globalThis) {
      defineBinding(runtimeWindow, name, access);
    }
  });
}
