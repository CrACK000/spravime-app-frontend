<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  side: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button type="button" class="text-gray-300 hover:text-white disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-x-1 px-4 py-3 text-sm">
    <svg v-if="side === 'left'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
    </svg>
    {{ text }}
    <svg v-if="side === 'right'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
    </svg>
  </button>
</template>