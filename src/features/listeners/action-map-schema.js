/**
 * @typedef {'frame'|'daily'} ToggleTrigger
 * @typedef {{id: string, label: string, trigger?: ToggleTrigger, cooldownMs?: number, maxFailures?: number, runOnActivate?: boolean}} ToggleActionEntry
 * @typedef {{actionKey: string, methodName?: string}} MethodActionEntry
 * @typedef {{actionKey: string, navKey: string, contentKey: string, hydrateKey: 'hydrateQuickSection'|'hydrateStatsSection'|'hydrateMiscSection'}} NavActionEntry
 * @typedef {{actionKey: string, target: 'closeModal'|'openModal'|'moveButton'|'cheatActions'|'Enable_cheat_history'|'Enable_sidebar_button'|'simple_cheat_button'|'init_interface'|'executeSearch', arg?: string}} SimpleUiActionEntry
 * @typedef {{actionKey: string, source: 'hydrateCheatUi'|'hydratePregnancy'|'cheatActions'|'executeSearch', method: string}} BoundActionEntry
 */

function assertNonEmptyString(value, fieldName, index, bucketName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(
      `[action-map-schema] ${bucketName}[${index}].${fieldName} must be a non-empty string`
    );
  }
}

function assertUniqueKeys(entries, keyGetter, bucketName) {
  const seen = new Set();
  entries.forEach((entry, index) => {
    const key = keyGetter(entry);
    assertNonEmptyString(key, 'key', index, bucketName);
    if (seen.has(key)) {
      throw new Error(`[action-map-schema] Duplicate key "${key}" in ${bucketName}`);
    }
    seen.add(key);
  });
}

/** @param {ToggleActionEntry[]} entries */
export function validateToggleEntries(entries, bucketName) {
  if (!Array.isArray(entries)) {
    throw new Error(`[action-map-schema] ${bucketName} must be an array`);
  }

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}] must be an object`);
    }
    assertNonEmptyString(entry.id, 'id', index, bucketName);
    assertNonEmptyString(entry.label, 'label', index, bucketName);
    if (entry.trigger != null && entry.trigger !== 'frame' && entry.trigger !== 'daily') {
      throw new Error(
        `[action-map-schema] ${bucketName}[${index}].trigger must be "frame" or "daily"`
      );
    }
    if (entry.cooldownMs != null && (!Number.isFinite(entry.cooldownMs) || entry.cooldownMs < 0)) {
      throw new Error(
        `[action-map-schema] ${bucketName}[${index}].cooldownMs must be a non-negative number`
      );
    }
    if (
      entry.maxFailures != null &&
      (!Number.isInteger(entry.maxFailures) || entry.maxFailures < 1)
    ) {
      throw new Error(
        `[action-map-schema] ${bucketName}[${index}].maxFailures must be an integer >= 1`
      );
    }
    if (entry.runOnActivate != null && typeof entry.runOnActivate !== 'boolean') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}].runOnActivate must be boolean`);
    }
  });

  assertUniqueKeys(entries, (entry) => entry.id, bucketName);
}

/** @param {MethodActionEntry[]} entries */
export function validateMethodEntries(entries, bucketName) {
  if (!Array.isArray(entries)) {
    throw new Error(`[action-map-schema] ${bucketName} must be an array`);
  }

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}] must be an object`);
    }
    assertNonEmptyString(entry.actionKey, 'actionKey', index, bucketName);
    if (entry.methodName != null) {
      assertNonEmptyString(entry.methodName, 'methodName', index, bucketName);
    }
  });

  assertUniqueKeys(entries, (entry) => entry.actionKey, bucketName);
}

/** @param {NavActionEntry[]} entries */
export function validateNavEntries(entries, bucketName) {
  if (!Array.isArray(entries)) {
    throw new Error(`[action-map-schema] ${bucketName} must be an array`);
  }

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}] must be an object`);
    }
    assertNonEmptyString(entry.actionKey, 'actionKey', index, bucketName);
    assertNonEmptyString(entry.navKey, 'navKey', index, bucketName);
    assertNonEmptyString(entry.contentKey, 'contentKey', index, bucketName);
    assertNonEmptyString(entry.hydrateKey, 'hydrateKey', index, bucketName);
  });

  assertUniqueKeys(entries, (entry) => entry.actionKey, bucketName);
}

/** @param {SimpleUiActionEntry[]} entries */
export function validateSimpleUiEntries(entries, bucketName) {
  if (!Array.isArray(entries)) {
    throw new Error(`[action-map-schema] ${bucketName} must be an array`);
  }

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}] must be an object`);
    }
    assertNonEmptyString(entry.actionKey, 'actionKey', index, bucketName);
    assertNonEmptyString(entry.target, 'target', index, bucketName);
    if (entry.arg != null) {
      assertNonEmptyString(entry.arg, 'arg', index, bucketName);
    }
  });

  assertUniqueKeys(entries, (entry) => entry.actionKey, bucketName);
}

/** @param {BoundActionEntry[]} entries */
export function validateBoundEntries(entries, bucketName) {
  if (!Array.isArray(entries)) {
    throw new Error(`[action-map-schema] ${bucketName} must be an array`);
  }

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[action-map-schema] ${bucketName}[${index}] must be an object`);
    }
    assertNonEmptyString(entry.actionKey, 'actionKey', index, bucketName);
    assertNonEmptyString(entry.source, 'source', index, bucketName);
    assertNonEmptyString(entry.method, 'method', index, bucketName);
  });

  assertUniqueKeys(entries, (entry) => entry.actionKey, bucketName);
}
