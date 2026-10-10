<template>
  <div class="tip5 tip" v-if="flow.status == 7">
    <div class="tipBox">
      <h3>{{ $t('m.imKeyManager.enter_bind_code') }}</h3>
      <div>
        <input
          type="text"
          maxlength="1"
          :value="flow.code1"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(1)"
          @keyup="flow.inpCode(1, $event)"
          @input="flow.filterBindInput(1, $event)"
          autofocus
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code2"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(2)"
          @keyup="flow.inpCode(2, $event)"
          @input="flow.filterBindInput(2, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code3"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(3)"
          @keyup="flow.inpCode(3, $event)"
          @input="flow.filterBindInput(3, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code4"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(4)"
          @keyup="flow.inpCode(4, $event)"
          @input="flow.filterBindInput(4, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code5"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(5)"
          @keyup="flow.inpCode(5, $event)"
          @input="flow.filterBindInput(5, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code6"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(6)"
          @keyup="flow.inpCode(6, $event)"
          @input="flow.filterBindInput(6, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code7"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(7)"
          @keyup="flow.inpCode(7, $event)"
          @input="flow.filterBindInput(7, $event)"
        />
        <input
          type="text"
          maxlength="1"
          :value="flow.code8"
          @focus="flow.inpFocus($event)"
          @keyup.delete="flow.deleteInput(8)"
          @keyup="flow.inpCode(8, $event)"
          @input="flow.filterBindInput(8, $event)"
        />
      </div>
      <div class="bindTip">
        <span class="verification-pending" v-if="flow.bindingStatus == 1"
          ><span class="fas fa-circle-notch fa-spin"></span
          >{{ $t('m.imKeyManager.verifying') }}</span
        >
        <span class="verification-success" v-if="flow.bindingStatus == 2"
          ><el-icon class="el-icon-success"><SuccessFilled /></el-icon
          >{{ $t('m.imKeyManager.verified_successfully') }}</span
        >
        <p v-if="!flow.codeIsTrue">
          <el-icon class="el-icon-warning"><WarningFilled /></el-icon
          >{{ $t('m.imKeyManager.bind_code_error_please_check') }}
          <a class="link1" @click="flow.openUrl">{{ $t('m.imKeyManager.reset_imKey') }}</a>
          <a>{{ $t('m.imKeyManager.retrieved') }}</a>
          <span v-if="flow.errorInfo" role="alert" class="operation-error">{{
            flow.errorInfo
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import type { useConnection } from '../../composables/useConnection'
import { SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useConnection>> }>()
</script>
<style scoped src="../../styles/connection.css"></style>
