const SCOPES = new Set(['catalog', 'runtime', 'aliases', 'scheduler', 'config']);

export function createDiagnosticProbe(definition) {
  if (!definition || typeof definition !== 'object' || Array.isArray(definition))
    throw new TypeError('Diagnostic probe must be an object.');
  const allowed = new Set(['id', 'label', 'scope', 'applicable', 'run', 'timeoutMs']);
  for (const key of Object.keys(definition))
    if (!allowed.has(key)) throw new Error(`Unknown diagnostic probe field "${key}".`);
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(definition.id ?? ''))
    throw new Error('Diagnostic probe requires a stable lowercase namespaced id.');
  if (typeof definition.label !== 'string' || !definition.label.trim())
    throw new TypeError(`Diagnostic probe "${definition.id}" requires a label.`);
  if (!SCOPES.has(definition.scope))
    throw new Error(`Diagnostic probe "${definition.id}" has an invalid scope.`);
  if (definition.applicable != null && typeof definition.applicable !== 'function')
    throw new TypeError(`Diagnostic probe "${definition.id}" applicable must be a function.`);
  if (typeof definition.run !== 'function')
    throw new TypeError(`Diagnostic probe "${definition.id}" requires run().`);
  if (!Number.isInteger(definition.timeoutMs) || definition.timeoutMs < 1)
    throw new TypeError(`Diagnostic probe "${definition.id}" requires a positive timeoutMs.`);
  return Object.freeze({ ...definition });
}
