<script setup lang="ts">
import StatsHead from "@/components/account/stats/StatsHead.vue"
import StatsItemOffer from "@/components/account/stats/StatsItemOffer.vue"
</script>

<template>
  <StatsHead>Štatistika ponúk</StatsHead>

  <div class="col-span-12 flex flex-col gap-y-0.5 md:gap-y-4">

    <StatsItemOffer v-for="offer in [4,5]" :offer-id="String(offer)" />

    <div class="mt-6 mb-6 md:mb-0">
      <button type="button" class="link flex items-center mx-auto gap-x-1 text-sm font-medium">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14-4-4m4 4 4-4"/>
        </svg>
        Zobraziť viac
      </button>
    </div>

  </div>
</template>