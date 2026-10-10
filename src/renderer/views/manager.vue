<script setup lang="ts">
import { toRefs } from 'vue'
import AppList from '../components/manager/AppList.vue'
import ManagerDialogs from '../components/manager/ManagerDialogs.vue'
import { useAppManagement } from '../composables/useAppManagement'
const management = useAppManagement()
const { appName, tip, tip1 } = toRefs(management.state)
const { supportCode, errorInfo, errorStage } = toRefs(management.firmware.state)
const { apps, getApps, installApp, updateApp, deleteApp, ok } = management
const { changeCode } = management.firmware
defineExpose({ apps, deleteApp })
</script>
<template>
  <div class="container">
    <AppList
      v-model:app-name="appName"
      :get-apps="getApps"
      @install-app="installApp"
      @update-app="updateApp"
    />
    <ManagerDialogs
      :tip="tip"
      :tip1="tip1"
      :support-code="supportCode"
      :error-info="tip || tip1 ? management.state.errorInfo : errorInfo"
      :error-stage="tip || tip1 ? management.state.errorStage : errorStage"
      @ok="ok"
      @change-code="changeCode"
    />
  </div>
</template>
<style scoped src="../styles/manager.css"></style>
