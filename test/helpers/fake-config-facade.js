function cloneValue(value) {
  if (value === undefined || typeof value === 'function') return value;
  try {
    return structuredClone(value);
  } catch (_) {
    return value;
  }
}

export function createFakeConfigFacade({ schemaEntries = [], values = {} } = {}) {
  const schema = new Map(schemaEntries.map((entry) => [entry.path, { ...entry }]));
  const state = { ...values };
  const calls = [];

  function requirePath(path) {
    if (!schema.has(path)) throw new Error(`Unknown CheatPlus config path "${path}".`);
    return schema.get(path);
  }

  function record(operation, path, value) {
    const entry = { operation, path };
    if (arguments.length >= 3) entry.value = cloneValue(value);
    calls.push(Object.freeze(entry));
  }

  const config = Object.freeze({
    get(path) {
      requirePath(path);
      record('get', path);
      return state[path];
    },
    set(path, value) {
      requirePath(path);
      state[path] = value;
      record('set', path, value);
      return value;
    },
    has(path) {
      requirePath(path);
      record('has', path);
      return Object.prototype.hasOwnProperty.call(state, path);
    },
    scope(path) {
      const definition = requirePath(path);
      record('scope', path);
      return definition.scope;
    },
  });

  return {
    config,
    values: state,
    getCalls() {
      return [...calls];
    },
    clearCalls() {
      calls.splice(0, calls.length);
    },
  };
}
