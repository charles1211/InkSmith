import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import ts from 'typescript';

/**
 * Loads the TypeScript modules under `content/` into a plain Node script.
 *
 * The content files are data-only with no runtime dependencies, so transpiling
 * them with the TypeScript compiler that already ships as a devDependency is
 * enough — no extra loader or bundler is needed.
 */
const CONTENT_MODULES = [
  'types',
  'policies',
  'faqs',
  'services',
  'service-areas',
  'aftercare',
];

export async function loadContent() {
  const dir = mkdtempSync(join(tmpdir(), 'inksmith-content-'));

  try {
    for (const name of CONTENT_MODULES) {
      const source = readFileSync(join('content', `${name}.ts`), 'utf8');
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      });
      // Rewrite relative specifiers so the transpiled copies resolve each other.
      const rewritten = outputText.replace(
        /from ['"]\.\/([a-z-]+)['"]/g,
        (_match, mod) => `from './${mod}.mjs'`
      );
      writeFileSync(join(dir, `${name}.mjs`), rewritten);
    }

    const [faqs, services, areas, aftercare, policies] = await Promise.all([
      import(pathToFileURL(join(dir, 'faqs.mjs')).href),
      import(pathToFileURL(join(dir, 'services.mjs')).href),
      import(pathToFileURL(join(dir, 'service-areas.mjs')).href),
      import(pathToFileURL(join(dir, 'aftercare.mjs')).href),
      import(pathToFileURL(join(dir, 'policies.mjs')).href),
    ]);

    return { faqs, services, areas, aftercare, policies };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
