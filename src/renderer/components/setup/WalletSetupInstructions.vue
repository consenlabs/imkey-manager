<template>
  <div class="set3" v-if="flow.page == 3">
    <h3>{{ $t('m.imKeyManager.disconnect_usb') }}</h3>
    <div class="nav">
      <p class="msg">{{ $t('m.imKeyManager.disconnect_usb_use_imKey_setting') }}</p>
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
    <h3>{{ $t('m.imKeyManager.setting_pin') }}</h3>
    <div class="step">
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.use_pin_unlock_imKey') }}
      </p>
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.setting_6_8_bit_pin') }}
      </p>
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.do_not_enter_the_same_or_consecutive_pin') }}
      </p>
    </div>
    <h3>{{ $t('m.imKeyManager.create_restore_Wallet') }}</h3>
    <div class="step">
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.Mnemonic_control_ownership_please_private') }}
      </p>
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.Replace_reset_device_use_mnemonic_restore_wallet') }}
      </p>
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.Create_restore_wallet_2_minutes_wait') }}
      </p>
    </div>
    <p class="careful">{{ $t('m.imKeyManager.precautions') }}</p>
    <div class="mattersNeedingAttention">
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.choose_create_wallet_mnemonic_never_be_online') }}
      </p>
    </div>
    <div class="btnBox">
      <p class="codeTit" v-if="flow.checkWalletTip" style="display: inline-block; float: left">
        <el-icon class="el-icon-warning"><WarningFilled /></el-icon
        >{{ $t('m.imKeyManager.done_setting_select_next') }}
      </p>
      <button
        class="nextBtn"
        :disabled="flow.busy"
        :aria-busy="nextLoading"
        @click="flow.send({ page: 4, active: 2, isNext: true })"
      >
        <span v-if="nextLoading" class="setup-button-spinner" aria-hidden="true"></span>
        {{ $t(nextLoading ? 'm.imKeyManager.setup_checking_wallet' : 'm.imKeyManager.next') }}
      </button>
      <button
        class="prevBtn"
        :disabled="flow.busy"
        :aria-busy="false"
        @click="flow.send({ page: 2, active: 0, isNext: false })"
      >
        {{ $t('m.imKeyManager.previous') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { computed } from 'vue'
import type { useDeviceSetup } from '../../composables/useDeviceSetup'
import { WarningFilled } from '@element-plus/icons-vue'
const props = defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useDeviceSetup>> }>()
const nextLoading = computed(() => props.flow.busy && props.flow.pendingAction === 'next')
</script>
