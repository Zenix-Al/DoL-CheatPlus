import { isDeepStrictEqual } from 'node:util';

const SNAPSHOT_FIELDS = Object.freeze([
  'state',
  'outcome',
  'controls',
  'refresh',
  'applicable',
  'cleanup',
]);

function clone(value) {
  return structuredClone(value);
}

function normalizeSnapshot(snapshot, label) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new TypeError(`${label} parity runner must return an observation object.`);
  }
  for (const field of SNAPSHOT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(snapshot, field)) {
      throw new Error(`${label} parity observation is missing "${field}".`);
    }
  }
  return clone(Object.fromEntries(SNAPSHOT_FIELDS.map((field) => [field, snapshot[field]])));
}

function mismatchError(id, mode, expected, actual) {
  return new Error(
    `Cheat "${id}" failed ${mode} comparison.\nExpected: ${JSON.stringify(
      expected
    )}\nActual: ${JSON.stringify(actual)}`
  );
}

export async function runCheatParity({
  id,
  status,
  initialState,
  runLegacy,
  runDescriptor,
  intended,
}) {
  if (typeof id !== 'string' || id === '') throw new TypeError('Parity case requires an id.');
  if (typeof runLegacy !== 'function' || typeof runDescriptor !== 'function') {
    throw new TypeError(`Cheat "${id}" parity case requires legacy and descriptor runners.`);
  }

  const legacy = normalizeSnapshot(
    await runLegacy({ initialState: clone(initialState) }),
    `Cheat "${id}" legacy`
  );
  const descriptor = normalizeSnapshot(
    await runDescriptor({ initialState: clone(initialState) }),
    `Cheat "${id}" descriptor`
  );

  if (status === 'working') {
    if (!isDeepStrictEqual(descriptor, legacy)) {
      throw mismatchError(id, 'legacy parity', legacy, descriptor);
    }
    return Object.freeze({ id, mode: 'parity', legacy, descriptor });
  }

  if (status === 'known-broken') {
    const expected = normalizeSnapshot(intended, `Cheat "${id}" intended`);
    if (isDeepStrictEqual(legacy, expected)) {
      throw new Error(`Cheat "${id}" is marked known-broken but legacy already matches intent.`);
    }
    if (!isDeepStrictEqual(descriptor, expected)) {
      throw mismatchError(id, 'intended-behavior', expected, descriptor);
    }
    return Object.freeze({ id, mode: 'intent-correction', legacy, descriptor, intended: expected });
  }

  throw new Error(
    `Cheat "${id}" parity requires working or known-broken evidence, received "${status}".`
  );
}

export const paritySnapshotFields = SNAPSHOT_FIELDS;
