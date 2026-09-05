import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCheatDescriptorHarness,
  mountCheatCatalog,
} from '../helpers/cheat-descriptor-harness.js';
import { createDomWithSugarCube } from '../helpers/dom-test-env.js';
import { createFakeCheatScheduler } from '../helpers/fake-cheat-scheduler.js';
import { createFakeRuntimeEngine } from '../helpers/fake-game-adapter.js';
import { createMemoryToggleStore } from '../helpers/memory-toggle-store.js';

function createToggleDescriptor({
  id,
  cadence = 'frame',
  cooldownMs = 0,
  maxFailures = 5,
  runOnActivate = true,
  effect,
}) {
  return {
    id,
    meta: { controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }] },
    toggle: { cadence, cooldownMs, maxFailures, runOnActivate },
    effect,
  };
}

test('frame toggle enables once, runs immediately, respects cooldown, and stops after disable', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { runs: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore();
  const descriptor = createToggleDescriptor({
    id: 'test.frame-lifecycle',
    cooldownMs: 100,
    effect({ game }) {
      game.set('runs', game.get('runs') + 1);
    },
  });
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });

  try {
    await harness.mount();
    await harness.setToggleEnabled(true);
    await harness.setToggleEnabled(true);
    assert.equal(runtimeHarness.variables.runs, 1);
    assert.deepEqual(toggleStore.snapshot(), { 'test.frame-lifecycle': true });
    assert.equal(
      scheduler.getOperations().filter(({ operation }) => operation === 'register').length,
      1
    );

    await scheduler.runFrame(100);
    await scheduler.runFrame(150);
    await scheduler.runFrame(200);
    assert.equal(runtimeHarness.variables.runs, 3);

    await harness.setToggleEnabled(false);
    await scheduler.runFrame(300);
    assert.equal(runtimeHarness.variables.runs, 3);
    assert.equal(harness.isToggleEnabled, false);
    assert.equal(harness.controls.checked('enabled'), false);
    assert.equal(scheduler.has(descriptor.id), false);
    assert.deepEqual(toggleStore.snapshot(), {});
    assert.deepEqual(
      toggleStore.getOperations().map(({ operation }) => operation),
      ['write', 'remove']
    );
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('daily toggle runs once per distinct game day and never after disable', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { dailyRuns: 0 } });
  const scheduler = createFakeCheatScheduler();
  const descriptor = createToggleDescriptor({
    id: 'test.daily-lifecycle',
    cadence: 'daily',
    runOnActivate: false,
    effect({ game }) {
      game.set('dailyRuns', game.get('dailyRuns') + 1);
    },
  });
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
    scheduler,
  });

  try {
    await harness.mount();
    await harness.setToggleEnabled(true);
    await scheduler.runDaily(10);
    await scheduler.runDaily(10);
    await scheduler.runDaily(11);
    assert.equal(runtimeHarness.variables.dailyRuns, 2);

    await harness.setToggleEnabled(false);
    await scheduler.runDaily(12);
    assert.equal(runtimeHarness.variables.dailyRuns, 2);
    assert.equal(scheduler.has(descriptor.id), false);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('stable-ID restoration is idempotent and creates no persistence commits or duplicate callbacks', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { runs: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore({ 'test.stable-restore': true });
  const descriptor = createToggleDescriptor({
    id: 'test.stable-restore',
    effect({ game }) {
      game.set('runs', game.get('runs') + 1);
    },
  });
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });

  try {
    await harness.mount();
    assert.equal(await harness.restoreToggle(), true);
    assert.equal(await harness.restoreToggle(), true);
    assert.equal(runtimeHarness.variables.runs, 1);
    assert.deepEqual(scheduler.list(), [descriptor.id]);
    assert.equal(
      scheduler.getOperations().filter(({ operation }) => operation === 'register').length,
      1
    );
    assert.deepEqual(
      toggleStore.getOperations().map(({ operation }) => operation),
      ['read', 'read']
    );
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('retired persisted aliases are ignored in favor of stable cheat IDs', async () => {
  const env = createDomWithSugarCube();
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore({ oldToggleButtonId: true });
  const descriptor = createToggleDescriptor({
    id: 'test.stable-toggle-id',
    effect() {},
  });
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    scheduler,
    toggleStore,
  });

  try {
    await harness.mount();
    assert.equal(await harness.restoreToggle(), false);
    assert.deepEqual(toggleStore.snapshot(), { oldToggleButtonId: true });
    assert.deepEqual(toggleStore.getOperations(), [
      { operation: 'read', id: 'test.stable-toggle-id' },
    ]);

    toggleStore.clearOperations();
    assert.equal(await harness.restoreToggle(), false);
    assert.deepEqual(toggleStore.getOperations(), [
      { operation: 'read', id: 'test.stable-toggle-id' },
    ]);
    assert.equal(
      scheduler.getOperations().filter(({ operation }) => operation === 'register').length,
      0
    );
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('failure threshold quarantines only the broken toggle and preserves healthy toggles', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { goodRuns: 0, badRuns: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore();
  const broken = createToggleDescriptor({
    id: 'test.broken-toggle',
    maxFailures: 2,
    runOnActivate: false,
    effect({ game }) {
      game.set('badRuns', game.get('badRuns') + 1);
      throw new Error('planned toggle failure');
    },
  });
  const healthy = createToggleDescriptor({
    id: 'test.healthy-toggle',
    runOnActivate: false,
    effect({ game }) {
      game.set('goodRuns', game.get('goodRuns') + 1);
    },
  });
  const catalog = await mountCheatCatalog([broken, healthy], {
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });

  try {
    await catalog.get(broken.id).setToggleEnabled(true);
    await catalog.get(healthy.id).setToggleEnabled(true);
    await scheduler.runFrame(10);
    await scheduler.runFrame(20);
    await scheduler.runFrame(30);

    assert.deepEqual(runtimeHarness.variables, { goodRuns: 3, badRuns: 2 });
    assert.equal(catalog.get(broken.id).isToggleEnabled, false);
    assert.equal(catalog.get(broken.id).controls.checked('enabled'), false);
    assert.equal(scheduler.has(broken.id), false);
    assert.equal(toggleStore.snapshot()[broken.id], undefined);
    assert.equal(catalog.get(healthy.id).isToggleEnabled, true);
    assert.equal(catalog.get(healthy.id).controls.checked('enabled'), true);
    assert.equal(scheduler.has(healthy.id), true);
    assert.equal(toggleStore.snapshot()[healthy.id], true);
    assert.equal(catalog.get(broken.id).getSnapshot().logs.length, 1);
  } finally {
    await catalog.dispose();
    env.cleanup();
  }
});

test('watchdog restoration rebuilds persisted scheduler entries once without rewriting storage', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { first: 0, second: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore({
    'test.watchdog-first': true,
    'test.watchdog-second': true,
  });
  const makeDescriptor = (id, path) =>
    createToggleDescriptor({
      id,
      effect({ game }) {
        game.set(path, game.get(path) + 1);
      },
    });
  const descriptors = [
    makeDescriptor('test.watchdog-first', 'first'),
    makeDescriptor('test.watchdog-second', 'second'),
  ];
  const catalog = await mountCheatCatalog(descriptors, {
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });

  try {
    await catalog.trigger('restore');
    assert.deepEqual(runtimeHarness.variables, { first: 1, second: 1 });
    toggleStore.clearOperations();
    scheduler.clearOperations();

    await scheduler.restore({ onRestore: () => catalog.trigger('restore') });
    assert.deepEqual(runtimeHarness.variables, { first: 2, second: 2 });
    assert.deepEqual([...scheduler.list()].sort(), descriptors.map(({ id }) => id).sort());
    assert.deepEqual(
      toggleStore.getOperations().map(({ operation }) => operation),
      ['read', 'read']
    );
    assert.equal(
      scheduler.getOperations().filter(({ operation }) => operation === 'register').length,
      2
    );

    await catalog.trigger('restore');
    assert.deepEqual(runtimeHarness.variables, { first: 2, second: 2 });
    assert.equal(
      scheduler.getOperations().filter(({ operation }) => operation === 'register').length,
      2
    );
    assert.equal(
      toggleStore.getOperations().filter(({ operation }) => operation === 'write').length,
      0
    );
  } finally {
    await catalog.dispose();
    env.cleanup();
  }
});

test('remount and reinjection restore one scheduler entry, while dispose stops all future work', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { runs: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore();
  const descriptor = createToggleDescriptor({
    id: 'test.reinjected-toggle',
    effect({ game }) {
      game.set('runs', game.get('runs') + 1);
    },
  });

  const first = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });
  let second = null;
  try {
    const firstRoot = await first.mount();
    assert.equal(await first.mount(), firstRoot);
    await first.setToggleEnabled(true);
    assert.equal(runtimeHarness.variables.runs, 1);
    assert.deepEqual(scheduler.list(), [descriptor.id]);
    await first.dispose();
    assert.deepEqual(scheduler.list(), []);
    assert.deepEqual(toggleStore.snapshot(), { [descriptor.id]: true });

    second = createCheatDescriptorHarness({
      descriptor,
      document: env.document,
      runtimeHarness,
      scheduler,
      toggleStore,
    });
    await second.mount();
    await second.restoreToggle();
    await second.restoreToggle();
    assert.equal(runtimeHarness.variables.runs, 2);
    assert.deepEqual(scheduler.list(), [descriptor.id]);

    await second.dispose();
    await scheduler.runFrame(100);
    assert.equal(runtimeHarness.variables.runs, 2);
    assert.deepEqual(scheduler.list(), []);
    assert.equal(second.signal.aborted, true);
  } finally {
    await second?.dispose();
    await first.dispose();
    env.cleanup();
  }
});
