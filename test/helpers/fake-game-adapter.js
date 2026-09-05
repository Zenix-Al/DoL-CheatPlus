function splitPath(path) {
  if (Array.isArray(path)) return path.map(String).filter(Boolean);
  if (typeof path !== 'string') return [];
  return path
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean);
}

function getAtPath(root, path) {
  const parts = splitPath(path);
  if (parts.length === 0) return root;

  let current = root;
  for (const part of parts) {
    if (current == null || !Object.prototype.hasOwnProperty.call(current, part)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function setAtPath(root, path, value) {
  const parts = splitPath(path);
  if (parts.length === 0) throw new Error('Fake game adapter set() requires a non-empty path.');

  let current = root;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const next = current[part];
    if (!next || typeof next !== 'object' || Array.isArray(next)) current[part] = {};
    current = current[part];
  }
  current[parts.at(-1)] = value;
  return value;
}

function cloneRecordedValue(value) {
  if (value === undefined || typeof value === 'function') return value;
  try {
    return structuredClone(value);
  } catch (_) {
    return value;
  }
}

export function createFakeGameAdapter({
  id = 'fake',
  ready = true,
  passage = 'Town',
  variables = {},
  setup = {},
} = {}) {
  let currentReady = Boolean(ready);
  let currentPassage = passage;
  const calls = [];

  function record(operation, path, value) {
    const entry = { operation };
    if (path !== undefined) entry.path = path;
    if (arguments.length >= 3) entry.value = cloneRecordedValue(value);
    calls.push(Object.freeze(entry));
  }

  const game = Object.freeze({
    id,
    isReady() {
      record('isReady');
      return currentReady;
    },
    variables() {
      record('variables');
      return variables;
    },
    get(path) {
      record('get', path);
      return getAtPath(variables, path);
    },
    set(path, value) {
      record('set', path, value);
      return setAtPath(variables, path, value);
    },
    has(path) {
      record('has', path);
      return getAtPath(variables, path) !== undefined;
    },
    setup(path) {
      record('setup', path);
      return path == null || path === '' ? setup : getAtPath(setup, path);
    },
    passage() {
      record('passage');
      return currentPassage;
    },
  });

  return {
    game,
    variables,
    setup,
    getCalls() {
      return [...calls];
    },
    clearCalls() {
      calls.splice(0, calls.length);
    },
    setReady(value) {
      currentReady = Boolean(value);
    },
    setPassage(value) {
      currentPassage = value;
    },
  };
}

export function createFakeRuntimeEngine(options = {}) {
  const adapterHarness = createFakeGameAdapter(options);
  const runtimeEngine = Object.freeze({
    id: adapterHarness.game.id,
    label: options.label ?? 'Fake Game',
    adapter: adapterHarness.game,
    observerPolicy: Object.freeze({}),
    hasCorePrerequisites() {
      return adapterHarness.game.isReady();
    },
    hasRuntimePrerequisites() {
      return adapterHarness.game.isReady();
    },
    describePrerequisiteState() {
      return { ready: adapterHarness.game.isReady() };
    },
  });

  return {
    ...adapterHarness,
    runtimeEngine,
  };
}
