import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const root = process.cwd()
const sourceFiles = [
  join(root, 'src/app/PageClient.tsx'),
  join(root, 'src/app/LoadingScreen.tsx'),
]
const generatedDir = join(root, 'src/generated/safari-media')
const assetPattern = /['\"](\/(?:images|branding)\/[^'\"]+)['\"]/g
const mimeByExtension = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
}

const assets = new Set()
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(assetPattern)) assets.add(match[1])
}

rmSync(generatedDir, { recursive: true, force: true })
mkdirSync(generatedDir, { recursive: true })

const entries = []
for (const asset of [...assets].sort()) {
  const extension = extname(asset).toLowerCase()
  const mime = mimeByExtension[extension]
  if (!mime) continue
  const output = `${basename(asset, extension).replace(/[^a-zA-Z0-9]+/g, '-')}-${entries.length}.ts`
  const data = readFileSync(join(root, 'public', asset)).toString('base64')
  writeFileSync(join(generatedDir, output), `const source = 'data:${mime};base64,${data}'\n\nexport default source\n`)
  entries.push({ asset, output: output.slice(0, -3) })
}

const map = [
  ...entries.map(({ output }, index) => `import asset${index} from './${output}'`),
  '',
  'export const safariMediaSources: Record<string, string> = {',
  ...entries.map(({ asset }, index) => `  '${asset}': asset${index},`),
  '}',
  '',
].join('\n')
writeFileSync(join(generatedDir, 'index.ts'), map)
