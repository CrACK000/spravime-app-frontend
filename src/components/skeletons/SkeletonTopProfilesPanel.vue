<script setup lang="ts">
const props = defineProps({
  rows: {
    type: Number,
    default: 4
  }
})
</script>

<template>
  <div v-for="key in props.rows" :key="key">
    <div class="flex items-center gap-4 p-4 bg-white/75 dark:bg-gray-800/50">
      <div class="animate-pulse w-14">
        <svg class="w-full text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
      </div>
      <div class="animate-pulse w-full">
        <div :style="{ 'width': Math.floor(Math.random()*(200-100+1)+100) + 'px' }" class="loading-bar h-3.5 animate-pulse"></div>
      </div>
      <div class="ms-auto animate-pulse">
        <div class="loading-bar h-3.5 w-12 my-2 mx-auto"></div>
      </div>
    </div>
  </div>
</template>