<script setup lang="ts">
const emit = defineEmits<{ openUrl: [type: 'buy' | 'getStarted'] }>()
</script>
<template>
  <h3>{{ $t('m.imKeyManager.understand_more') }}</h3>
  <div class="moreBox">
    <a class="link5" @click="emit('openUrl', 'getStarted')">
      <div class="box">
        <a>
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.25 7H29.75V22.75H7V26.25C7 27.2125 7.7875 28 8.75 28H28L35 35V8.75C35 7.7875 34.2125 7 33.25 7ZM26.25 17.5V1.75C26.25 0.7875 25.4625 0 24.5 0H1.75C0.7875 0 0 0.7875 0 1.75V26.25L7 19.25H24.5C25.4625 19.25 26.25 18.4625 26.25 17.5Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="2.75964e-07"
                y1="26.5"
                x2="35"
                y2="-1.95578e-07"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E1DDD2" />
                <stop offset="1" stop-color="#EDE8DC" />
              </linearGradient>
            </defs>
          </svg>
          <h3>{{ $t('m.imKeyManager.beginner_guide') }}</h3>
          <span>
            <p>{{ $t('m.imKeyManager.learn_use_imKey') }}</p>
          </span>
        </a>
      </div>
    </a>
    <a class="link5" @click="emit('openUrl', 'buy')">
      <div class="box">
        <a>
          <svg
            width="39"
            height="37"
            viewBox="0 0 39 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.75 36.5625C11.7693 36.5625 13.4063 34.9255 13.4063 32.9063C13.4063 30.887 11.7693 29.25 9.75 29.25C7.73071 29.25 6.09375 30.887 6.09375 32.9063C6.09375 34.9255 7.73071 36.5625 9.75 36.5625Z"
              fill="url(#paint0_linear)"
            />
            <path
              d="M32.9063 36.5625C34.9255 36.5625 36.5625 34.9255 36.5625 32.9063C36.5625 30.887 34.9255 29.25 32.9063 29.25C30.887 29.25 29.25 30.887 29.25 32.9063C29.25 34.9255 30.887 36.5625 32.9063 36.5625Z"
              fill="url(#paint1_linear)"
            />
            <path
              d="M34.125 26.8125H8.53126C7.92798 26.8125 7.41488 26.3713 7.32591 25.7742L3.82566 2.4375H0V0H4.87501C5.47829 0 5.99138 0.441188 6.08035 1.03838L6.83841 6.09376H37.7813C38.1469 6.09376 38.4918 6.25707 38.7234 6.53982C38.9549 6.82135 39.0476 7.19307 38.9757 7.55138L35.3194 25.8327C35.2061 26.403 34.7064 26.8125 34.125 26.8125Z"
              fill="url(#paint2_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="6.09375"
                y1="34.7866"
                x2="13.4063"
                y2="29.25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E1DDD2" />
                <stop offset="1" stop-color="#EDE8DC" />
              </linearGradient>
              <linearGradient
                id="paint1_linear"
                x1="29.25"
                y1="34.7866"
                x2="36.5625"
                y2="29.25"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E1DDD2" />
                <stop offset="1" stop-color="#EDE8DC" />
              </linearGradient>
              <linearGradient
                id="paint2_linear"
                x1="3.07499e-07"
                y1="20.3009"
                x2="27.7277"
                y2="-10.2352"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E1DDD2" />
                <stop offset="1" stop-color="#EDE8DC" />
              </linearGradient>
            </defs>
          </svg>
          <h3>{{ $t('m.imKeyManager.buy') }}</h3>
          <span>
            <p>{{ $t('m.imKeyManager.visit_Youzan_Mall_to_buy') }}</p>
          </span>
        </a>
      </div>
    </a>
    <a>
      <div class="box">
        <a>
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1" fill="white">
              <path
                d="M0 29.1667V17.5C6.91606e-08 12.8587 1.84374 8.40752 5.12563 5.12563C8.40752 1.84374 12.8587 0 17.5 0C22.1413 0 26.5925 1.84374 29.8744 5.12563C33.1563 8.40752 35 12.8587 35 17.5V29.1667"
              />
            </mask>
            <path
              d="M0 17.5H-3H0ZM17.5 0V3V0ZM35 17.5H38H35ZM3 29.1667V17.5H-3V29.1667H3ZM3 17.5C3 13.6544 4.52767 9.96623 7.24695 7.24695L3.00431 3.00431C-0.840185 6.84881 -3 12.0631 -3 17.5H3ZM7.24695 7.24695C9.96623 4.52767 13.6544 3 17.5 3V-3C12.0631 -3 6.84881 -0.840185 3.00431 3.00431L7.24695 7.24695ZM17.5 3C21.3456 3 25.0338 4.52767 27.753 7.24695L31.9957 3.00431C28.1512 -0.840184 22.9369 -3 17.5 -3V3ZM27.753 7.24695C30.4723 9.96623 32 13.6544 32 17.5H38C38 12.0631 35.8402 6.84881 31.9957 3.00431L27.753 7.24695ZM32 17.5V29.1667H38V17.5H32Z"
              fill="#E6E2D7"
              mask="url(#path-1-inside-1)"
            />
            <path
              d="M35 31.1109C35 32.1423 34.5903 33.1314 33.861 33.8608C33.1317 34.5901 32.1425 34.9998 31.1111 34.9998H29.1667C28.1353 34.9998 27.1461 34.5901 26.4168 33.8608C25.6875 33.1314 25.2778 32.1423 25.2778 31.1109V25.2776C25.2778 24.2462 25.6875 23.257 26.4168 22.5277C27.1461 21.7984 28.1353 21.3887 29.1667 21.3887H35V31.1109ZM0 31.1109C0 32.1423 0.409721 33.1314 1.13903 33.8608C1.86834 34.5901 2.85749 34.9998 3.88889 34.9998H5.83333C6.86473 34.9998 7.85389 34.5901 8.58319 33.8608C9.3125 33.1314 9.72222 32.1423 9.72222 31.1109V25.2776C9.72222 24.2462 9.3125 23.257 8.58319 22.5277C7.85389 21.7984 6.86473 21.3887 5.83333 21.3887H0V31.1109Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="2.75964e-07"
                y1="31.6942"
                x2="11.4943"
                y2="9.31552"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E1DDD2" />
                <stop offset="1" stop-color="#EDE8DC" />
              </linearGradient>
            </defs>
          </svg>
          <h3>{{ $t('m.imKeyManager.user_support') }}</h3>
          <span>
            <p>{{ $t('m.imKeyManager.email') }}</p>
            <p>{{ $t('m.imKeyManager.wechat') }}</p>
          </span>
        </a>
      </div>
    </a>
  </div>
</template>
