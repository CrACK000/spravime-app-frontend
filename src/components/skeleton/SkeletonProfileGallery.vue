<script setup lang="ts">

</script>

<template>
  <div class="text-xl font-light mb-4 px-4 md:px-0 py-2">
    <div class="loading-bar h-4 max-w-full w-44 animate-pulse"></div>
  </div>
  <div class="grid grid-cols-4 gap-3 p-3 md:rounded-lg bg-black/10">
    <div v-for="key in 4" class="flex items-center justify-center w-full h-32 rounded bg-gray-400/75 dark:bg-gray-800/50 animate-pulse" :key="key">
      <svg class="w-10 h-10 text-gray-300 dark:text-gray-700/90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/></svg>
    </div>
  </div>
</template>