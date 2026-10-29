<template>
  <div class="set4" v-if="flow.page == 4">
    <h3>{{ $t('m.imKeyManager.complete_setup') }}</h3>
    <div class="nav">
      <p class="msg">
        {{ $t('m.imKeyManager.congratulations_complete_setup_final_security_check') }}
      </p>
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
    <div class="step">
      <p>
        <svg
          @click="flow.changeStep('step1')"
          v-if="flow.step1"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            fill="black"
            stroke="black"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2" />
        </svg>

        <svg
          @click="flow.changeStep('step1')"
          v-else
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            stroke="#C4C9D9"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('m.imKeyManager.confirm_pi_code_set_for_me_backup_completed') }}</span>
      </p>
      <p>
        <svg
          @click="flow.changeStep('step2')"
          v-if="flow.step2"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            fill="black"
            stroke="black"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2" />
        </svg>

        <svg
          @click="flow.changeStep('step2')"
          v-else
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            stroke="#C4C9D9"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('m.imKeyManager.mnemonics_backup_offline_importance_of_mnemonics') }}</span>
      </p>
      <p>
        <svg
          @click="flow.changeStep('step3')"
          v-if="flow.step3"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            fill="black"
            stroke="black"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M7 10.625L10.1154 14L16 8" stroke="white" stroke-width="2" />
        </svg>

        <svg
          @click="flow.changeStep('step3')"
          v-else
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
            stroke="#C4C9D9"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('m.imKeyManager.binding_code_backup_known') }}</span>
      </p>
    </div>
    <p class="codeTit" v-if="flow.checkTip">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
          stroke="#ED766C"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M6 4V6" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 8H6.005" stroke="#ED766C" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ $t('m.imKeyManager.safety_your_assets_please_complete_all_security_checks') }}
    </p>
    <div class="btnBox">
      <button
        :class="[flow.finish ? '' : 'noFinish']"
        :disabled="!flow.finish || flow.busy"
        :aria-busy="nextLoading"
        class="nextBtn"
        @click="flow.send({ page: 0, active: 0, isNext: false })"
      >
        <span v-if="nextLoading" class="setup-button-spinner" aria-hidden="true"></span>
        {{ $t(nextLoading ? 'm.imKeyManager.setup_checking_wallet' : 'm.imKeyManager.done') }}
      </button>
      <button
        class="prevBtn"
        :disabled="flow.busy"
        :aria-busy="false"
        @click="flow.send({ page: 3, active: 1, isNext: false })"
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
const props = defineProps<{ flow: UnwrapNestedRefs<ReturnType<typeof useDeviceSetup>> }>()
const nextLoading = computed(() => props.flow.busy && props.flow.pendingAction === 'next')
</script>
