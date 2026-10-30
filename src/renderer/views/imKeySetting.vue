<template>
  <div class="setKeyPage">
    <SetupSteps :flow="flow" />
    <div class="routerView">
      <BindCodeGeneration :flow="flow" />
      <SetupBindCodeEntry :flow="flow" />
      <WalletSetupInstructions :flow="flow" />
      <SetupCompletion :flow="flow" />
      <div v-if="flow.errorInfo" class="setup-error">
        <ErrorDetail :message="flow.errorInfo" :stage="flow.errorStage" />
        <button type="button" class="retry-button retry-inline" @click="flow.retry">
          {{ $t('m.imKeyManager.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ErrorDetail from '../components/ErrorDetail.vue'
import { reactive } from 'vue'
import { useDeviceSetup } from '../composables/useDeviceSetup'
import SetupSteps from '../components/setup/SetupSteps.vue'
import BindCodeGeneration from '../components/setup/BindCodeGeneration.vue'
import SetupBindCodeEntry from '../components/setup/SetupBindCodeEntry.vue'
import WalletSetupInstructions from '../components/setup/WalletSetupInstructions.vue'
import SetupCompletion from '../components/setup/SetupCompletion.vue'
const flow = reactive(useDeviceSetup())
defineExpose(flow)
</script>
<style src="../styles/deviceSetup.css"></style>
<style scoped>
.setup-error {
  position: fixed;
  bottom: 138px;
  left: 338px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;
  width: min(800px, calc(100vw - 376px));
  padding: 16px 20px;
  border: 1px solid #f1f2fa;
  border-radius: 12px;
  background: #fafbfc;
}
.setup-error :deep(.operation-error) {
  min-width: 0;
  color: #8189a7;
  font-size: 13px;
  line-height: 20px;
}
</style>
<style scoped src="../styles/retry.css"></style>
