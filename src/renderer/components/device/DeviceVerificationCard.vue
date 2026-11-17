<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import deviceIllustration from '../../assets/device-pages/device-illustration.svg'
import magnifierHandle from '../../assets/device-pages/magnifier-handle.svg'
import magnifierCircle from '../../assets/device-pages/magnifier-circle.svg'
import deviceSearch from '../../assets/device-pages/device-search.svg'
import passedHome from '../../assets/device-pages/passed-home.svg'
import passedDevice from '../../assets/device-pages/passed-device.svg'

const props = defineProps<{
  variant: 'home' | 'device'
  status: 'idle' | 'checking' | 'success'
  activationStatus: boolean | null
  activatedAt: string | null
  disabled?: boolean
}>()
const emit = defineEmits<{ verify: []; details: [] }>()
const verified = computed(() => props.status === 'success')
const busy = computed(() => props.status === 'checking')
const { t } = useI18n()
async function openVerificationInfo() {
  try {
    await window.imkey.app.openExternal(t('m.links.verification'))
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : String(error))
  }
}
</script>

<template>
  <section
    class="device-verification-section"
    :class="`verification-${variant}`"
    data-testid="device-verification-card"
    :data-status="status"
    :aria-busy="busy"
  >
    <h3>{{ $t('m.devicePages.verification') }}</h3>
    <div class="verification-panel" :class="{ 'home-verified': variant === 'home' && verified }">
      <template v-if="variant === 'home' && !verified">
        <div class="device-illustration" aria-hidden="true">
          <img class="device-image" :src="deviceIllustration" alt="" />
          <img class="magnifier-handle" :src="magnifierHandle" alt="" />
          <img class="magnifier-circle" :src="magnifierCircle" alt="" />
          <img class="device-search" :src="deviceSearch" alt="" />
        </div>
        <div class="verification-introduction" data-testid="secure-check-result" aria-live="polite">
          <p>{{ $t('m.devicePages.verify_your_device') }}</p>
          <p>{{ $t('m.devicePages.verification_suggestion') }}</p>
        </div>
      </template>
      <dl v-else class="verification-result" data-testid="secure-check-result" aria-live="polite">
        <div class="authenticity-row">
          <dt>{{ $t('m.devicePages.authenticity') }}</dt>
          <dd :class="{ 'verification-passed': verified }">
            <img v-if="verified" :src="variant === 'home' ? passedHome : passedDevice" alt="" />
            {{ $t(verified ? 'm.devicePages.passed' : 'm.devicePages.not_verified') }}
          </dd>
        </div>
        <div class="activation-row">
          <dt>{{ $t('m.devicePages.activation_status') }}</dt>
          <dd :class="{ 'activation-value': verified && activationStatus !== null }">
            {{
              verified && activationStatus !== null
                ? $t(activationStatus ? 'm.devicePages.activated' : 'm.devicePages.not_activated')
                : '—'
            }}
          </dd>
        </div>
        <div class="activation-date-row">
          <dt>
            {{
              $t(
                variant === 'home'
                  ? 'm.devicePages.activation_time'
                  : 'm.devicePages.first_activation_time'
              )
            }}
          </dt>
          <dd>{{ verified ? activatedAt || '—' : '—' }}</dd>
        </div>
        <button
          v-if="variant === 'home'"
          type="button"
          class="device-details-link"
          data-testid="device-details-link"
          @click="emit('details')"
        >
          {{ $t('m.devicePages.more_device_information') }} <span aria-hidden="true">&gt;</span>
        </button>
      </dl>
      <button
        type="button"
        class="verification-button"
        data-testid="secure-check-button"
        :disabled="busy || disabled"
        @click="emit('verify')"
      >
        <i v-if="busy" class="fas fa-circle-notch fa-spin" aria-hidden="true" />
        {{ $t(status === 'checking' ? 'm.devicePages.verifying' : 'm.devicePages.verify_device') }}
      </button>
      <div v-if="variant === 'device'" class="verification-footnote">
        <span>{{ $t('m.devicePages.verification_scope') }}</span>
        <button type="button" @click="openVerificationInfo">
          {{ $t('m.devicePages.learn_more') }} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.device-verification-section {
  width: 800px;
  max-width: 100%;
}
.device-verification-section h3 {
  margin: 0 0 20px;
  color: #111;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}
.verification-panel {
  position: relative;
  box-sizing: border-box;
  min-height: 158px;
  border: 1.5px solid #f1f2fa;
}
.verification-home .verification-panel {
  display: flex;
  align-items: center;
  padding: 28px 35px 28px 65px;
  gap: 64px;
}
.device-illustration {
  position: relative;
  flex: 0 0 117px;
  height: 70px;
}
.device-illustration img {
  position: absolute;
}
.device-image {
  left: 0;
  top: 0;
  opacity: 0.4;
}
.magnifier-handle {
  left: 96px;
  top: 43px;
  transform: rotate(-90deg);
  opacity: 0.4;
}
.magnifier-circle {
  left: 86px;
  top: 36px;
}
.device-search {
  left: 86px;
  top: 37px;
}
.verification-introduction {
  padding-right: 130px;
}
.verification-introduction p {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 25px;
}
.verification-introduction p + p {
  margin-top: 19px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #7f7f7f;
}
.verification-button {
  position: absolute;
  right: 35px;
  top: 62px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 114px;
  height: 32px;
  padding: 0 16px;
  border: 1px solid #2e3035;
  border-radius: 20px;
  background: #2e3035;
  color: #fff;
  font: inherit;
  font-size: 13px;
  line-height: 22px;
  cursor: pointer;
}
.verification-button:hover:not(:disabled) {
  background: #45474c;
}
.verification-button:disabled {
  cursor: default;
  opacity: 0.6;
}
.verification-button:focus-visible,
.device-details-link:focus-visible,
.verification-footnote button:focus-visible {
  outline: 2px solid #8189a7;
  outline-offset: 3px;
}
.verification-home .home-verified {
  display: block;
  padding: 27px 35px;
}
.verification-result {
  margin: 0;
}
.verification-result > div {
  display: flex;
  align-items: center;
  min-width: 0;
}
.verification-result dt {
  flex-shrink: 0;
}
.verification-result dd {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #7f7f7f;
}
.verification-result .verification-passed {
  color: #04ae63;
}
.verification-result .activation-value {
  color: #b8ac95;
}
.verification-home .verification-result {
  display: grid;
  grid-template-columns: 262px 1fr;
  column-gap: 28px;
  row-gap: 48px;
  font-size: 15px;
  line-height: 25px;
  padding-right: 130px;
}
.verification-home .verification-result dt {
  width: 95px;
}
.verification-home .activation-row dt {
  width: auto;
  min-width: 95px;
  white-space: nowrap;
}
.verification-home .activation-row {
  gap: 12px;
}
.verification-home .activation-date-row {
  grid-column: 1;
  gap: 4px;
  font-size: 15px;
  line-height: 25px;
  white-space: nowrap;
  color: #7f7f7f;
}
.verification-home .activation-date-row dt {
  width: auto;
}
.verification-home .device-details-link {
  justify-self: start;
  align-self: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #8189a7;
  font: inherit;
  font-size: 15px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
}

.verification-device {
  margin-top: 66px;
}
.verification-device .verification-panel {
  padding: 27px 47px 29px;
}
.verification-device .verification-result {
  display: grid;
  gap: 11px;
  font-size: 13px;
  line-height: 21px;
}
.verification-device .verification-result dt {
  flex-basis: 160px;
  color: #7f7f7f;
}
.verification-device .verification-result dd {
  gap: 6px;
}
.verification-device .verification-button {
  top: 23px;
  right: 45px;
  min-width: 114px;
}
.verification-device .verification-button:hover:not(:disabled) {
  background: #45474c;
}
.verification-footnote {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 16px;
  margin-top: 17px;
  padding-top: 16px;
  border-top: 1px solid #e0e3ec;
  color: #7f7f7f;
  font-size: 13px;
  line-height: 21px;
}
.verification-footnote button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7f7f7f;
  font: inherit;
  cursor: pointer;
}
</style>
