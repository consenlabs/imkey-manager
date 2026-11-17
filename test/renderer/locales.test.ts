import { it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createI18n } from 'vue-i18n'
import * as zh from '../../src/renderer/common/lang/zh'
import * as en from '../../src/renderer/common/lang/en'
it('renders every existing translation including literal email addresses', () => {
  for (const [locale, messages] of Object.entries({ 'zh-CN': zh, 'en-US': en })) {
    const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
    for (const [section, entries] of Object.entries(messages.m)) {
      for (const key of Object.keys(entries))
        expect(() => i18n.global.t(`m.${section}.${key}`)).not.toThrow()
    }
    expect(i18n.global.t('m.imKeyManager.email')).toContain('@')
  }
})

it('resolves the translation keys referenced by the current renderer in both languages', () => {
  const renderer = fileURLToPath(new URL('../../src/renderer/', import.meta.url))
  const sources = readdirSync(renderer, { recursive: true })
    .filter((file): file is string => typeof file === 'string')
    .filter(
      file => /\.(?:ts|vue)$/.test(file) && !file.startsWith(`common${path.sep}lang${path.sep}`)
    )
  for (const [locale, messages] of Object.entries({ 'zh-CN': zh, 'en-US': en })) {
    const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
    for (const file of sources) {
      const source = readFileSync(path.join(renderer, file), 'utf8')
      for (const [, key] of source.matchAll(/['"`](m\.\w+\.\w+)['"`]/g))
        expect(i18n.global.te(key), `${locale}: ${file} references missing ${key}`).toBe(true)
    }
  }
})
