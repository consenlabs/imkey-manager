<script setup lang="ts">
import copyIcon from '../../assets/device-pages/copy.svg'
defineProps<{
  SN: string
  bleOldVersionData: string
  cosOldVersionData: string
  isCosUpdate: boolean
  copyTooltipDisabled: boolean
  checkingUpdate?: boolean
  firmwareChecked?: boolean
  firmwareCheckFailed?: boolean
  identityChecking?: boolean
  initializing?: boolean
  autoChecking?: boolean
  upgrading?: boolean
  unavailable?: boolean
  confirmationStatus?: 'none' | 'pending' | 'unavailable'
  confirmationError?: boolean
}>()
const emit = defineEmits<{
  isShowalert: []
  copyText: []
  exportBindCode: []
  checkUpdate: []
  confirmFirmwareVersions: []
}>()
</script>

<template>
  <section class="device-page-info">
    <h2>{{ $t('m.devicePages.device') }}</h2>
    <p class="device-page-subtitle">{{ $t('m.devicePages.device_subtitle') }}</p>
    <h3>{{ $t('m.devicePages.device_information') }}</h3>
    <div class="equipmentBox device-info-card" data-testid="device-info-card">
      <div class="device-info-header">
        <span class="device-model">imKey Pro</span>
        <div
          class="firmware-status"
          :class="{ 'firmware-available': isCosUpdate && !firmwareCheckFailed }"
        >
          <span
            v-if="firmwareChecked && !initializing && !identityChecking && !unavailable"
            data-testid="firmware-check-result"
            :data-status="firmwareCheckFailed ? 'failed' : isCosUpdate ? 'available' : 'latest'"
            aria-live="polite"
            >{{
              $t(
                firmwareCheckFailed
                  ? 'm.devicePages.firmware_check_incomplete'
                  : isCosUpdate
                    ? 'm.devicePages.firmware_available'
                    : 'm.devicePages.firmware_latest'
              )
            }}</span
          >
          <button
            v-if="
              firmwareChecked &&
              isCosUpdate &&
              !checkingUpdate &&
              !initializing &&
              !unavailable &&
              !firmwareCheckFailed
            "
            type="button"
            data-testid="firmware-upgrade-button"
            :disabled="autoChecking || identityChecking || upgrading"
            :aria-busy="Boolean(upgrading)"
            @click="emit('isShowalert')"
          >
            <i v-if="upgrading" class="fas fa-circle-notch fa-spin" aria-hidden="true" />
            {{ $t(upgrading ? 'm.devicePages.upgrading' : 'm.devicePages.upgrade') }}
          </button>
          <button
            v-else
            type="button"
            data-testid="firmware-check-button"
            :disabled="
              checkingUpdate ||
              initializing ||
              autoChecking ||
              identityChecking ||
              upgrading ||
              unavailable
            "
            :aria-busy="Boolean(checkingUpdate)"
            @click="emit('checkUpdate')"
          >
            <i
              v-if="checkingUpdate && !autoChecking"
              class="fas fa-circle-notch fa-spin"
              aria-hidden="true"
            />
            {{
              $t(
                checkingUpdate && !autoChecking
                  ? 'm.devicePages.checking_firmware'
                  : 'm.devicePages.check_updates'
              )
            }}
          </button>
        </div>
      </div>
      <div class="device-info-fields">
        <dl class="device-info-primary">
          <div class="serial-number-row">
            <dt>{{ $t('m.devicePages.serial_number') }}</dt>
            <dd>
              <span>{{ initializing || unavailable ? '—' : SN || '—' }}</span>
              <el-tooltip
                trigger="manual"
                :visible="copyTooltipDisabled"
                :content="$t('m.imKeyManager.copy_success')"
                placement="top"
              >
                <button
                  class="copy-sn el-icon-copy-document"
                  type="button"
                  :aria-label="$t('m.devicePages.copy_serial_number')"
                  :disabled="
                    !SN ||
                    initializing ||
                    autoChecking ||
                    identityChecking ||
                    upgrading ||
                    unavailable
                  "
                  @click="emit('copyText')"
                >
                  <img :src="copyIcon" alt="" />
                </button>
              </el-tooltip>
            </dd>
          </div>
          <div>
            <dt>{{ $t('m.devicePages.firmware_version') }}</dt>
            <dd>{{ initializing || unavailable ? '—' : cosOldVersionData || '—' }}</dd>
          </div>
        </dl>
        <dl class="device-info-secondary">
          <div>
            <dt>{{ $t('m.devicePages.binding_code') }}</dt>
            <dd>
              <button
                class="exportBindCode"
                type="button"
                :disabled="
                  initializing || autoChecking || identityChecking || upgrading || unavailable
                "
                @click="emit('exportBindCode')"
              >
                {{ $t('m.devicePages.export_binding_code') }}
              </button>
            </dd>
          </div>
          <div>
            <dt>{{ $t('m.devicePages.bluetooth_version') }}</dt>
            <dd>{{ initializing || unavailable ? '—' : bleOldVersionData || '—' }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <div
      v-if="confirmationStatus === 'pending' || confirmationStatus === 'unavailable'"
      class="firmware-confirmation"
      data-testid="firmware-confirmation"
      role="status"
    >
      <p v-if="confirmationStatus === 'unavailable'">
        {{ $t('m.devicePages.firmware_confirmation_unavailable') }}
      </p>
      <template v-else>
        <p>{{ $t('m.devicePages.firmware_confirmation_pending') }}</p>
        <p v-if="confirmationError" class="confirmation-error">
          {{ $t('m.devicePages.firmware_confirmation_save_failed') }}
        </p>
        <button
          type="button"
          data-testid="firmware-confirmation-button"
          :disabled="
            initializing ||
            autoChecking ||
            identityChecking ||
            upgrading ||
            unavailable ||
            !cosOldVersionData ||
            !bleOldVersionData
          "
          @click="emit('confirmFirmwareVersions')"
        >
          {{ $t('m.devicePages.firmware_confirmation_acknowledge') }}
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.device-page-info {
  width: 800px;
  max-width: 100%;
  padding-top: 56px;
}
.device-page-info h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  color: #111;
}
.device-page-subtitle {
  margin: 6px 0 0;
  font-size: 16px;
  line-height: 25px;
  color: #8189a7;
}
.device-page-info h3 {
  margin: 50px 0 20px;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  color: #111;
}
.device-page-info .device-info-card {
  box-sizing: border-box;
  width: 800px;
  max-width: 100%;
  min-height: 158px;
  height: auto;
  margin: 0;
  padding: 23px 47px 25px;
  border: 1.5px solid #f1f2fa;
}
.device-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.device-model {
  font-size: 15px;
  font-weight: 500;
  line-height: 32px;
  color: #111;
}
.firmware-status {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 13px;
  line-height: 22px;
  color: #111;
}
.firmware-status.firmware-available {
  color: #b8ac95;
}
.firmware-confirmation {
  margin-top: 16px;
  padding: 16px 20px;
  border: 1px solid #ece4d3;
  border-radius: 8px;
  color: #695d46;
  background: #fcfaf5;
  font-size: 13px;
  line-height: 21px;
}
.firmware-confirmation p {
  margin: 0 0 10px;
}
.firmware-confirmation p:last-child {
  margin-bottom: 0;
}
.firmware-confirmation .confirmation-error {
  color: #b0443f;
}
.firmware-confirmation button {
  border: 1px solid #695d46;
  border-radius: 16px;
  padding: 5px 14px;
  color: #695d46;
  background: transparent;
  font: inherit;
  cursor: pointer;
}
.firmware-status button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 114px;
  height: 32px;
  padding: 0 15px;
  border: 1px solid #111;
  border-radius: 20px;
  background: #2e3035;
  color: #fff;
  font: inherit;
  cursor: pointer;
}
.firmware-available button {
  min-width: 62px;
}
.firmware-status button:hover:not(:disabled) {
  background: #45474c;
}
.device-info-fields {
  display: grid;
  grid-template-columns: 345px 1fr;
  margin-top: 20px;
  color: #7f7f7f;
  font-size: 13px;
  line-height: 21px;
}
.device-info-fields dl {
  display: grid;
  gap: 11px;
  margin: 0;
}
.device-info-fields dl > div {
  display: grid;
  align-items: center;
}
.device-info-fields dt,
.device-info-fields dd {
  margin: 0;
  min-width: 0;
}
.device-info-fields dd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.device-info-primary {
  border-right: 1px solid #e0e3ec;
}
.device-info-primary > div {
  grid-template-columns: 154px 1fr;
}
.device-info-secondary {
  padding-left: 88px;
}
.device-info-secondary > div {
  grid-template-columns: 120px 1fr;
}
.copy-sn,
.exportBindCode {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7f7f7f;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
}
.copy-sn {
  display: inline-flex;
  align-items: center;
  opacity: 0;
}
.serial-number-row:hover .copy-sn,
.copy-sn:focus-visible {
  opacity: 1;
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
button:focus-visible {
  outline: 2px solid #8189a7;
  outline-offset: 3px;
}
</style>
