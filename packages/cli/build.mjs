import { build } from 'esbuild';

await build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  format: 'cjs',
  target: 'node20',
  platform: 'node',
  logLevel: 'info',
  external: ['@aws-sdk/*'],
  sourcemap: true,
  minify: false,
});
