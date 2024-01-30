<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="bg-gradient-to-bl from-blue-600 to-indigo-500 dark:from-blue-600/75 dark:to-indigo-500/75 to-75% text-white md:rounded-3xl p-10 md:p-14 flex flex-col lg:flex-row items-end justify-between gap-10 mb-28 w-full xl:w-11/12 mx-auto">
      <div class="w-full lg:w-auto">
        <div class="text-3xl lg:text-4xl font-semibold mb-5 drop-shadow">Vyskúšate to snami !</div>
        <p class="max-w-lg drop-shadow font-light lg:text-lg opacity-75">Get started with a collection of 481 free and open-source SVG icons compatible with Flowbite and Tailwind CSS based on solid and outline styles with React (JSX) and Figma support.</p>
      </div>
      <div class="w-full lg:w-auto">
        <router-link :to="{ name: 'offerAdd' }" class="flex gap-3 items-center justify-center lg:justify-start drop-shadow text-lg py-3 px-4 bg-white/20 rounded-xl hover:bg-white/30 transition font-light">
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Pridať požiadavku
        </router-link>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="lg:w-8/12">

        <div class="text-xl font-light mb-6 px-4 md:px-0">Najnovšie požiadavky</div>

        <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

          <!-- Loading Panel Offers -->
          <div v-for="key in 10" v-if="loading" :key="key">
            <div class="p-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50 ">
              <div class="loading-bar h-1.5 w-1.5 animate-pulse"></div>
              <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-3 animate-pulse"></div>
              <div class="loading-bar ms-auto h-3 w-16 animate-pulse"></div>
            </div>
          </div>

          <template v-for="offer in offers.slice(0, 10)">
            <router-link :to="{ name: 'offerDetail', params: { id: offer.id } }" v-if="offer.status">
              <div class="py-3 px-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition">
                <Status :status="offer.status" />
                <div>
                  {{ offer.title }} <i class="fa-solid fa-grip-lines-vertical mx-2 opacity-30"></i> <span class="text-sm">{{ offer.address }}</span>
                </div>
                <div class="ms-auto">
                  <button class="form-secondary-button-sm">Zobraziť</button>
                </div>
              </div>
            </router-link>
          </template>

        </div>
      </div>
      <div class="lg:w-4/12">

        <div class="text-xl font-light mb-6 px-4 md:px-0">Najaktívnejšie Firmy & Živnostníci</div>

        <panel class="p-5">
          asd
        </panel>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useMeta} from 'vue-meta'
import axios from "axios";
import {settings} from '@/plugins/config'
import Status from "@/components/OfferStatus.vue";
import type {Offer} from "@/types/offers";
import Panel from "@/components/Panel.vue";

useMeta({ title: 'Nestrácajte čas s hľadaním' })

const offers = ref<Offer[]>([])
const loading = ref(false)

const fetchOffers = async () => {
  loading.value = true

  axios.get(`${settings.backend}/api/offers`, { withCredentials: true })
    .then(response => {
      offers.value = response.data
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(fetchOffers)
</script>