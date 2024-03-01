<script setup lang="ts">
const props = defineProps({
  rows: {
    type: Number,
    default: 10
  }
})
</script>

<template>
  <div v-for="key in props.rows" :key="key">
    <div class="px-4 py-6 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50">
      <div class="loading-bar h-1.5 w-1.5 animate-pulse"></div>
      <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-3 animate-pulse"></div>
      <div class="loading-bar ms-auto h-3 w-16 animate-pulse"></div>
    </div>
  </div>
</template>