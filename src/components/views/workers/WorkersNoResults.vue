<script setup lang="ts">
defineProps({
  workers: {
    type: Array as () => User[],
    required: true
  }
})
</script>

<template>
  <div class="py-8 px-4 flex gap-4 justify-center items-start bg-white/75 dark:bg-gray-800/50">
    <svg class="w-6 h-6 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
    </svg>
    <div class="text-xl font-light">
      Žiadne výsledky.
      <div class="text-sm opacity-75" v-if="workers">
        Skúste upraviť parametre filtrovania.
      </div>
      <div class="text-sm opacity-75" v-else>
        Zatiaľ neboli vytvorené žiadne firemné účty.
      </div>
    </div>
  </div>
</template>