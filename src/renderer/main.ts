import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './styles/recovery.css'
import App from './App.vue'
import router from './router'
import * as zh from './common/lang/zh'
import * as en from './common/lang/en'
const preventTouchScroll = (event: TouchEvent): void => event.preventDefault()
async function start(): Promise<void> {
  const systemLocale = await window.imkey.app.getLocale()
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus)
  app.use(
    createI18n({
      legacy: false,
      globalInjection: true,
      locale: systemLocale === 'zh-CN' ? 'zh-CN' : 'en-US',
      messages: { 'zh-CN': zh, 'en-US': en }
    })
  )
  app.config.globalProperties.noScroll = (): void => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', preventTouchScroll, { passive: false })
  }
  app.config.globalProperties.canScroll = (): void => {
    document.body.style.overflow = ''
    document.removeEventListener('touchmove', preventTouchScroll)
  }
  app.mount('#app')
}
void start()
