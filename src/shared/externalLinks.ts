const english = {
  imkey: 'https://imkey.im/',
  imtoken: 'https://token.im/?locale=en-us',
  tokenlon: 'https://tokenlon.im/?locale=en-us',
  rabby: 'https://rabby.io/',
  quick_start:
    'https://support.imkey.im/hc/en-001/articles/36695000144537-How-to-Activate-your-imKey',
  support: 'https://support.imkey.im/hc/en-001',
  verification: 'https://support.imkey.im/hc/en-001/articles/63627811168793'
} as const

const chinese = {
  imkey: 'https://imkey.im/zh-hans',
  imtoken: 'https://token.im/?locale=zh-cn',
  tokenlon: 'https://tokenlon.im/?locale=zh-cn',
  rabby: 'https://rabby.io/',
  quick_start:
    'https://support.imkey.im/hc/zh-cn/articles/36695000144537-%E5%A6%82%E4%BD%95%E6%BF%80%E6%B4%BB-imKey',
  support: 'https://support.imkey.im/hc/zh-cn',
  verification: 'https://support.imkey.im/hc/zh-cn/articles/63627811168793'
} as const

export function getExternalLinks(locale: string) {
  return locale.toLowerCase() === 'zh-cn' ? chinese : english
}
