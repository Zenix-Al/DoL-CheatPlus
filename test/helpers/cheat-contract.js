const SCOPES = new Set(['save', 'user', 'transient']);
const TYPES = new Set(['array', 'boolean', 'number', 'number-or-null', 'object', 'string']);
const GAME_ROOTS = new Set([
  'arousal',
  'date',
  'money',
  'npc',
  'npcs',
  'player',
  'pregnancy',
  'setup',
]);
const plain = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function matches(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'boolean' || type === 'string') return typeof value === type;
  if (type === 'number') return Number.isFinite(value);
  if (type === 'number-or-null') return value === null || Number.isFinite(value);
  return type === 'object' && plain(value);
}

export function validateCheatConfigContract({ defaults, schemaEntries, descriptors = [] }) {
  if (!plain(defaults)) throw new TypeError('Cheat config defaults must be a plain object.');
  if (!Array.isArray(schemaEntries)) throw new TypeError('Cheat config schema must be an array.');
  const paths = new Set();
  for (const entry of schemaEntries) {
    if (!plain(entry)) throw new TypeError('Cheat config schema entry must be a plain object.');
    if (typeof entry.path !== 'string' || !entry.path)
      throw new TypeError('Cheat config schema path must be a non-empty string.');
    if (paths.has(entry.path)) throw new Error(`Duplicate cheat config path "${entry.path}".`);
    paths.add(entry.path);
    if (GAME_ROOTS.has(entry.path.split('.')[0].toLowerCase()))
      throw new Error(`Game-state path "${entry.path}" cannot be declared as CheatPlus config.`);
    if (!SCOPES.has(entry.scope))
      throw new Error(`Cheat config path "${entry.path}" has invalid scope.`);
    if (!TYPES.has(entry.type))
      throw new Error(`Cheat config path "${entry.path}" has invalid type.`);
    if (!Object.hasOwn(defaults, entry.path))
      throw new Error(`Cheat config path "${entry.path}" has no default.`);
    if (!matches(defaults[entry.path], entry.type))
      throw new Error(`Cheat config path "${entry.path}" default does not match ${entry.type}.`);
  }
  for (const path of Object.keys(defaults))
    if (!paths.has(path)) throw new Error(`Cheat config default "${path}" has no schema entry.`);
  for (const descriptor of descriptors)
    for (const path of descriptor.config ?? [])
      if (!paths.has(path))
        throw new Error(`Cheat "${descriptor.id}" references unknown config path "${path}".`);
  return Object.freeze({ paths: Object.freeze([...paths].sort()) });
}
