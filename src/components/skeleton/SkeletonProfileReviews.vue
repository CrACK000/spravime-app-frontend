<script setup lang="ts">
import Panel from "@/components/Panel.vue";

const props = defineProps({
  rows: {
    type: Number,
    default: 3
  }
})
</script>

<template>
  <div class="text-xl font-light mb-4 px-4 md:px-0 py-2">
    <div class="loading-bar h-4 max-w-full w-32 animate-pulse"></div>
  </div>
  <panel divide="y">
    <div v-for="key in props.rows" class="flex gap-4 p-5 animate-pulse" :key="key">
      <div>
        <svg class="w-10 h-10 xs:w-14 xs:h-14 text-gray-300 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
      </div>
      <div>
        <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-32 mb-2"></div>
        <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-40 mb-5 inline-block me-5"></div>
        <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-32 mb-5 inline-block me-5"></div>
        <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-20 mb-5 inline-block"></div>
        <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[650px] mb-3"></div>
        <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[520px] mb-3"></div>
        <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[390px] mb-3"></div>
      </div>
    </div>
  </panel>
</template>