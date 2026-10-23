<template>
  <div class="set1" v-if="flow.page == 1">
    <h3>{{ $t('m.imKeyManager.generate_bind_code') }}</h3>
    <div class="nav">
      <p class="msg">{{ $t('m.imKeyManager.first_bind_device_see_to_imKey') }}</p>
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
    <p class="careful">{{ $t('m.imKeyManager.precautions') }}</p>
    <div class="mattersNeedingAttention">
      <p>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
        </svg>
        {{ $t('m.imKeyManager.bind_code_used_check_device_please_save') }}
      </p>
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
        :class="[flow.bindViewFinish ? '' : 'noFinish']"
        :disabled="!flow.bindViewFinish || flow.busy"
        class="nextBtn"
        @click="flow.send({ page: 2, active: 0, isNext: true })"
      >
        {{ $t('m.imKeyManager.next') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import type { useDeviceSetup } from '../../composables/useDeviceSetup'
defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useDeviceSetup>> }>()
</script>
