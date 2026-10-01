import { existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parseManifest } from '@celsian/vura-contract';

const CONTRACT_TIMESTAMP = '2026-01-01T00:00:00.000Z';

export function validateVuraStaticSynthesis({ distRoot = 'dist', expectedPages }) {
  if (existsSync(join(distRoot, 'manifest.json'))) {
    throw new Error('dist/manifest.json must be omitted for this static starter; Vura synthesizes the canonical manifest from the built HTML files during CLI artifact ingest.');
  }

  assertPartialManifestFails();

  const pages = walkFiles(distRoot)
    .map((file) => relative(distRoot, file).split(sep).join('/'))
    .filter(isHtml)
    .filter((filePath) => filePath.toLowerCase() !== '404.html')
    .map((filePath) => ({
      filePath,
      urlPattern: htmlPathToUrlPattern(filePath),
      mode: 'static',
      hasGetServerData: false,
      hasLoader: false,
      config: { staticKey: filePath },
    }))
    .sort((a, b) => a.urlPattern.localeCompare(b.urlPattern));

  const manifest = parseManifest({
    api: [],
    pages,
    layouts: [],
    timestamp: CONTRACT_TIMESTAMP,
  }, { allowLegacy: true });

  const routeSet = new Set(manifest.pages.map((page) => page.urlPattern));
  for (const route of expectedPages) {
    if (!routeSet.has(route)) {
      throw new Error(`canonical static manifest missing ${route}`);
    }
  }

  if (manifest.pages.length !== expectedPages.length) {
    throw new Error(`canonical static manifest would have ${manifest.pages.length} pages; expected ${expectedPages.length}`);
  }

  return manifest.pages.length;
}

function assertPartialManifestFails() {
  try {
    parseManifest({
      api: [],
      pages: [{ urlPattern: '/', mode: 'static', config: { tags: ['finch-content'] } }],
    }, { allowLegacy: true });
  } catch (error) {
    const issues = error?.issues ?? [];
    const paths = issues.map((issue) => issue.path).join(',');
    if (paths.includes('timestamp') && paths.includes('pages[0].filePath')) return;
    throw new Error(`partial manifest failed for unexpected reasons: ${paths || error.message}`);
  }
  throw new Error('partial static manifest unexpectedly passed Vura contract validation');
}

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function isHtml(filePath) {
  return /\.html?$/i.test(filePath);
}

function htmlPathToUrlPattern(filePath) {
  const lower = filePath.toLowerCase();
  if (lower === 'index.html' || lower === 'index.htm') return '/';
  if (lower.endsWith('/index.html')) return `/${filePath.slice(0, -'/index.html'.length)}`;
  if (lower.endsWith('/index.htm')) return `/${filePath.slice(0, -'/index.htm'.length)}`;
  return `/${filePath.replace(/\.html?$/i, '')}`;
}
