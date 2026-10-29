<template>
  <div class="set2" v-if="flow.page == 2">
    <h3>{{ $t('m.imKeyManager.enter_bind_code') }}</h3>
    <div class="nav">
      <p class="msg">{{ $t('m.imKeyManager.enter_bind_code_for_use_on_the_current_device') }}</p>
      <p class="course" @click="flow.openUrl">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.8335 2.75H7.3335C8.30596 2.75 9.23859 3.13631 9.92622 3.82394C10.6139 4.51158 11.0002 5.44421 11.0002 6.41667V19.25C11.0002 18.5207 10.7104 17.8212 10.1947 17.3055C9.67898 16.7897 8.97951 16.5 8.25016 16.5H1.8335V2.75Z"
            stroke="#B8AC95"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.1667 2.75H14.6667C13.6942 2.75 12.7616 3.13631 12.0739 3.82394C11.3863 4.51158 11 5.44421 11 6.41667V19.25C11 18.5207 11.2897 17.8212 11.8055 17.3055C12.3212 16.7897 13.0207 16.5 13.75 16.5H20.1667V2.75Z"
            stroke="#B8AC95"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('m.imKeyManager.operating_tutorial') }}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7.5" cy="7.5" r="7.5" fill="#B8AC95" />
          <path d="M6.5 10.5L9.5 7.5L6.5 4.5" stroke="#FAF8F5" />
        </svg>
      </p>
    </div>
    <div class="codeBox">
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
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
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code2"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(2)"
        @keyup="flow.inpCode(2, $event)"
        @input="flow.filterBindInput(2, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code3"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(3)"
        @keyup="flow.inpCode(3, $event)"
        @input="flow.filterBindInput(3, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code4"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(4)"
        @keyup="flow.inpCode(4, $event)"
        @input="flow.filterBindInput(4, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code5"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(5)"
        @keyup="flow.inpCode(5, $event)"
        @input="flow.filterBindInput(5, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code6"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(6)"
        @keyup="flow.inpCode(6, $event)"
        @input="flow.filterBindInput(6, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code7"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(7)"
        @keyup="flow.inpCode(7, $event)"
        @input="flow.filterBindInput(7, $event)"
      />
      <input
        type="text"
        maxlength="1"
        :disabled="flow.busy || flow.bindingStatus === 1"
        :value="flow.code8"
        @focus="flow.inpFocus($event)"
        @keyup.delete="flow.deleteInput(8)"
        @keyup="flow.inpCode(8, $event)"
        @input="flow.filterBindInput(8, $event)"
      />
    </div>
    <span class="verification-pending" v-if="flow.bindingStatus == 1"
      ><span class="fas fa-circle-notch fa-spin"></span>{{ $t('m.imKeyManager.verifying') }}</span
    >
    <span class="verification-success" v-if="flow.bindingStatus == 2"
      ><el-icon class="el-icon-success"><SuccessFilled /></el-icon
      >{{ $t('m.imKeyManager.verified_successfully') }}</span
    >
    <p class="codeTit" v-if="!flow.codeIsTrue">
      <el-icon class="el-icon-warning"><WarningFilled /></el-icon
      >{{ $t('m.imKeyManager.bind_code_error_please_check') }}
      <a class="link2" @click="flow.openUrlReset">{{ $t('m.imKeyManager.reset_imKey') }}</a>
      <a>{{ $t('m.imKeyManager.retrieved') }}</a>
    </p>
    <p class="careful">{{ $t('m.imKeyManager.precautions') }}</p>
    <div class="mattersNeedingAttention">
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.bind_code_export_on_setting_or_rest_imKey') }}
      </p>
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.same_imKey_bind_different_PC_used_same_bind_code') }}
      </p>
    </div>
    <div class="btnBox">
      <button
        :class="[flow.bindFinish ? '' : 'noFinish']"
        :disabled="flow.busy || flow.bindingStatus === 1"
        class="nextBtn"
        :aria-busy="nextLoading"
        @click="flow.send({ page: 3, active: 1, isNext: true })"
      >
        <span v-if="nextLoading" class="setup-button-spinner" aria-hidden="true"></span>
        {{ $t(nextLoading ? 'm.imKeyManager.setup_checking_device' : 'm.imKeyManager.next') }}
      </button>
      <button
        :disabled="flow.busy || flow.bindingStatus === 1"
        class="prevBtn"
        :aria-busy="previousLoading"
        @click="flow.send({ page: 1, active: 0, isNext: false })"
      >
        <span v-if="previousLoading" class="setup-button-spinner" aria-hidden="true"></span>
        {{
          $t(previousLoading ? 'm.imKeyManager.setup_checking_device' : 'm.imKeyManager.previous')
        }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { computed } from 'vue'
import type { useDeviceSetup } from '../../composables/useDeviceSetup'
import { SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
const props = defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useDeviceSetup>> }>()
const nextLoading = computed(() => props.flow.busy && props.flow.pendingAction === 'next')
const previousLoading = computed(() => props.flow.busy && props.flow.pendingAction === 'previous')
</script>
