import { resolve } from 'node:path';

import { checkCheatManifest, generateCheatManifest } from './cheat-manifest.js';

const options = {
  definitionsDir: resolve('src/cheats/definitions'),
  outputFile: resolve('src/generated/cheats.generated.js'),
};
const check = process.argv.includes('--check');
const result = check ? checkCheatManifest(options) : generateCheatManifest(options);
console.log(`${check ? 'Checked' : 'Generated'} cheat manifest (${result.entries.length} cheats).`);
