export function safeCall(label, fn, { onError = null } = {}) {
  try {
    return fn();
  } catch (err) {
    if (typeof onError === 'function') {
      onError(err);
    } else {
      console.warn(`[CheatPlus] ${label}`, err);
    }
    return undefined;
  }
}

export async function safeCallAsync(label, fn, { onError = null } = {}) {
  try {
    return await fn();
  } catch (err) {
    if (typeof onError === 'function') {
      onError(err);
    } else {
      console.warn(`[CheatPlus] ${label}`, err);
    }
    return undefined;
  }
}
