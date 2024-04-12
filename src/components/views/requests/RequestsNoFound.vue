<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"

defineProps({
  count: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <panel class="py-8 px-4">
    <div class="flex gap-4 justify-center items-start">
      <svg class="w-10 h-10 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
      </svg>
      <div class="text-xl font-medium">
        Žiadne výsledky.
        <div class="text-sm font-light" v-if="!count">
          Skúste upraviť parametre filtrovania.
        </div>
        <div class="text-sm font-light" v-else>
          Zatiaľ neboli vytvorené žiadne požiadavky.
        </div>
      </div>
    </div>
  </panel>
</template>