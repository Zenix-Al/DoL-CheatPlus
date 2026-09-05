import test from 'node:test';
import assert from 'node:assert/strict';

import { createFakeCheatScheduler } from '../helpers/fake-cheat-scheduler.js';
import { createFakeGameAdapter, createFakeRuntimeEngine } from '../helpers/fake-game-adapter.js';
import { createManualFrameDriver } from '../helpers/manual-frame-driver.js';
import { createMemoryToggleStore } from '../helpers/memory-toggle-store.js';

test('fake game adapter exposes the planned callback API and exact calls', () => {
  const harness = createFakeGameAdapter({
    variables: { money: 10, player: { body: { size: 2 } } },
    setup: { NPCNameList: ['Avery'] },
    passage: 'Town',
  });

  assert.equal(harness.game.id, 'fake');
  assert.equal(harness.game.isReady(), true);
  assert.equal(harness.game.get('player.body.size'), 2);
  assert.equal(harness.game.has('money'), true);
  assert.equal(harness.game.has('missing.path'), false);
  assert.deepEqual(harness.game.setup('NPCNameList'), ['Avery']);
  assert.equal(harness.game.passage(), 'Town');

  harness.game.set('player.body.size', 3);
  harness.game.set('new.nested.value', 7);
  assert.equal(harness.variables.player.body.size, 3);
  assert.equal(harness.variables.new.nested.value, 7);

  assert.deepEqual(
    harness.getCalls().map(({ operation, path }) => ({ operation, path })),
    [
      { operation: 'isReady', path: undefined },
      { operation: 'get', path: 'player.body.size' },
      { operation: 'has', path: 'money' },
      { operation: 'has', path: 'missing.path' },
      { operation: 'setup', path: 'NPCNameList' },
      { operation: 'passage', path: undefined },
      { operation: 'set', path: 'player.body.size' },
      { operation: 'set', path: 'new.nested.value' },
    ]
  );
});

test('fake game adapter readiness, passage, and call history are controllable', () => {
  const harness = createFakeGameAdapter({ ready: false, passage: 'Start' });

  assert.equal(harness.game.isReady(), false);
  harness.setReady(true);
  harness.setPassage('School');
  assert.equal(harness.game.isReady(), true);
  assert.equal(harness.game.passage(), 'School');

  harness.clearCalls();
  assert.deepEqual(harness.getCalls(), []);
});

test('fake runtime engine exposes the fake adapter through the production-shaped boundary', () => {
  const harness = createFakeRuntimeEngine({ ready: true, variables: { money: 10 } });

  assert.equal(harness.runtimeEngine.id, 'fake');
  assert.equal(harness.runtimeEngine.adapter, harness.game);
  assert.equal(harness.runtimeEngine.hasCorePrerequisites(), true);
  assert.equal(harness.runtimeEngine.hasRuntimePrerequisites(), true);
  assert.deepEqual(harness.runtimeEngine.describePrerequisiteState(), { ready: true });
});

test('manual frame driver executes queued callbacks deterministically', () => {
  const driver = createManualFrameDriver();
  const observed = [];

  const cancelled = driver.requestAnimationFrame(() => observed.push('cancelled'));
  driver.requestAnimationFrame((timestamp) => {
    observed.push(`first:${timestamp}`);
    driver.requestAnimationFrame((nextTimestamp) => observed.push(`second:${nextTimestamp}`));
  });
  driver.cancelAnimationFrame(cancelled);

  assert.equal(driver.pendingCount, 1);
  assert.equal(driver.step(20), 1);
  assert.deepEqual(observed, ['first:20']);
  assert.equal(driver.pendingCount, 1);
  assert.deepEqual(driver.flush(), { frames: 1, callbacks: 1, timestamp: 36 });
  assert.deepEqual(observed, ['first:20', 'second:36']);
});

test('memory toggle store records persistence behavior without browser storage', () => {
  const store = createMemoryToggleStore({ existing: true });

  assert.equal(store.read('existing'), true);
  store.write('new-toggle', true);
  assert.equal(store.has('new-toggle'), true);
  store.remove('existing');

  assert.deepEqual(store.snapshot(), { 'new-toggle': true });
  assert.deepEqual(store.getOperations(), [
    { operation: 'read', id: 'existing' },
    { operation: 'write', id: 'new-toggle', value: true },
    { operation: 'has', id: 'new-toggle' },
    { operation: 'remove', id: 'existing' },
  ]);
});

test('fake scheduler records failures and unregisters at the declared threshold', async () => {
  const scheduler = createFakeCheatScheduler();
  scheduler.register(
    'broken-toggle',
    () => {
      throw new Error('effect failed');
    },
    { cadence: 'frame', maxFailures: 2 }
  );

  await scheduler.runFrame(10);
  assert.equal(scheduler.has('broken-toggle'), true);
  await scheduler.runFrame(20);
  assert.equal(scheduler.has('broken-toggle'), false);

  assert.deepEqual(
    scheduler.getOperations().map((operation) => operation.operation),
    ['register', 'failure', 'failure', 'unregister']
  );
});
