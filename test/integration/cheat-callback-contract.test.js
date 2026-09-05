import test from 'node:test';
import assert from 'node:assert/strict';

import { configContractFixture } from '../contracts/cheat-contract-cases.js';
import { createCheatDescriptorHarness } from '../helpers/cheat-descriptor-harness.js';
import { createDomWithSugarCube } from '../helpers/dom-test-env.js';
import { createFakeConfigFacade } from '../helpers/fake-config-facade.js';

test('every callback receives the explicit game/config/control/lifecycle context', async () => {
  const env = createDomWithSugarCube();
  const configHarness = createFakeConfigFacade({
    schemaEntries: configContractFixture.schemaEntries,
    values: { 'debug.arrayCheck': false },
  });
  let received = null;
  const descriptor = {
    id: 'test.callback-context',
    config: ['debug.arrayCheck'],
    meta: { controls: [{ key: 'run', type: 'button', action: 'run' }] },
    actions: {
      run(context) {
        received = context;
        context.config.set('debug.arrayCheck', true);
        return { ok: true };
      },
    },
  };
  const harness = createCheatDescriptorHarness({
    descriptor,
    document: env.document,
    configHarness,
  });

  try {
    await harness.mount();
    const event = new env.window.MouseEvent('click');
    await harness.runAction('run', { event });

    assert.deepEqual(Object.keys(received).sort(), [
      'cheat',
      'config',
      'controls',
      'event',
      'feedback',
      'game',
      'reason',
      'services',
      'signal',
    ]);
    assert.equal(Object.isFrozen(received), true);
    assert.equal(received.cheat, descriptor);
    assert.notEqual(received.game, harness.runtimeHarness.runtimeEngine.adapter);
    assert.notEqual(received.config, configHarness.config);
    assert.equal(received.controls, harness.controls);
    assert.equal(received.event, event);
    assert.equal(received.reason, 'action');
    assert.equal(received.signal, harness.signal);
    assert.equal(received.signal.aborted, false);
    assert.deepEqual(Object.keys(received.services).sort(), ['diagnostics', 'logger', 'scheduler']);
    assert.equal(Object.isFrozen(received.services), true);
    assert.equal(received.window, undefined);
    assert.equal(received.SugarCube, undefined);
    assert.equal(configHarness.values['debug.arrayCheck'], true);
    assert.deepEqual(configHarness.getCalls(), [
      { operation: 'set', path: 'debug.arrayCheck', value: true },
    ]);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('action outcomes normalize booleans, empty results, values, failures, and thrown errors', async () => {
  const env = createDomWithSugarCube();
  const descriptor = {
    id: 'test.outcomes',
    meta: { controls: [{ key: 'placeholder', type: 'text' }] },
    actions: {
      truthy: () => true,
      empty: () => undefined,
      falsey: () => false,
      value: () => 'result',
      blocked: () => ({ ok: false, message: 'Blocked', variant: 'warning' }),
      thrown() {
        throw new Error('Exploded');
      },
    },
  };
  const harness = createCheatDescriptorHarness({ descriptor, document: env.document });

  try {
    await harness.mount();
    assert.deepEqual(await harness.runAction('truthy'), { ok: true });
    assert.deepEqual(await harness.runAction('empty'), { ok: true });
    assert.deepEqual(await harness.runAction('falsey'), { ok: false });
    assert.deepEqual(await harness.runAction('value'), { ok: true, value: 'result' });
    assert.deepEqual(await harness.runAction('blocked'), {
      ok: false,
      message: 'Blocked',
      variant: 'warning',
    });

    const thrown = await harness.runAction('thrown');
    assert.equal(thrown.ok, false);
    assert.equal(thrown.message, 'Exploded');
    assert.equal(thrown.variant, 'error');
    assert.equal(thrown.error.message, 'Exploded');
    assert.deepEqual(harness.getSnapshot().feedback, [
      { variant: 'warning', message: 'Blocked' },
      { variant: 'error', message: 'Exploded' },
    ]);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});

test('renderer refreshes only after a successful action outcome', async () => {
  const env = createDomWithSugarCube();
  const syncReasons = [];
  const descriptor = {
    id: 'test.outcome-refresh',
    meta: { controls: [{ key: 'placeholder', type: 'text' }] },
    actions: {
      success: () => ({ ok: true, refresh: true }),
      failure: () => ({ ok: false, refresh: true }),
    },
    sync({ reason }) {
      syncReasons.push(reason);
    },
  };
  const harness = createCheatDescriptorHarness({ descriptor, document: env.document });

  try {
    await harness.mount();
    await harness.runAction('failure');
    await harness.runAction('success');
    assert.deepEqual(syncReasons, ['after-action']);
    assert.deepEqual(harness.getSnapshot().refreshRequests, ['after-action']);
  } finally {
    await harness.dispose();
    env.cleanup();
  }
});
