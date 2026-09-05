export function createOneShotDescriptor(overrides = {}) {
  return {
    id: 'test.one-shot',
    location: { section: 'quick', group: 'contract', order: 10 },
    meta: {
      label: 'One shot',
      controls: [{ key: 'run', type: 'button', action: 'run' }],
    },
    actions: { run: () => ({ ok: true }) },
    ...overrides,
  };
}

export const supportedCheatCases = Object.freeze([
  {
    classification: 'one-shot',
    create() {
      return createOneShotDescriptor();
    },
  },
  {
    classification: 'bound-editor',
    create() {
      return createOneShotDescriptor({
        id: 'test.bound-editor',
        location: { section: 'stats', group: 'contract', order: 20 },
        meta: {
          label: 'Bound editor',
          controls: [
            { key: 'value', type: 'input', binding: { path: 'money', coerce: 'number' } },
            { key: 'set', type: 'button', action: 'set' },
          ],
        },
        actions: { set: () => true },
      });
    },
  },
  {
    classification: 'derived-value',
    create() {
      return {
        id: 'test.derived-value',
        location: { section: 'stats', group: 'contract', order: 30 },
        meta: { label: 'Derived value', controls: [{ key: 'current', type: 'text' }] },
        refresh: ['mount', 'section-open'],
        sync: () => undefined,
      };
    },
  },
  {
    classification: 'dynamic-options',
    create() {
      return {
        id: 'test.dynamic-options',
        location: { section: 'misc', group: 'contract', order: 40 },
        meta: {
          label: 'Dynamic options',
          controls: [{ key: 'target', type: 'select', options: [] }],
        },
        refresh: ['mount'],
        sync: () => undefined,
      };
    },
  },
  {
    classification: 'frame-toggle',
    create() {
      return {
        id: 'test.frame-toggle',
        location: { section: 'quick', group: 'contract', order: 50 },
        meta: {
          label: 'Frame toggle',
          controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }],
        },
        toggle: { cadence: 'frame', cooldownMs: 100, maxFailures: 3 },
        effect: () => undefined,
      };
    },
  },
  {
    classification: 'daily-toggle',
    create() {
      return {
        id: 'test.daily-toggle',
        location: { section: 'quick', group: 'contract', order: 60 },
        meta: {
          label: 'Daily toggle',
          controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }],
        },
        toggle: { cadence: 'daily', runOnActivate: false },
        effect: () => undefined,
      };
    },
  },
]);

export function createFullDescriptor() {
  return {
    id: 'test.full-contract',
    location: { section: 'misc', group: 'contract', order: 100 },
    meta: {
      label: 'Full contract',
      controls: [
        { key: 'enabled', type: 'toggle', action: 'toggle' },
        { key: 'run', type: 'button', action: 'run' },
        { key: 'value', type: 'input', binding: { path: 'money' } },
      ],
    },
    actions: { run: () => ({ ok: true }) },
    sync: () => undefined,
    refresh: ['mount', 'section-open', 'after-action', 'runtime-tick', 'manual'],
    toggle: {
      cadence: 'frame',
      cooldownMs: 50,
      maxFailures: 2,
      runOnActivate: true,
    },
    effect: () => undefined,
    isApplicable: () => true,
    requiredPaths: ['money'],
    onEnable: () => undefined,
    onDisable: () => undefined,
    dispose: () => undefined,
    config: ['toggles'],
    diagnostics: { category: 'contract' },
  };
}

export const configContractFixture = Object.freeze({
  defaults: Object.freeze({
    toggles: Object.freeze({}),
    'toggleBaselines.npcPregnancyChance': null,
    'debug.arrayCheck': false,
  }),
  schemaEntries: Object.freeze([
    Object.freeze({ path: 'toggles', type: 'object', scope: 'save' }),
    Object.freeze({
      path: 'toggleBaselines.npcPregnancyChance',
      type: 'number-or-null',
      scope: 'save',
    }),
    Object.freeze({ path: 'debug.arrayCheck', type: 'boolean', scope: 'save' }),
  ]),
});
