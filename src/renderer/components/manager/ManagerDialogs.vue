<script setup lang="ts">
import ErrorDetail from '../ErrorDetail.vue'
defineProps<{
  tip: boolean
  tip1: boolean
  errorInfo?: string
  errorStage?: string
  supportCode: number
}>()
const emit = defineEmits<{ ok: []; changeCode: [code: number] }>()
</script>
<template>
  <div class="dioBox" v-if="tip">
    <div class="box">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z"
          stroke="#43454F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h4>{{ $t('m.imKeyManager.install_uninstall_upgrade_delete_Apps_fail') }}</h4>
      <p>{{ $t('m.imKeyManager.check_usb_or_internet_connect') }}</p>
      <ErrorDetail :message="errorInfo" :stage="errorStage" />
      <button @click="emit('ok')">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="dioBox" v-if="tip1">
    <div class="box">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z"
          stroke="#43454F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h4>{{ $t('m.imKeyManager.check_usb_or_internet_connect') }}</h4>
      <ErrorDetail :message="errorInfo" :stage="errorStage" />
      <button @click="emit('ok')">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="alert" v-if="supportCode == 1">
    <div class="alertBox alert1">
      <span class="fas fa-circle-notch fa-spin"></span>
      <h4>{{ $t('m.imKeyManager.imKey_pro_firmware_update_wait') }}</h4>
      <line></line>
      <p>{{ $t('m.imKeyManager.restart_automatically_after_upgrade') }}</p>
      <p>{{ $t('m.imKeyManager.upgrading_do_not_disconnect_usb_operating') }}</p>
    </div>
  </div>
  <div class="alert" v-if="supportCode == 2">
    <div class="alertBox alert2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
          stroke="#43454F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <h5>{{ $t('m.imKeyManager.upgrade_done') }}</h5>
      <p>{{ $t('m.imKeyManager.can_used_imKey_manager') }}</p>
      <button @click="emit('changeCode', 0)">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="alert" v-if="supportCode == 3">
    <div class="alertBox alert3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z"
          stroke="#43454F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <h5>{{ $t('m.imKeyManager.upgrade_fail') }}</h5>
      <p>{{ $t('m.imKeyManager.check_usb_internet_connect_click_upgrade_retry') }}</p>
      <ErrorDetail :message="errorInfo" :stage="errorStage" />
      <button @click="emit('changeCode', 0)">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
  <div class="alert" v-if="supportCode == 5">
    <div class="alertBox alert3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z"
          stroke="#43454F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M15 9L9 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9L15 15" stroke="#43454F" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <h5>{{ $t('m.imKeyManager.loading_fail') }}</h5>
      <p>{{ $t('m.imKeyManager.check_usb_internet_connect_retry') }}</p>
      <ErrorDetail :message="errorInfo" :stage="errorStage" />
      <button @click="emit('changeCode', 0)">{{ $t('m.imKeyManager.ok') }}</button>
    </div>
  </div>
</template>
