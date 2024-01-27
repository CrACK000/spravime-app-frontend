<template>
  <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

    <div class="relative flex flex-row flex-nowrap overflow-x-auto hide-scrollbar bg-gray-200/75 dark:bg-gray-900/50 w-full" ref="scrollable" @scroll="checkScroll" @wheel="onWheel">
      <template v-for="tab in tabs">
        <router-link :to="{ name: tab.name }"
           v-html="tab.title"
           class="px-5 py-3.5 w-auto hover:text-gray-950 dark:hover:text-gray-300 border-b-2 hover:border-blue-600/75 transition duration-200 whitespace-nowrap font-medium flex items-center gap-4"
           :class="[$route.name === tab.name ? 'border-blue-600 text-gray-800 dark:text-gray-300' : 'border-transparent']"></router-link>
      </template>

      <!-- Overlays -->
      <div :style="{ left: `${overlayLeft}px`, right: `${overlayRight}px`}" class="absolute flex justify-between top-0 bottom-0 w-full pointer-events-none">
        <!-- Left edge overlay -->
        <div :class="{ 'opacity-0': !showLeft }"
             class="w-32 bg-gradient-to-r from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
        <!-- Right edge overlay -->
        <div :class="{ 'opacity-0': !showRight }"
             class="w-32 bg-gradient-to-l from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
      </div>
    </div>

    <!-- Všetky -->
    <template v-if="$route.name === 'offers-all' || $route.name === 'my-offers'">
      <div v-for="i in 3" class="flex gap-3 items-center justify-between p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
        <div>
          Požiadavka na výstavbu štvorizbového bungalovu na kľúč
        </div>
        <div class="flex items-center gap-x-4">
          <div class="text-center flex flex-col justify-center items-center">
            <span class="text-xs">Zobrazenia</span>
            <div class="text-xl font-bold">12</div>
          </div>
        </div>
        <div class="flex justify-end items-center gap-3">
          <button class="form-secondary-button-sm" type="button" @click="openEditPanel = !openEditPanel">
            Upraviť
          </button>
        </div>
      </div>
    </template>

    <!-- Čakajúce na schválenie -->
    <template v-if="$route.name === 'offers-waiting'">
      <div v-for="i in 1" class="grid grid-cols-8 gap-4 items-center p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
        <div class="col-span-4 truncate">
          Požiadavka na výstavbu štvorizbového bungalovu na kľúč
          <div class="text-sm opacity-75">
            Pridané do 12.2.2024 00:00
          </div>
        </div>
        <div class="col-span-4 flex justify-end items-center gap-3">
          <span class="text-xs px-2 py-1 rounded text-amber-500 dark:text-amber-200/70 flex items-center gap-3">Čaká na schválenie <i class="fa-solid fa-hourglass-end fa-spin text-xs"></i></span>
          <router-link to="/" class="form-secondary-button-sm text-sm">Zobraziť</router-link>
          <button type="button" class="form-danger-button-sm text-sm">Odstrániť</button>
        </div>
      </div>
    </template>

    <offer-edit :offer-id="6"/>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useMeta} from "vue-meta";
import OfferEdit from "@/views/auth/offers/OfferEdit.vue";

useMeta({ title: 'Moje požiadavky' });

const tabs = ref([
  {name: 'offers-all', title: 'Všetky <span class="gg-badge">2</span>' },
  {name: 'offers-waiting', title: 'Čakajú na schválenie <span class="gg-badge">0</span>' },
]);

const showRight = ref(true);
const showLeft = ref(false);
const overlayLeft = ref(0);
const overlayRight = ref(0);
const scrollable = ref<null | HTMLDivElement>(null);

const openEditPanel = ref(false);

const showEditPanel = (offerId?: number, show?: boolean) => {
  openEditPanel.value = true
}

const checkScroll = (event?: any) => {
  const { scrollWidth, scrollLeft, clientWidth } = event.target;

  showLeft.value = scrollLeft > 0;
  showRight.value = scrollLeft + clientWidth < scrollWidth;
  overlayLeft.value = scrollLeft;
  overlayRight.value = scrollWidth - (scrollLeft + clientWidth);
}
const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (scrollable.value) {
    scrollable.value.scrollLeft += e.deltaY / 3;
  }
}
</script>