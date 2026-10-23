<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{ message?: string; stage?: string; raw?: boolean }>()
const { t, te } = useI18n({ useScope: 'global' })
const description = computed(() => {
  const message = props.message || ''
  const diagnostic = message.match(/ \[([a-z0-9-]{1,64})\]$/)?.[0] || ''
  const cause = diagnostic ? message.slice(0, -diagnostic.length) : message
  const key = `m.imKeyCoreErrorInfo.${cause}`
  return `${!props.raw && te(key) ? t(key) : cause}${diagnostic}`
})
</script>
<template>
  <p v-if="message" class="operation-error" role="alert">
    <span v-if="stage">{{ $t(`m.imKeyManager.stage_${stage}`) }}: </span>
    {{ description }}
  </p>
</template>
<style scoped>
.operation-error {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
