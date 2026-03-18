/* eslint-disable no-restricted-syntax */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createDomWithSugarCube } from '../helpers/dom-test-env.js';

function clearRegisteredActions({ getKeys, unregister, clearErrorHook }) {
  getKeys().forEach((key) => unregister(key));
  clearErrorHook();
}

test('metadata renderer supports render/bind/update action lifecycle', async () => {
  const env = createDomWithSugarCube({
    passage: 'Town',
    vars: {
      money: 10,
    },
  });
  const { register, getKeys, unregister, clearErrorHook } = await import(
    '../../src/core/actions/dispatcher.js'
  );
  const { CONTROL_TYPES } = await import('../../src/ui/metadata/schema.js');
  const { renderRegistry } = await import('../../src/ui/renderers/metadata-renderer.js');

  const container = env.document.createElement('div');
  env.document.body.appendChild(container);

  let calls = 0;
  register('test_action', () => {
    calls += 1;
  });

  const controls = [
    {
      type: CONTROL_TYPES.GROUP,
      children: [
        {
          type: CONTROL_TYPES.INPUT,
          id: 'money_input',
          binding: { path: 'money', required: true },
          coerce: 'number',
        },
        {
          type: CONTROL_TYPES.BUTTON,
          id: 'test_button',
          label: 'Run',
          action: 'test_action',
        },
      ],
    },
  ];

  try {
    renderRegistry(controls, container);

    const input = container.querySelector('#money_input');
    const button = container.querySelector('#test_button');

    assert.ok(input);
    assert.ok(button);
    assert.equal(input.value, '10');

    input.value = '25';
    input.dispatchEvent(new env.window.Event('input', { bubbles: true }));
    assert.equal(env.variables.money, 25);

    button.dispatchEvent(new env.window.MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 1);
  } finally {
    clearRegisteredActions({ getKeys, unregister, clearErrorHook });
    env.cleanup();
  }
});

test('metadata renderer teardown removes stale listeners across rerender', async () => {
  const env = createDomWithSugarCube({ passage: 'Town' });
  const { register, getKeys, unregister, clearErrorHook } = await import(
    '../../src/core/actions/dispatcher.js'
  );
  const { CONTROL_TYPES } = await import('../../src/ui/metadata/schema.js');
  const { renderRegistry } = await import('../../src/ui/renderers/metadata-renderer.js');

  const container = env.document.createElement('div');
  env.document.body.appendChild(container);

  let calls = 0;
  register('test_action', () => {
    calls += 1;
  });

  const controls = [
    {
      type: CONTROL_TYPES.GROUP,
      children: [
        {
          type: CONTROL_TYPES.BUTTON,
          id: 'test_button',
          label: 'Run',
          action: 'test_action',
        },
      ],
    },
  ];

  try {
    renderRegistry(controls, container);
    const oldButton = container.querySelector('#test_button');

    renderRegistry(controls, container);
    const allButtons = container.querySelectorAll('#test_button');
    const latestButton = allButtons[allButtons.length - 1];

    oldButton.dispatchEvent(new env.window.MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 0);

    latestButton.dispatchEvent(new env.window.MouseEvent('click', { bubbles: true }));
    assert.equal(calls, 1);
  } finally {
    clearRegisteredActions({ getKeys, unregister, clearErrorHook });
    env.cleanup();
  }
});

test('metadata renderer marks section broken for missing required path', async () => {
  const env = createDomWithSugarCube({ passage: 'Town', vars: {} });
  const { getKeys, unregister, clearErrorHook } = await import(
    '../../src/core/actions/dispatcher.js'
  );
  const { CONTROL_TYPES } = await import('../../src/ui/metadata/schema.js');
  const { renderRegistry } = await import('../../src/ui/renderers/metadata-renderer.js');

  const container = env.document.createElement('div');
  env.document.body.appendChild(container);

  const controls = [
    {
      type: CONTROL_TYPES.GROUP,
      children: [
        {
          type: CONTROL_TYPES.INPUT,
          id: 'missing_input',
          binding: { path: 'missing.path', required: true, onMissing: 'mark-section-broken' },
        },
      ],
    },
  ];

  try {
    renderRegistry(controls, container);
    const input = container.querySelector('#missing_input');
    assert.ok(input);
    assert.equal(input.disabled, true);
    assert.equal(container.classList.contains('cp-section-broken'), true);
  } finally {
    clearRegisteredActions({ getKeys, unregister, clearErrorHook });
    env.cleanup();
  }
});
