import { it, expect } from 'vitest'
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
