<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="lg:w-8/12">
        <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

          <!-- Loading Panel Offers -->
          <div v-for="key in 10" v-if="loading" :key="key">
            <div class="p-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50 ">
              <div class="loading-bar h-1.5 w-1.5 animate-pulse"></div>
              <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-3 animate-pulse"></div>
              <div class="loading-bar ms-auto h-3 w-16 animate-pulse"></div>
            </div>
          </div>

          <template v-for="offer in offers">
            <router-link :to="{ name: 'offerDetail', params: { id: offer.id } }">
              <div class="py-3 px-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
                <Status :status="!!offer.status" />
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
      <div class="lg:w-4/12 px-4">
        asd
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