<script setup lang="ts">
import ErrorDetail from '../components/ErrorDetail.vue'
import { toRef, toRefs } from 'vue'
import DeviceInfo from '../components/settings/DeviceInfo.vue'
import DeviceVerificationCard from '../components/device/DeviceVerificationCard.vue'
import SettingsDialogs from '../components/settings/SettingsDialogs.vue'
import UpdateStatus from '../components/settings/UpdateStatus.vue'
import { useSettings } from '../composables/useSettings'
import { useSoftwareUpdate } from '../composables/useSoftwareUpdate'
const settings = useSettings()
const { status, SN, copyTooltipDisabled, checkingUpdate, initializing } = toRefs(settings.state)
const verification = settings.secureCheck
const {
  supportCode,
  busy,
  phase,
  errorInfo,
  errorStage,
  bindCode,
  bleOldVersionData,
  cosOldVersionData,
  isCosUpdate
} = toRefs(settings.firmware.state)
const updater = useSoftwareUpdate(toRef(settings.state, 'status'))
const { progress, softOldVersionData, softNewVersionData, softUpdateInfo } = toRefs(updater.state)
const { copyText, exportBindCode } = settings
const { changeCode, isShowalert, updateFirmware } = settings.firmware
const { later, updateNow, updateNowTip, checkSoftUpdate } = updater
defineExpose({ checkSoftUpdate })
</script>
<template>
  <div v-if="status == 1 || status == 6" class="container device-page" data-testid="device-page">
    <DeviceInfo
      :SN="SN"
      :ble-old-version-data="bleOldVersionData"
      :cos-old-version-data="cosOldVersionData"
      :is-cos-update="isCosUpdate"
      :firmware-check-failed="settings.firmware.state.cosUpdateStatus === '2'"
      :copy-tooltip-disabled="copyTooltipDisabled"
      :checking-update="checkingUpdate"
      :firmware-checked="settings.state.firmwareChecked"
      :initializing="initializing"
      :upgrading="busy"
      :identity-checking="verification.state.identityChecking"
      @is-showalert="!busy && isShowalert()"
      @copy-text="copyText"
      @export-bind-code="!busy && exportBindCode()"
      @check-update="!busy && settings.checkUpdate()"
    />
    <DeviceVerificationCard
      variant="device"
      :status="verification.state.identityChecking ? 'idle' : verification.state.status"
      :activation-status="verification.state.activationStatus"
      :activated-at="verification.state.activatedAt"
      :disabled="initializing || verification.state.identityChecking || busy"
      @verify="!busy && verification.check()"
    />
    <ErrorDetail
      :message="settings.state.errorInfo || updater.state.errorInfo"
      :stage="settings.state.errorInfo ? settings.state.errorStage : updater.state.errorStage"
    />
    <SettingsDialogs
      :support-code="supportCode"
      :phase="phase"
      :error-info="errorInfo"
      :error-stage="errorStage"
      :bind-code="bindCode"
      @change-code="changeCode"
      @update-firmware="updateFirmware"
    />
    <div class="tip6" v-if="supportCode != 6 && status == 6">
      <p>{{ $t('m.imKeyManager.found_imKey_manager_new_version') }}</p>
      <button :disabled="busy" @click="!busy && updateNowTip()">
        {{ $t('m.imKeyManager.update') }}
      </button>
    </div>
  </div>
  <UpdateStatus
    v-else
    :status="status"
    :error-info="updater.state.errorInfo || settings.state.errorInfo"
    :error-stage="updater.state.errorInfo ? updater.state.errorStage : settings.state.errorStage"
    @retry="updater.state.errorInfo ? updater.retry() : settings.init()"
    :progress="progress"
    :soft-old-version-data="softOldVersionData"
    :soft-new-version-data="softNewVersionData"
    :soft-update-info="softUpdateInfo"
    @later="later"
    @update-now="updateNow"
  />
</template>
<style src="../styles/setting.css"></style>
