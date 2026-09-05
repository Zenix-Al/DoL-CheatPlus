const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = path.join(__dirname, '..', 'example');
// Project-local build assets (header + version) live in the build folder
const BUILD_DIR = path.join(__dirname);
const VERSION_FILE = path.join(BUILD_DIR, 'version.json');
const HEADER_TEMPLATE_PATH = path.join(BUILD_DIR, 'header.txt');

const BUILD_TARGETS = [
  {
    label: 'Build',
    scriptName: 'DoL Cheat Plus',
    minify: false,
    tmpOutfile: 'dist/userscript.js',
    finalOutfile: 'dist/DoL-Companion-Panel.user.js',
  },
  {
    label: 'Uglify Build',
    scriptName: 'DoL Cheat Plus (Uglified)',
    minify: true,
    tmpOutfile: 'dist/uglified.js',
    finalOutfile: 'dist/DoL-Companion-Panel.uglified.user.js',
  },
];

function readVersion() {
  let currentVersion = { major: 0, minor: 0, patch: 0 };
  if (!fs.existsSync(VERSION_FILE)) return currentVersion;

  try {
    currentVersion = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
  } catch {
    console.warn('version.json corrupted, resetting...');
  }
  return currentVersion;
}

function getBumpType(args) {
  if (args.includes('--major')) return 'major';
  if (args.includes('--minor')) return 'minor';
  return 'patch';
}

function bumpVersion(currentVersion, bumpType) {
  if (bumpType === 'major') {
    return { major: currentVersion.major + 1, minor: 0, patch: 0 };
  }
  if (bumpType === 'minor') {
    return { major: currentVersion.major, minor: currentVersion.minor + 1, patch: 0 };
  }
  return { ...currentVersion, patch: currentVersion.patch + 1 };
}

function getPlugins(isRelease) {
  const plugins = [];
  const stripCssPath = path.join(EXAMPLE_DIR, 'build', 'stripCssComments.js');
  const stripDebugPath = path.join(EXAMPLE_DIR, 'stripDebugLogs.js');
  if (fs.existsSync(stripCssPath)) {
    const { stripCssComments } = require(stripCssPath);
    plugins.push(stripCssComments);
  }
  if (isRelease && fs.existsSync(stripDebugPath)) {
    const { stripDebugLogs } = require(stripDebugPath);
    plugins.push(stripDebugLogs);
  }
  return plugins;
}

function getBuildDefines() {
  return {
    __DOL_DEBUG__: 'true',
  };
}

function readHeaderTemplate() {
  if (!fs.existsSync(HEADER_TEMPLATE_PATH)) {
    throw new Error(`Missing header template: ${HEADER_TEMPLATE_PATH}`);
  }
  return fs.readFileSync(HEADER_TEMPLATE_PATH, 'utf8');
}

function getBuildInfo(target, isRelease) {
  const buildMode = isRelease ? 'release' : 'regular';
  const artifactType = target.minify ? 'uglified' : 'regular';
  const logStatus = isRelease
    ? 'debugLog call sites stripped where possible'
    : 'debugLog call sites retained';

  return [
    `// Build mode: ${buildMode}`,
    `// Artifact: ${artifactType}`,
    `// Logs: ${logStatus}`,
  ].join('\n');
}

function renderHeader(template, { name, version, banner, buildInfo }) {
  return template
    .replaceAll('{{NAME}}', name)
    .replaceAll('{{VERSION}}', version)
    .replaceAll('{{BANNER}}', banner)
    .replaceAll('{{BUILD_INFO}}', buildInfo);
}

async function buildTarget(target, baseOptions, headerTemplate, version, banner, isRelease) {
  await esbuild.build({
    ...baseOptions,
    minify: target.minify,
    outfile: target.tmpOutfile,
  });

  const builtCode = fs.readFileSync(target.tmpOutfile, 'utf8');
  const buildInfo = getBuildInfo(target, isRelease);
  const header = renderHeader(headerTemplate, {
    name: target.scriptName,
    version,
    banner,
    buildInfo,
  });

  fs.writeFileSync(target.finalOutfile, header + builtCode);
  console.log(`${target.label} complete! Version: ${version}`);
  console.log(`Output: ${target.finalOutfile}`);
}

async function main() {
  const args = process.argv.slice(2);
  const bumpType = getBumpType(args);
  const isRelease = args.includes('--release');

  const currentVersion = readVersion();
  const nextVersion = bumpVersion(currentVersion, bumpType);
  const versionString = `${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;

  console.log(
    `Bumping version: ${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch} -> ${versionString} (${bumpType})`
  );
  if (isRelease) {
    console.log('Release mode: stripping debugLog(...) and disabling debug logging.');
  }

  fs.writeFileSync(VERSION_FILE, JSON.stringify(nextVersion, null, 2));

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const banner = `// Built on ${now} -- AUTO-GENERATED, edit from /src and rebuild`;
  const headerTemplate = readHeaderTemplate();

  const baseBuildOptions = {
    entryPoints: ['src/main.js'],
    bundle: true,
    format: 'iife',
    legalComments: 'none',
    loader: {
      '.html': 'text',
      '.css': 'text',
    },
    define: getBuildDefines(),
    plugins: getPlugins(isRelease),
  };

  // ensure dist exists
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');

  await Promise.all(
    BUILD_TARGETS.map((target) =>
      buildTarget(target, baseBuildOptions, headerTemplate, versionString, banner, isRelease)
    )
  );
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
