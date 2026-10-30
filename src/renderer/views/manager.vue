<script setup lang="ts">
import { toRefs } from 'vue'
import AppList from '../components/manager/AppList.vue'
import ManagerDialogs from '../components/manager/ManagerDialogs.vue'
import { useAppManagement } from '../composables/useAppManagement'
const management = useAppManagement()
const { appName, tip } = toRefs(management.state)
const { supportCode, errorInfo, errorStage, busy, phase } = toRefs(management.firmware.state)
const { apps, getApps, installApp, updateApp, deleteApp, ok } = management
const { changeCode } = management.firmware
defineExpose({ apps, deleteApp })
</script>
<template>
  <div class="container">
    <div
      v-if="management.firmware.state.isCosUpdate && management.firmware.pendingRecoveryOptions()"
      class="firmware-recovery-entry"
      data-testid="firmware-recovery-entry"
    >
      <p>{{ $t('m.imKeyManager.check_usb_internet_connect_click_upgrade_retry') }}</p>
      <button :disabled="busy" @click="management.firmware.updateFirmware()">
        {{ $t('m.imKeyManager.upgrade') }}
      </button>
    </div>
    <AppList
      v-model:app-name="appName"
      :get-apps="getApps"
      @install-app="!busy && installApp($event)"
      @update-app="!busy && updateApp($event)"
    />
    <ManagerDialogs
      :tip="tip"
      :support-code="supportCode"
      :phase="phase"
      :error-info="tip ? management.state.errorInfo : errorInfo"
      :error-stage="tip ? management.state.errorStage : errorStage"
      @ok="ok"
      @change-code="changeCode"
    />
  </div>
</template>
<style scoped src="../styles/manager.css"></style>
<style scoped>
.firmware-recovery-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}
.firmware-recovery-entry button {
  flex-shrink: 0;
  padding: 8px 20px;
  border: 0;
  border-radius: 4px;
  color: white;
  background: #148f74;
  cursor: pointer;
}
.firmware-recovery-entry button:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
