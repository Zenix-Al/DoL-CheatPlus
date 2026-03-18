import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validateActionIds } = require('../../build/validate-action-ids.cjs');

test('action-id validator passes in default mode', () => {
  const ok = validateActionIds();
  assert.equal(ok, true);
});

test('action-id validator passes with strict metadata uniqueness', () => {
  const ok = validateActionIds({ strictMetadataUnique: true });
  assert.equal(ok, true);
});
