import test from 'node:test';
import assert from 'node:assert/strict';

import { createCheatCatalog } from '../../src/cheats/catalog.js';
import { createCheat } from '../../src/cheats/create-cheat.js';
import { createCheatRuntimeBuilder } from '../../src/cheats/runtime/builder.js';
import { createDomWithSugarCube } from '../helpers/dom-test-env.js';
import { createFakeConfigFacade } from '../helpers/fake-config-facade.js';
import { createFakeGameAdapter } from '../helpers/fake-game-adapter.js';

function descriptor(id, order) {
  return createCheat({
    id,
    location: { section: 'quick', group: 'state', order },
    meta: {
      label: id,
      controls: [{ key: 'run', type: 'button', label: 'Run', action: 'run' }],
    },
    actions: {
      run({ game }) {
        game.set('counter', (game.get('counter') ?? 0) + 1);
        return { ok: true };
      },
    },
  });
}

test('catalog builder compiles once and owns direct mount, remount, health, and teardown', async () => {
  const env = createDomWithSugarCube();
  const container = env.document.createElement('section');
  env.document.body.appendChild(container);
  const adapter = createFakeGameAdapter({ variables: { counter: 0 } });
  const catalog = createCheatCatalog([
    descriptor('test.builder-second', 20),
    descriptor('test.builder-first', 10),
  ]);
  const builder = createCheatRuntimeBuilder({
    catalog,
    adapter: adapter.game,
    config: createFakeConfigFacade().config,
    document: env.document,
  });
  const shellRows = [
    {
      key: 'state',
      role: 'heading',
      groups: ['state'],
      controls: [{ type: 'heading', text: 'State' }],
    },
  ];

  try {
    assert.equal(builder.compile(), true);
    assert.equal(builder.compile(), false);

    await builder.mountSection('quick', container, shellRows);
    assert.deepEqual(
      [...container.querySelectorAll('[data-cheat-id]')].map(({ dataset }) => dataset.cheatId),
      ['test.builder-first', 'test.builder-second']
    );
    assert.deepEqual(builder.health(), {
      total: 2,
      applicable: 2,
      mounted: 2,
      disabled: 0,
      failed: 0,
    });

    const firstRoot = builder.getMounted('test.builder-first').root;
    builder.getMounted('test.builder-first').controls.element('run').click();
    await builder.getMounted('test.builder-first').waitForIdle();
    assert.equal(adapter.variables.counter, 1);

    await builder.mountSection('quick', container, shellRows);
    assert.equal(firstRoot.isConnected, false);
    assert.equal(container.querySelectorAll('[data-cheat-id]').length, 2);

    assert.equal(await builder.teardown(), true);
    assert.equal(container.children.length, 0);
    assert.equal(builder.health().mounted, 0);
    assert.equal(await builder.teardown(), false);
  } finally {
    await builder.teardown();
    env.cleanup();
  }
});
