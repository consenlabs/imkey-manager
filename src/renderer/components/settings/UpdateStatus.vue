<script setup lang="ts">
import ErrorDetail from '../ErrorDetail.vue'
import UpdateReleaseNotes from '../UpdateReleaseNotes.vue'
defineProps<{
  errorInfo?: string
  errorStage?: string
  status: number
  progress: number
  softOldVersionData: string
  softNewVersionData: string
  softUpdateInfo: { id: number | string; info: string }[]
}>()
const emit = defineEmits<{ later: []; updateNow: []; retry: [] }>()
</script>
<template>
  <div class="statusBox status2" v-if="status == 2">
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M52.68 42.72C53.52 40.65 54 38.385 54 36C54 26.055 45.945 18 36 18C33.615 18 31.35 18.48 29.265 19.32L34.14 24.195C34.755 24.09 35.37 24 36 24C42.63 24 48 29.37 48 36C48 36.645 47.94 37.275 47.835 37.875L52.68 42.72ZM36 12C49.26 12 60 22.74 60 36C60 40.065 58.95 43.86 57.165 47.205L61.575 51.615C64.365 47.07 66 41.73 66 36C66 19.425 52.56 6 36 6C30.27 6 24.93 7.635 20.385 10.425L24.765 14.805C28.11 13.02 31.935 12 36 12ZM9.81 7.5L6 11.325L12.315 17.64C8.37 22.71 6 29.07 6 36C6 47.085 12.03 56.745 20.985 61.935L23.985 56.745C16.83 52.605 12 44.865 12 36C12 30.735 13.71 25.875 16.59 21.915L20.895 26.22C19.065 29.04 18 32.385 18 36C18 42.66 21.615 48.45 26.985 51.57L30.015 46.35C26.43 44.265 24 40.44 24 36C24 34.065 24.51 32.265 25.32 30.645L30.06 35.385L30 36C30 39.315 32.685 42 36 42L36.615 41.94L36.645 41.97L59.175 64.5L63 60.675L12.81 10.5L9.81 7.5Z"
        fill="#111111"
      />
    </svg>
    <p>{{ $t('m.imKeyManager.access_error_please_check_your_network_connection') }}</p>
    <ErrorDetail :message="errorInfo" :stage="errorStage" />
    <button type="button" class="retry-button" @click="emit('retry')">
      {{ $t('m.imKeyManager.retry') }}
    </button>
  </div>
  <div class="statusBox status3" v-else-if="status == 3">
    <svg width="61" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.457 12.7291C4.30497 14.4024 3.2742 16.1355 2.48597 17.988C0.9095 21.6932 0 25.6972 0 29.9402C0 34.6016 1.0914 39.0239 3.03167 42.9681L11.7629 37.9482C10.6715 35.498 10.0651 32.749 10.0651 29.9402C10.0651 27.5498 10.4896 25.2191 11.2778 23.0677C12.0054 21.1554 12.9755 19.3626 14.2488 17.749C17.4018 13.6255 22.1312 10.757 27.5882 9.98008V0C18.4325 0.836653 10.4896 5.67729 5.457 12.7291ZM58.5112 17.8685C57.7229 16.0757 56.7528 14.4024 55.6614 12.7888C50.6288 5.73705 42.6252 0.896414 33.4696 0V9.98008C38.9266 10.757 43.7166 13.6853 46.8696 17.8088C48.0216 19.3626 48.9917 21.0359 49.6587 22.8884C50.5076 25.0996 50.932 27.4303 50.932 29.8805C50.932 32.6892 50.3257 35.3785 49.2949 37.7689L58.0261 42.7888C59.9057 38.8446 60.9972 34.4821 60.9972 29.8805C61.0578 25.6375 60.1483 21.5737 58.5112 17.8685ZM33.4696 49.9004C32.4995 50.0199 31.5293 50.1394 30.5592 50.1394C29.5891 50.1394 28.6189 50.0797 27.6488 49.9004C22.5556 49.1833 18.0687 46.6135 14.9158 42.9084L6.06333 47.9283C11.0959 54.5618 18.7963 59.0438 27.5882 59.8805C28.5583 59.9402 29.5284 60 30.4986 60C31.4687 60 32.4388 59.9402 33.409 59.8805C42.1402 59.0438 49.8406 54.5618 54.8732 48.0478L46.0813 42.9681C42.9284 46.6135 38.5022 49.1833 33.4696 49.9004Z"
        fill="#111111"
      />
    </svg>
    <p>{{ $t('m.imKeyManager.loading_please_wait') }}</p>
  </div>
  <div class="statusBox status4" v-else-if="status == 4">
    <div class="status4Alert">
      <div class="status4AlertBox" :class="{ 'update-error-dialog': errorInfo }">
        <h4>{{ $t('m.imKeyManager.found_new_soft_version') }}</h4>
        <ErrorDetail :message="errorInfo" :stage="errorStage" />
        <p>
          {{ $t('m.imKeyManager.new_version_is') }}V{{ softNewVersionData
          }}{{ $t('m.imKeyManager.current_version_is') }}V{{ softOldVersionData }}
        </p>
        <UpdateReleaseNotes :notes="softUpdateInfo" />
        <div class="update-actions">
          <button class="later" @click.prevent="emit('later')">
            {{ $t('m.imKeyManager.update_later') }}
          </button>
          <button
            class="updateNow"
            :class="errorInfo ? 'retry-button retry-inline' : ''"
            @click="emit('updateNow')"
          >
            {{ $t('m.imKeyManager.update_now') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="statusBox status5" v-else-if="status == 5">
    <div class="status5Alert">
      <div class="status5AlertBox">
        <h4>{{ $t('m.imKeyManager.found_new_soft_version') }}</h4>
        <ErrorDetail :message="errorInfo" :stage="errorStage" />
        <p>
          {{ $t('m.imKeyManager.new_version_is') }}V{{ softNewVersionData
          }}{{ $t('m.imKeyManager.current_version_is') }}V{{ softOldVersionData }}
        </p>
        <UpdateReleaseNotes :notes="softUpdateInfo" />
        <div>
          <el-progress color="#000" :percentage="progress"></el-progress>
          <a href="#" @click.prevent="emit('later')">{{ $t('m.imKeyManager.cancel') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.update-actions {
  margin-top: 30px;
}
.status2 :deep(.operation-error) {
  max-width: min(560px, calc(100% - 48px));
  margin-top: 8px;
  color: #8189a7;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}
</style>
<style scoped src="../../styles/retry.css"></style>
