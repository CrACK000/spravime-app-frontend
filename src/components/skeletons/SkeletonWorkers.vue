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
    <div class="p-4 relative flex gap-3.5 md:gap-4 lg:gap-5 xl:gap-6 items-center text-sm sm:text-lg">
      <div class="text-center scale-100 group-hover:scale-110 transition">
        <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-xl animate-pulse">
          <svg class="w-20 h-20 text-gray-200 dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
      <div class="w-full animate-pulse">
        <div class="loading-bar h-4 w-56 md:w-80 mb-3"></div>
        <div class="loading-bar h-2 w-48"></div>
      </div>
      <div class="ms-auto hidden md:flex items-center gap-x-6 animate-pulse">
        <div>
          <div class="loading-bar h-2.5 w-20 mb-3 mx-auto"></div>
          <div class="loading-bar h-3.5 w-10 mx-auto"></div>
        </div>
        <div>
          <div class="loading-bar h-2.5 w-20 mb-3 mx-auto"></div>
          <div class="loading-bar h-3.5 w-10 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
</template>