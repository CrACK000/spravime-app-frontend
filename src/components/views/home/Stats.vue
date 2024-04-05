<script setup lang="ts">
import Container from "@/components/template/Container.vue"
</script>

<template>
  <div class="bg-gray-50 dark:bg-black/10 -skew-y-2">
    <div class="skew-y-2">
      <div class="w-full flex items-center justify-center">
        <div class="p-4 bg-pink-200 dark:bg-pink-950 border-2 border-pink-400 dark:border-pink-600 text-pink-500 dark:text-pink-600 rounded-full -mt-8 z-20">
          <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"/>
          </svg>
        </div>
      </div>
      <div class="mt-14">
        <div class="text-pink-500 dark:text-pink-700 text-lg font-medium mb-3 md:mb-6 text-center">
          Údaje na dosah
        </div>
        <div class="text-black dark:text-gray-200 text-2xl md:text-4xl font-semibold mb-6 text-center">
          Štatistika
        </div>
        <div class="bg-pink-700 w-32 h-[1px] mx-auto mb-6"></div>
        <div class="px-5 text-gray-600 dark:text-gray-400 mb-8 md:mb-16 text-center">
          Podrobne sledujeme všetky kľúčové metriky, aby sme poskytovali presný prehľad aktivity v našej komunite.
        </div>
        <Container class="pb-12 md:pb-32 lg:pb-44 pt-8 md:pt-16 lg:pt-24">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-around items-center divide-y md:divide-y-0 divide-x-0 md:divide-x divide-gray-200 dark:divide-gray-700/40">
            <div class="text-center py-8">
              <div class="text-2xl mb-6 font-light opacity-75">
                Požiadaviek
              </div>
              <div class="text-4xl md:text-5xl font-bold text-black dark:text-white">
                12 233
              </div>
            </div>
            <div class="text-center py-8">
              <div class="text-2xl mb-6 font-light opacity-75">
                Účtov
              </div>
              <div class="text-4xl md:text-5xl font-bold text-black dark:text-white">
                203 tis.
              </div>
            </div>
            <div class="text-center py-8">
              <div class="text-2xl mb-6 font-light opacity-75">
                Zhliadnutia
              </div>
              <div class="text-4xl md:text-5xl font-bold text-black dark:text-white">
                30 mil.
              </div>
            </div>
            <div class="text-center py-8">
              <div class="text-2xl mb-6 font-light opacity-75">
                Produktov
              </div>
              <div class="text-4xl md:text-5xl font-bold text-black dark:text-white">
                2 332
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>