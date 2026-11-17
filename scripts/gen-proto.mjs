import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const core = process.env.IMKEY_CORE_PATH || '/Users/xiaoguang/Developer/work/imkey-core'
const commit = '80ddae20a2ece117bd443803e9bc6d5de519e575'
const names = ['api', 'btc', 'device']
const require = createRequire(import.meta.url)
const plugin = require('protoc-gen-js')
const protoc = process.env.PROTOC || 'protoc'
const temporary = mkdtempSync(path.join(tmpdir(), 'imkey-proto-'))
const hashes = {}

try {
  for (const name of names) {
    const source = execFileSync('git', ['-C', core, 'show', `${commit}:proto/src/${name}.proto`])
    let contents = source.toString('utf8').trimEnd() + '\n'
    if (name === 'device') {
      const extension = readFileSync(path.join(root, 'src/proto/extensions/device-sn-check.proto'))
      contents += '\n' + extension.toString('utf8').trimEnd() + '\n'
      hashes.deviceSnCheckExtension = createHash('sha256').update(extension).digest('hex')
    }
    writeFileSync(path.join(temporary, `${name}.proto`), contents)
    hashes[name] = createHash('sha256').update(source).digest('hex')
  }
  execFileSync(
    protoc,
    [
      `--proto_path=${temporary}`,
      `--plugin=protoc-gen-js=${plugin}`,
      `--js_out=import_style=commonjs,binary:${temporary}`,
      ...names.map(name => `${name}.proto`)
    ],
    { stdio: 'inherit' }
  )

  for (const name of names) {
    const generatedPath = path.join(temporary, `${name}_pb.js`)
    const configuration = await prettier.resolveConfig(
      path.join(root, 'src/proto', `${name}_pb.js`)
    )
    const generated = await prettier.format(readFileSync(generatedPath, 'utf8'), {
      ...configuration,
      parser: 'babel',
      semi: false,
      singleQuote: true,
      tabWidth: 2
    })
    writeFileSync(generatedPath, generated)
    for (const filename of [`${name}.proto`, `${name}_pb.js`]) {
      const expected = readFileSync(path.join(temporary, filename))
      const destination = path.join(root, 'src/proto', filename)
      if (process.argv.includes('--check')) {
        if (!readFileSync(destination).equals(expected))
          throw new Error(`Generated proto differs: ${filename}`)
      } else {
        writeFileSync(destination, expected)
      }
    }
  }
  console.log(
    `Proto ${process.argv.includes('--check') ? 'verified' : 'generated'} from imkey-core ${commit}`
  )
  console.log(JSON.stringify(hashes, null, 2))
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
