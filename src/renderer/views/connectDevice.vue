<template>
  <div>
    <ConnectionInstructions :flow="flow" />
    <ConnectionStatusDialogs :flow="flow" />
    <ConnectionBindDialog :flow="flow" />
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useConnection } from '../composables/useConnection'
import ConnectionInstructions from '../components/connection/ConnectionInstructions.vue'
import ConnectionStatusDialogs from '../components/connection/ConnectionStatusDialogs.vue'
import ConnectionBindDialog from '../components/connection/ConnectionBindDialog.vue'
const flow = reactive(useConnection())
defineExpose(flow)
</script>
