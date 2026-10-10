<template>
  <div class="setKeyPage">
    <div v-if="flow.errorInfo" class="setup-error">
      <ErrorDetail :message="flow.errorInfo" :stage="flow.errorStage" />
      <button @click="flow.retry">{{ $t('m.imKeyManager.retry') }}</button>
    </div>
    <SetupSteps :flow="flow" />
    <div class="routerView">
      <BindCodeGeneration :flow="flow" />
      <SetupBindCodeEntry :flow="flow" />
      <WalletSetupInstructions :flow="flow" />
      <SetupCompletion :flow="flow" />
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
