import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';

import { legacyCheatInventory } from '../baseline/legacy-cheat-inventory.js';
import { mountCheatCatalog } from '../helpers/cheat-descriptor-harness.js';
import { createDomWithSugarCube } from '../helpers/dom-test-env.js';

const MAX_THREE_CYCLE_DURATION_MS = 5000;

function createTargetScaleCatalog(counter) {
  return legacyCheatInventory.map((entry, index) => ({
    id: `target-scale.cheat-${index}`,
    meta: {
      label: entry.action,
      controls: [{ key: 'run', type: 'button', action: 'run' }],
    },
    actions: {
      run() {
        counter.count += 1;
      },
    },
  }));
}

test('target-scale catalog survives repeated mount/action/dispose cycles without leaks', async () => {
  const env = createDomWithSugarCube();
  const counter = { count: 0 };
  const descriptors = createTargetScaleCatalog(counter);
  const startedAt = performance.now();

  try {
    assert.ok(descriptors.length > 0, 'legacy inventory must provide the migration target size');
    for (let cycle = 0; cycle < 3; cycle += 1) {
      const catalog = await mountCheatCatalog(descriptors, { document: env.document });
      const oldButtons = catalog.list().map((harness) => harness.controls.element('run'));

      for (const harness of catalog.list()) await harness.runAction('run');
      assert.equal(env.document.querySelectorAll('[data-cheat-id]').length, descriptors.length);

      await catalog.dispose();
      assert.equal(catalog.list().length, 0);
      assert.equal(env.document.querySelectorAll('[data-cheat-id]').length, 0);
      assert.equal(catalog.scheduler.list().length, 0);

      const countAfterDispose = counter.count;
      for (const button of oldButtons) button.click();
      assert.equal(counter.count, countAfterDispose, 'disposed controls must lose their listeners');
    }

    assert.equal(counter.count, descriptors.length * 3);
    const durationMs = performance.now() - startedAt;
    assert.ok(
      durationMs <= MAX_THREE_CYCLE_DURATION_MS,
      `target-scale lifecycle took ${durationMs.toFixed(
        1
      )}ms (limit ${MAX_THREE_CYCLE_DURATION_MS}ms)`
    );
  } finally {
    env.cleanup();
  }
});
