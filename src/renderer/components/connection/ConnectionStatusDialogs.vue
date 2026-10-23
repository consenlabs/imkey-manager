<template>
  <div class="tip2 tip" v-if="flow.status == 3">
    <div class="tipBox">
      <h3>{{ $t('m.imKeyManager.imKey_connecting_wait') }}</h3>
      <p>
        <el-icon
          v-if="flow.checkFirmwareUpgrade === 3"
          class="el-icon-success"
          :class="{ done: flow.checkFirmwareUpgrade === 3 }"
          ><SuccessFilled /></el-icon
        ><span
          v-else-if="flow.checkFirmwareUpgrade === 2"
          class="fas fa-circle-notch fa-spin"
        ></span
        ><span v-else class="connection-step-pending" aria-hidden="true"></span
        >{{ $t('m.imKeyManager.check_firmware_version_update') }}
      </p>
      <p>
        <el-icon
          v-if="flow.checkDeviceBindingCode === 3"
          class="el-icon-success"
          :class="{ done: flow.checkDeviceBindingCode === 3 }"
          ><SuccessFilled /></el-icon
        ><span
          v-else-if="flow.checkDeviceBindingCode === 2"
          class="fas fa-circle-notch fa-spin"
        ></span
        ><span v-else class="connection-step-pending" aria-hidden="true"></span
        >{{ $t('m.imKeyManager.check_device_bind_code') }}
      </p>
      <p>
        <el-icon
          v-if="flow.checkPinAndWallet === 3"
          class="el-icon-success"
          :class="{ done: flow.checkPinAndWallet === 3 }"
          ><SuccessFilled /></el-icon
        ><span v-else-if="flow.checkPinAndWallet === 2" class="fas fa-circle-notch fa-spin"></span
        ><span v-else class="connection-step-pending" aria-hidden="true"></span
        >{{ $t('m.imKeyManager.check_pin_wallet') }}
      </p>
    </div>
  </div>
  <div class="tip1 tip" v-if="flow.status == 4">
    <div class="tipBox">
      <h3>{{ $t('m.imKeyManager.connection_incomplete') }}</h3>
      <p>
        {{
          $t(
            deviceRejected
              ? 'm.imKeyManager.connection_device_rejected'
              : flow.errorStage === 'connect'
                ? 'm.imKeyManager.check_usb_connect'
                : 'm.imKeyManager.connection_check_failed'
          )
        }}
      </p>
      <ErrorDetail :message="flow.errorInfo" :stage="flow.errorStage" :raw="deviceRejected" />
      <button @click="flow.changeState(1)">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="tip3 tip" v-if="flow.status == 5">
    <div class="tipBox3">
      <p>
        <el-icon class="el-icon-warning-outline"><Warning /></el-icon>
      </p>
      <h3>{{ $t('m.imKeyManager.firmware_update_fail') }}</h3>
      <p>{{ $t('m.imKeyManager.find_firmware_update_fail_continue') }}</p>
      <ErrorDetail :message="flow.errorInfo" />
      <button @click="flow.changeState(1)">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="tip4 tip" v-if="flow.status == 6">
    <div class="tipBox4">
      <p><span class="fas fa-circle-notch fa-spin"></span></p>
      <h3>{{ $t('m.imKeyManager.imKey_pro_firmware_update_wait') }}</h3>
      <p>{{ $t('m.imKeyManager.imKey_pro_firmware_update_no_disconnect') }}</p>
    </div>
  </div>
  <div class="tip6 tip" v-if="flow.status == 8">
    <div class="tipBox">
      <h3>{{ $t('m.imKeyManager.enter_pin_imKey_pro') }}</h3>
      <p>
        {{ $t('m.imKeyManager.pin_code_error_please_check') }}
        <a class="link" @click="flow.openUrl">{{ $t('m.imKeyManager.reset_imKey') }}</a>
        <a>{{ $t('m.imKeyManager.retrieved') }}</a>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import ErrorDetail from '../ErrorDetail.vue'
import { computed } from 'vue'
import type { UnwrapNestedRefs } from 'vue'
import type { useConnection } from '../../composables/useConnection'
import { SuccessFilled, Warning } from '@element-plus/icons-vue'
const props = defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useConnection>> }>()
const deviceRejected = computed(() =>
  /^imkey_tsm_device_illegal(?: \[[a-z0-9-]{1,64}\])?$/.test(props.flow.errorInfo)
)
</script>
<style scoped src="../../styles/connection.css"></style>
