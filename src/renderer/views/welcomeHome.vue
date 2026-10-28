<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useSecureCheck } from '../composables/useSecureCheck'
import DeviceVerificationCard from '../components/device/DeviceVerificationCard.vue'
import imkeyMark from '../assets/device-pages/imkey-mark.svg'
import imtokenMark from '../assets/device-pages/imtoken-mark.svg'
import tokenlonMark from '../assets/device-pages/tokenlon-mark.svg'
import rabbyMark from '../assets/device-pages/rabby-mark.svg'
import externalImkey from '../assets/device-pages/external-imkey.svg'
import externalImtoken from '../assets/device-pages/external-imtoken.svg'
import externalTokenlon from '../assets/device-pages/external-tokenlon.svg'
import externalRabby from '../assets/device-pages/external-rabby.svg'
import bookIcon from '../assets/device-pages/book.svg'
import supportIcon from '../assets/device-pages/support.svg'
import copyIcon from '../assets/device-pages/copy.svg'

const secureCheck = useSecureCheck()
const router = useRouter()
const { t } = useI18n()
const shortcuts = [
  {
    name: 'imKey',
    description: 'imkey_description',
    image: imkeyMark,
    external: externalImkey,
    urlKey: 'm.links.imkey'
  },
  {
    name: 'imToken',
    description: 'imtoken_description',
    image: imtokenMark,
    external: externalImtoken,
    urlKey: 'm.links.imtoken'
  },
  {
    name: 'Tokenlon',
    description: 'tokenlon_description',
    image: tokenlonMark,
    external: externalTokenlon,
    urlKey: 'm.links.tokenlon'
  },
  {
    name: 'Rabby Wallet',
    description: 'rabby_description',
    image: rabbyMark,
    external: externalRabby,
    urlKey: 'm.links.rabby'
  }
]
async function openUrl(url: string) {
  try {
    await window.imkey.app.openExternal(url)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : String(error))
  }
}
async function copySupportEmail() {
  try {
    await window.imkey.app.copyText('support@imkey.im')
    ElMessage.success(t('m.imKeyManager.copy_success'))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : String(error))
  }
}
</script>

<template>
  <main class="manager-home">
    <h2>{{ $t('m.devicePages.welcome') }}</h2>
    <p class="home-subtitle">{{ $t('m.devicePages.home_subtitle') }}</p>
    <DeviceVerificationCard
      class="home-verification"
      variant="home"
      :status="secureCheck.state.status"
      :activation-status="secureCheck.state.activationStatus"
      :activated-at="secureCheck.state.activatedAt"
      @verify="secureCheck.check"
      @details="router.push('/home/setting')"
    />
    <section class="quick-access">
      <h3>{{ $t('m.devicePages.quick_access') }}</h3>
      <div class="shortcut-grid">
        <button
          v-for="shortcut in shortcuts"
          :key="shortcut.name"
          type="button"
          class="shortcut-card link6"
          :title="shortcut.name"
          @click="openUrl($t(shortcut.urlKey))"
        >
          <span class="shortcut-icon"><img :src="shortcut.image" alt="" /></span>
          <span class="shortcut-copy"
            ><span class="shortcut-title">{{ shortcut.name }}</span
            ><span class="shortcut-description">{{
              $t(`m.devicePages.${shortcut.description}`)
            }}</span></span
          >
          <img class="shortcut-external" :src="shortcut.external" alt="" />
        </button>
      </div>
    </section>
    <section class="help-support">
      <h3>{{ $t('m.devicePages.help_support') }}</h3>
      <div class="help-grid">
        <button type="button" class="help-card" @click="openUrl($t('m.links.quick_start'))">
          <span class="help-icon"><img :src="bookIcon" alt="" /></span>
          <span class="help-copy"
            ><span class="help-title">{{ $t('m.devicePages.quick_start') }}</span
            ><span class="help-description">{{
              $t('m.devicePages.quick_start_description')
            }}</span></span
          >
          <span class="help-arrow" aria-hidden="true">→</span>
        </button>
        <div class="help-card support-card">
          <span class="help-icon"><img :src="supportIcon" alt="" /></span>
          <div class="help-copy">
            <span class="help-title">{{ $t('m.devicePages.contact_support') }}</span
            ><span class="help-description support-email"
              >support@imkey.im
              <button
                type="button"
                :aria-label="$t('m.devicePages.copy_support_email')"
                @click="copySupportEmail"
              >
                <img :src="copyIcon" alt="" /></button
            ></span>
          </div>
          <button
            type="button"
            class="help-arrow support-link"
            :aria-label="$t('m.devicePages.contact_support')"
            @click="openUrl($t('m.links.support'))"
          >
            →
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.manager-home {
  box-sizing: border-box;
  padding: 56px 38px 60px;
  color: #111;
}
.manager-home h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
}
.home-subtitle {
  margin: 6px 0 0;
  font-size: 16px;
  line-height: 25px;
  color: #8189a7;
}
.home-verification {
  margin-top: 50px;
}
.manager-home h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}
.quick-access,
.help-support {
  width: 820px;
  max-width: 100%;
}
.quick-access {
  margin-top: 66px;
}
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  margin-top: 25px;
}
.shortcut-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 81px;
  padding: 14px 10px 14px 16px;
  border: 0;
  border-radius: 4px;
  background: #fafafa;
  color: #111;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.shortcut-card:disabled {
  cursor: default;
}
.shortcut-card:hover:not(:disabled),
.help-card:hover:not(:disabled) {
  background: #f1f1f1;
}
.shortcut-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
}
.shortcut-copy,
.help-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.shortcut-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
}
.shortcut-description {
  margin-top: 2px;
  color: #7f7f7f;
  font-size: 13px;
  font-weight: 300;
  line-height: 21px;
}
.shortcut-external {
  position: absolute;
  top: 22px;
  right: 10px;
}
.help-support {
  margin-top: 54px;
}
.help-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
  margin-top: 22px;
}
.help-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  min-height: 65px;
  padding: 9px 43px 9px 24px;
  border: 0;
  border-radius: 4px;
  background: #fafafa;
  color: #111;
  font: inherit;
  text-align: left;
}
.help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
}
.help-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 23px;
}
.help-description {
  color: #7f7f7f;
  font-size: 13px;
  font-weight: 300;
  line-height: 21px;
}
.help-arrow {
  position: absolute;
  right: 16px;
  top: 21px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #111;
  font: inherit;
  font-size: 15px;
  line-height: 23px;
}
.support-email {
  display: flex;
  align-items: center;
  gap: 6px;
}
.support-card {
  cursor: pointer;
}
.support-link {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border-radius: inherit;
}
.support-email button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
button:focus-visible {
  outline: 2px solid #8189a7;
  outline-offset: 3px;
}
</style>
