import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const bootstrapUrl = new URL('../../src/features/cheat-init.js', import.meta.url);
const builderUrl = new URL('../../src/cheats/runtime/builder.js', import.meta.url);

test('production bootstrap has no legacy metadata renderer or registry dependency', async () => {
  const source = await readFile(bootstrapUrl, 'utf8');
  for (const forbidden of [
    'metadata-renderer',
    'createQuickMetadata',
    'createStatMetadata',
    'createMiscMetadata',
    'renderRegistry',
    'renderLegacy',
  ]) {
    assert.equal(source.includes(forbidden), false, `production bootstrap contains ${forbidden}`);
  }
  assert.match(source, /createSectionShells/);
  assert.match(source, /builder\.mountSection/);
});

test('production builder mounts descriptors directly without hybrid slots', async () => {
  const source = await readFile(builderUrl, 'utf8');
  const productionBody = source.slice(source.indexOf('export function createCheatRuntimeBuilder'));
  assert.equal(productionBody.includes('createHybridRegistry('), false);
  assert.equal(productionBody.includes('cp-cheat-slot-'), false);
  assert.equal(productionBody.includes('renderLegacy'), false);
  assert.match(productionBody, /renderSectionShell/);
  assert.match(productionBody, /mountCheatDescriptor/);
});

