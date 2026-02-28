#!/usr/bin/env node
import { build } from 'esbuild';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(__dirname, 'src/index.ts')],
  bundle: true,
  format: 'esm',
  outfile: join(__dirname, 'dist/index.mjs'),
  external: ['react'],
  platform: 'browser',
  target: 'es2020',
});
