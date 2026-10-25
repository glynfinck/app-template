// Builds and uploads the app to a store with EAS, but only if that platform is switched on in
// release-targets.json. Usage: npm run release:ios | npm run release:android
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const platform = process.argv[2];
const stores = { ios: 'App Store', android: 'Google Play' };

if (!(platform in stores)) {
  console.error('Usage: node scripts/release.mjs <ios|android>');
  process.exit(2);
}

const targets = JSON.parse(readFileSync(join(root, 'release-targets.json'), 'utf8'));
if (targets[platform] !== true) {
  console.error(
    `${stores[platform]} releases are switched off. Set "${platform}": true in release-targets.json ` +
      `once the ${stores[platform]} account and EAS project are set up.`,
  );
  process.exit(1);
}

const clientDir = join(root, 'apps', 'client');
if (!existsSync(join(clientDir, 'eas.json'))) {
  console.error('apps/client/eas.json is missing. Run `npx eas-cli@latest build:configure` in apps/client first.');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['eas-cli@latest', 'build', '--platform', platform, '--profile', 'production', '--auto-submit'],
  { cwd: clientDir, stdio: 'inherit', shell: process.platform === 'win32' },
);
process.exit(result.status ?? 1);
