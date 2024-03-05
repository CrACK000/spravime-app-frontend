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
    <div class="p-4 grid grid-cols-10 gap-3.5 items-center bg-white/75 dark:bg-gray-800/50">
      <div class="col-span-2 sm:col-span-1 animate-pulse">
        <svg class="w-full text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
      </div>
      <div class="col-span-5 sm:col-span-5 animate-pulse">
        <div class="loading-bar h-3 w-80 mb-3"></div>
        <div class="loading-bar h-2 w-48"></div>
      </div>
      <div class="col-span-2 sm:col-span-2 ms-auto animate-pulse hidden sm:block">
        <div class="loading-bar h-2.5 w-20 mb-3 mx-auto"></div>
        <div class="loading-bar h-3.5 w-10 mx-auto"></div>
      </div>
      <div class="col-span-1 sm:col-span-2 ms-auto animate-pulse hidden sm:block">
        <div class="loading-bar h-4 w-20"></div>
      </div>
    </div>
  </div>
</template>