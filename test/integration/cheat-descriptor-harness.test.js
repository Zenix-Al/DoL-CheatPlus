/* eslint-disable no-restricted-syntax */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCheatDescriptorHarness,
  mountCheatCatalog,
} from '../helpers/cheat-descriptor-harness.js';
import { createFakeCheatScheduler } from '../helpers/fake-cheat-scheduler.js';
import { createFakeRuntimeEngine } from '../helpers/fake-game-adapter.js';
import { createMemoryToggleStore } from '../helpers/memory-toggle-store.js';
import { createDomWithSugarCube } from '../helpers/dom-test-env.js';

test('descriptor harness mounts controls, runs a local action, and refreshes from the fake game', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { money: 10 } });
  const descriptor = {
    id: 'player.money',
    meta: {
      controls: [
        { key: 'value', type: 'input' },
        { key: 'set', type: 'button', label: 'Set', action: 'set' },
        { key: 'current', type: 'text' },
      ],
    },
    refresh: ['mount', 'after-action'],
    actions: {
      set({ game, controls, reason }) {
        assert.equal(reason, 'action');
        game.set('money', controls.number('value'));
        return { ok: true, message: 'Money updated.' };
      },
    },
    sync({ game, controls, reason }) {
      assert.equal(['mount', 'after-action'].includes(reason), true);
      controls.text('current', game.get('money'));
    },
  };
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
  });

  try {
    await harness.mount();
    assert.equal(harness.controls.element('current').textContent, '10');

    harness.controls.setValue('value', '250');
    const outcome = await harness.runAction('set');
    assert.deepEqual(outcome, { ok: true, message: 'Money updated.' });
    assert.equal(runtimeHarness.variables.money, 250);
    assert.equal(harness.controls.element('current').textContent, '250');

    const snapshot = harness.getSnapshot();
    assert.deepEqual(snapshot.refreshRequests, ['mount', 'after-action']);
    assert.deepEqual(snapshot.feedback, [{ variant: 'success', message: 'Money updated.' }]);
    assert.deepEqual(
      runtimeHarness.getCalls().map((entry) => entry.operation),
      ['isReady', 'variables', 'isReady', 'variables', 'isReady', 'variables']
    );
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('mounted action events use the local descriptor handler and expose the DOM event', async () => {
  const env = createDomWithSugarCube();
  let receivedEvent = null;
  const descriptor = {
    id: 'test.event',
    meta: { controls: [{ key: 'run', type: 'button', action: 'run' }] },
    actions: {
      run({ event }) {
        receivedEvent = event;
        return true;
      },
    },
  };
  const harness = createCheatDescriptorHarness({ descriptor, document: env.document });

  try {
    await harness.mount();
    harness.controls
      .element('run')
      .dispatchEvent(new env.window.MouseEvent('click', { bubbles: true }));
    await harness.waitForIdle();

    assert.ok(receivedEvent instanceof env.window.MouseEvent);
    assert.deepEqual(harness.getSnapshot().outcomes, [{ ok: true }]);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('descriptor harness rejects an unresolved local action before interaction', async () => {
  const env = createDomWithSugarCube();
  const harness = createCheatDescriptorHarness({
    document: env.document,
    descriptor: {
      id: 'test.missing-action',
      meta: { controls: [{ key: 'run', type: 'button', action: 'missing' }] },
      actions: {},
    },
  });

  try {
    await assert.rejects(harness.mount(), /missing local action "missing"/);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('descriptor harness captures a thrown action as a failed outcome and error feedback', async () => {
  const env = createDomWithSugarCube();
  const harness = createCheatDescriptorHarness({
    document: env.document,
    descriptor: {
      id: 'test.failed-action',
      meta: { controls: [{ key: 'run', type: 'button', action: 'run' }] },
      actions: {
        run() {
          throw new Error('planned failure');
        },
      },
    },
  });

  try {
    await harness.mount();
    const outcome = await harness.runAction('run');
    assert.equal(outcome.ok, false);
    assert.equal(outcome.message, 'planned failure');
    assert.deepEqual(harness.getSnapshot().feedback, [
      { variant: 'error', message: 'planned failure' },
    ]);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('small catalog keeps repeated local control keys isolated by descriptor', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { first: 0, second: 0 } });
  const makeDescriptor = (id, path) => ({
    id,
    meta: {
      controls: [
        { key: 'value', type: 'input' },
        { key: 'apply', type: 'button', action: 'apply' },
      ],
    },
    actions: {
      apply({ game, controls }) {
        game.set(path, controls.number('value'));
      },
    },
  });
  const catalog = await mountCheatCatalog(
    [makeDescriptor('test.first', 'first'), makeDescriptor('test.second', 'second')],
    { document: env.document, runtimeHarness }
  );

  try {
    catalog.get('test.first').controls.setValue('value', 11);
    catalog.get('test.second').controls.setValue('value', 22);
    await catalog.get('test.first').runAction('apply');
    await catalog.get('test.second').runAction('apply');

    assert.deepEqual(runtimeHarness.variables, { first: 11, second: 22 });
    assert.notEqual(
      catalog.get('test.first').controls.element('value'),
      catalog.get('test.second').controls.element('value')
    );
  } finally {
    await catalog.dispose();
    env.cleanup();
  }
});

test('harness drives section-open and records lifecycle cleanup without leaked listeners', async () => {
  const env = createDomWithSugarCube();
  const lifecycle = [];
  let actionCalls = 0;
  const descriptor = {
    id: 'test.lifecycle',
    meta: { controls: [{ key: 'run', type: 'button', action: 'run' }] },
    refresh: ['section-open'],
    actions: {
      run() {
        actionCalls += 1;
      },
    },
    sync({ reason }) {
      lifecycle.push(`sync:${reason}`);
    },
    onEnable({ reason, signal }) {
      lifecycle.push(`enable:${reason}:${signal.aborted}`);
      return () => lifecycle.push('cleanup:onEnable');
    },
    onDisable({ reason, signal }) {
      lifecycle.push(`disable:${reason}:${signal.aborted}`);
    },
    dispose({ reason, signal }) {
      lifecycle.push(`dispose:${reason}:${signal.aborted}`);
    },
  };
  const harness = createCheatDescriptorHarness({ descriptor, document: env.document });

  try {
    await harness.mount();
    const oldButton = harness.controls.element('run');
    await harness.trigger('section-open');
    await harness.dispose();

    oldButton.dispatchEvent(new env.window.MouseEvent('click', { bubbles: true }));
    await harness.waitForIdle();

    assert.equal(actionCalls, 0);
    assert.equal(harness.signal.aborted, true);
    assert.equal(env.document.contains(oldButton), false);
    assert.deepEqual(lifecycle, [
      'enable:mount:false',
      'sync:section-open',
      'disable:dispose:false',
      'dispose:dispose:false',
      'cleanup:onEnable',
    ]);
    assert.deepEqual(harness.getSnapshot().cleanupRegistrations, [{ source: 'onEnable' }]);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('frame toggle restore, cooldown, disable, and persistence are deterministic', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { arousal: 0 } });
  const scheduler = createFakeCheatScheduler();
  const toggleStore = createMemoryToggleStore({ 'player.infinite-arousal': true });
  const effectReasons = [];
  const descriptor = {
    id: 'player.infinite-arousal',
    meta: { controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }] },
    toggle: {
      cadence: 'frame',
      cooldownMs: 100,
      runOnActivate: true,
    },
    effect({ game, reason }) {
      effectReasons.push(reason);
      game.set('arousal', 10000);
    },
  };
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    runtimeHarness,
    scheduler,
    toggleStore,
  });

  try {
    await harness.mount();
    assert.equal(await harness.trigger('restore'), true);
    assert.equal(harness.isToggleEnabled, true);
    assert.equal(scheduler.has(descriptor.id), true);
    assert.equal(runtimeHarness.variables.arousal, 10000);

    runtimeHarness.variables.arousal = 1;
    await scheduler.runFrame(100);
    assert.equal(runtimeHarness.variables.arousal, 10000);

    runtimeHarness.variables.arousal = 2;
    await scheduler.runFrame(150);
    assert.equal(runtimeHarness.variables.arousal, 2);
    await scheduler.runFrame(200);
    assert.equal(runtimeHarness.variables.arousal, 10000);

    await harness.setToggleEnabled(false);
    assert.equal(scheduler.has(descriptor.id), false);
    assert.deepEqual(toggleStore.snapshot(), {});
    assert.deepEqual(toggleStore.getOperations(), [
      { operation: 'read', id: 'player.infinite-arousal' },
      { operation: 'remove', id: 'player.infinite-arousal' },
    ]);
    assert.deepEqual(effectReasons, ['restore', 'frame', 'frame']);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('daily toggle executes once per distinct day', async () => {
  const env = createDomWithSugarCube();
  const runtimeHarness = createFakeRuntimeEngine({ variables: { runs: 0 } });
  const scheduler = createFakeCheatScheduler();
  const effectReasons = [];
  const descriptor = {
    id: 'world.daily-example',
    meta: { controls: [{ key: 'enabled', type: 'toggle', action: 'toggle' }] },
    toggle: { cadence: 'daily', runOnActivate: false },
    effect({ game, reason }) {
      effectReasons.push(reason);
      game.set('runs', game.get('runs') + 1);
    },
  };
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
    assert.equal(runtimeHarness.variables.runs, 2);
    assert.deepEqual(effectReasons, ['daily', 'daily']);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});
