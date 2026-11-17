<script setup lang="ts">
defineProps<{ notes: { id: number | string; info: string }[] }>()
</script>

<template>
  <div class="update-info-scroller">
    <div v-for="item in notes" :key="item.id" class="release-note">
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
        <circle cx="3" cy="3" r="2.5" stroke="#8189A7" />
      </svg>
      <span>{{ item.info }}</span>
    </div>
    <div v-if="!notes.length" class="release-notes-empty">
      {{ $t('m.imKeyManager.release_notes_unavailable') }}
    </div>
  </div>
</template>

<style scoped>
.update-info-scroller {
  box-sizing: border-box;
  height: 70px;
  padding: 0 35px;
  overflow-y: auto;
  color: #2c2842;
  font-size: 13px;
  font-weight: 300;
  line-height: 30px;
}
.release-note {
  display: flex;
  align-items: baseline;
  gap: 13px;
}
.release-note svg {
  flex-shrink: 0;
}
.release-note span {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
