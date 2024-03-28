<script setup lang="ts">
const props = defineProps({
  rows: {
    type: Number,
    default: 5
  }
})
</script>

<template>
  <div v-for="key in props.rows" :key="key" class="flex flex-wrap gap-8 items-center p-4 bg-white/75 dark:bg-gray-800/50">
    <div class="animate-pulse">
      <div :style="{ 'width': Math.floor(Math.random()*(400-200+1)+200) + 'px' }" class="loading-bar h-3.5 max-w-full"></div>
      <div class="loading-bar h-2.5 w-36 mt-3.5"></div>
    </div>
    <div class="animate-pulse ms-auto flex flex-col justify-center items-center">
      <div class="loading-bar h-2.5 w-20"></div>
      <div class="loading-bar h-3.5 w-10 mt-3.5"></div>
    </div>
    <div class="animate-pulse flex justify-end items-center gap-3">
      <div class="loading-bar h-5 w-16"></div>
      <div class="loading-bar h-5 w-16"></div>
    </div>
  </div>
</template>