<script setup lang="ts">
const props = defineProps({
  status: Boolean
})
</script>

<template>
  <div v-if="props.status" class="bg-blue-500 shadow-md shadow-blue-600/100 w-1.5 h-1.5 rounded-full"></div>
  <div v-else class="bg-neutral-500 shadow-md shadow-neutral-600/100 w-1.5 h-1.5 rounded-full"></div>
</template>