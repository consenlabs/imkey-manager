<template>
  <div class="routerBar">
    <h2>{{ $t('m.imKeyManager.imKey_setting') }}</h2>
    <p>{{ $t('m.imKeyManager.following_operations_on_imKey') }}</p>
    <div class="el-steps">
      <el-steps direction="vertical" :active="flow.active">
        <el-step :title="$t('m.imKeyManager.bin_code')"></el-step>
        <el-step :title="$t('m.imKeyManager.create_restore_Wallet')"></el-step>
        <el-step :title="$t('m.imKeyManager.complete_setup')"></el-step>
      </el-steps>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import type { useDeviceSetup } from '../../composables/useDeviceSetup'
defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useDeviceSetup>> }>()
</script>
