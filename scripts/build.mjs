import { mkdir, rm, cp, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import * as esbuild from 'esbuild'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const assetsDir = path.join(distDir, 'assets')

await rm(distDir, { recursive: true, force: true })
await mkdir(assetsDir, { recursive: true })

if (existsSync(path.join(root, 'public'))) {
  await cp(path.join(root, 'public'), distDir, { recursive: true })
}

const result = await esbuild.build({
  entryPoints: [path.join(root, 'src/main.jsx')],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.png': 'file',
    '.svg': 'file',
  },
  assetNames: 'assets/[name]-[hash]',
  entryNames: 'assets/index',
  chunkNames: 'assets/[name]-[hash]',
  outdir: distDir,
  splitting: true,
  sourcemap: false,
  minify: true,
  define: {
    'import.meta.env': JSON.stringify({
      BASE_URL: '/',
      DEV: false,
      MODE: 'production',
      PROD: true,
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://example.invalid',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'missing-anon-key',
    }),
  },
  metafile: true,
  logLevel: 'info',
})

const outputs = Object.keys(result.metafile.outputs)
const cssOutput = outputs.find(output => output.endsWith('.css'))

let html = await readFile(path.join(root, 'index.html'), 'utf8')
html = html.replace(
  /<script type="module" src="\/src\/main\.jsx"><\/script>/,
  `${cssOutput ? `    <link rel="stylesheet" href="/${cssOutput.replace(/^dist\//, '')}" />\n` : ''}    <script type="module" src="/assets/index.js"></script>`,
)

await writeFile(path.join(distDir, 'index.html'), html)
