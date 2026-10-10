<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
defineProps<{
  SN: string
  bleOldVersionData: string
  cosOldVersionData: string
  isCosUpdate: boolean
  copyTooltipDisabled: boolean
}>()
const emit = defineEmits<{ isShowalert: []; copyText: []; exportBindCode: [] }>()
</script>
<template>
  <h2>{{ $t('m.imKeyManager.setting') }}</h2>
  <p class="msg">{{ $t('m.imKeyManager.imKey_pro_setting_and_info') }}</p>
  <h3>{{ $t('m.imKeyManager.device') }}</h3>
  <div class="equipmentBox">
    <div class="session1">
      <div class="left">
        <p>imKey Pro</p>
        <p>ble version {{ bleOldVersionData }}</p>
        <p>firmware version {{ cosOldVersionData }}</p>
      </div>
      <div class="rightNoUpdate" v-if="isCosUpdate == false">
        <p>
          {{ $t('m.imKeyManager.current_least_cos_version') }}
          <button>{{ $t('m.imKeyManager.upgrade') }}</button>
        </p>
      </div>
      <div class="rightUpdate" v-if="isCosUpdate == true">
        <p>
          {{ $t('m.imKeyManager.found_new_cos_version') }}
          <button @click="emit('isShowalert')">{{ $t('m.imKeyManager.upgrade') }}</button>
        </p>
      </div>
    </div>
    <div class="session2">
      <p>
        {{ $t('m.imKeyManager.device_SN') }}SN:{{ SN }}
        <el-tooltip
          trigger="manual"
          :visible="copyTooltipDisabled"
          :content="$t('m.imKeyManager.copy_success')"
          placement="top"
        >
          <el-icon class="el-icon-copy-document" @click="emit('copyText')"
            ><CopyDocument
          /></el-icon>
        </el-tooltip>
      </p>
      <p>
        {{ $t('m.imKeyManager.device_bind_code')
        }}<span class="exportBindCode" @click="emit('exportBindCode')">{{
          $t('m.imKeyManager.export')
        }}</span>
      </p>
    </div>
  </div>
</template>
