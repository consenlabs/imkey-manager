<script setup lang="ts">
import ErrorDetail from '../components/ErrorDetail.vue'
import { toRef, toRefs } from 'vue'
import DeviceInfo from '../components/settings/DeviceInfo.vue'
import SettingsLinks from '../components/settings/SettingsLinks.vue'
import SettingsDialogs from '../components/settings/SettingsDialogs.vue'
import UpdateStatus from '../components/settings/UpdateStatus.vue'
import { useSettings } from '../composables/useSettings'
import { useSoftwareUpdate } from '../composables/useSoftwareUpdate'
const settings = useSettings()
const { status, SN, copyTooltipDisabled } = toRefs(settings.state)
const {
  supportCode,
  errorInfo,
  errorStage,
  bindCode,
  bleOldVersionData,
  cosOldVersionData,
  isCosUpdate
} = toRefs(settings.firmware.state)
const updater = useSoftwareUpdate(toRef(settings.state, 'status'))
const { progress, softOldVersionData, softNewVersionData } = toRefs(updater.state)
const { copyText, exportBindCode, openUrl } = settings
const { changeCode, isShowalert, updateFirmware } = settings.firmware
const { later, updateNow, updateNowTip, checkSoftUpdate } = updater
defineExpose({ checkSoftUpdate })
</script>
<template>
  <div v-if="status == 1 || status == 6" class="container">
    <DeviceInfo
      :SN="SN"
      :ble-old-version-data="bleOldVersionData"
      :cos-old-version-data="cosOldVersionData"
      :is-cos-update="isCosUpdate"
      :copy-tooltip-disabled="copyTooltipDisabled"
      @is-showalert="isShowalert"
      @copy-text="copyText"
      @export-bind-code="exportBindCode"
    />
    <ErrorDetail
      :message="settings.state.errorInfo || updater.state.errorInfo"
      :stage="settings.state.errorInfo ? settings.state.errorStage : updater.state.errorStage"
    />
    <SettingsLinks @open-url="openUrl" />
    <SettingsDialogs
      :support-code="supportCode"
      :error-info="errorInfo"
      :error-stage="errorStage"
      :bind-code="bindCode"
      @change-code="changeCode"
      @update-firmware="updateFirmware"
    />
    <div class="tip6" v-if="supportCode != 6 && status == 6">
      <p>{{ $t('m.imKeyManager.found_imKey_manager_new_version') }}</p>
      <button @click="updateNowTip">{{ $t('m.imKeyManager.update') }}</button>
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
    @later="later"
    @update-now="updateNow"
  />
</template>
<style src="../styles/setting.css"></style>
