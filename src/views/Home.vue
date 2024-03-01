<script setup lang="ts">
import {onMounted} from 'vue'
import {useMeta} from 'vue-meta'
import Status from "@/components/OfferStatus.vue";
import store from "@/plugins/offers";
import SkeletonOffers from "@/components/skeleton/SkeletonOffers.vue";
import Panel from "@/components/Panel.vue";
import {timeSince} from "@/plugins/functions";
import TopProfilesPanel from "@/components/TopProfilesPanel.vue";
import panel from "@/plugins/panels";

useMeta({ title: 'Nestrácajte čas s hľadaním' })

onMounted(() => {
  store.fetchOffers()
  panel.fetchTopProfiles()
})
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">

    <div class="grid grid-cols-11 items-center gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 lg:gap-y-20 xl:gap-y-44 my-10">
      <div class="col-span-11">
        <div class="bg-gradient-to-bl from-blue-600 to-indigo-500 dark:from-blue-600/75 dark:to-indigo-500/75 to-75% text-white md:rounded-3xl p-16 shadow-xl md:w-11/12 lg:w-10/12 mx-auto">
          <div class="drop-shadow font-light text-lg lg:text-3xl mb-6 text-center">
            <span class="font-semibold">Spravime</span> to spoločne!
          </div>
          <div class="drop-shadow font-light lg:text-xl opacity-75 text-center">
            Naša platforma umožňuje obyčajným ľuďom podať požiadavky na rôzne služby, od vykopávania základov po remeselné
            práce. Pre firmy a profesionálov je to príležitosť reagovať na tieto požiadavky a získať prácu.
            Spolu vytvárame spoľahlivú a efektívnu komunitu pre všetky vaše potreby.
          </div>
        </div>
      </div>
      <div class="col-span-11">
        <div class="grid grid-cols-3 justify-around items-center divide-x divide-gray-200 dark:divide-gray-700/40">
          <div class="text-center my-5">
            <div class="text-2xl mb-6 font-light opacity-75">
              Požiadaviek
            </div>
            <div class="text-5xl font-bold text-black dark:text-white">
              12 233
            </div>
          </div>
          <div class="text-center my-5">
            <div class="text-2xl mb-6 font-light opacity-75">
              Účtov
            </div>
            <div class="text-5xl font-bold text-black dark:text-white">
              203 tis.
            </div>
          </div>
          <div class="text-center my-5">
            <div class="text-2xl mb-6 font-light opacity-75">
              Zhliadnutia
            </div>
            <div class="text-5xl font-bold text-black dark:text-white">
              30 mil.
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-11 md:col-span-7">
        <div class="relative bg-gradient-to-bl from-blue-600 to-indigo-500 dark:from-blue-600/75 dark:to-indigo-500/75 to-75% text-white md:rounded-3xl p-16 shadow-xl overflow-hidden">
          <div class="text-2xl lg:text-4xl font-semibold mb-5 drop-shadow flex gap-4 items-center justify-center">
            <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
            </svg>

            <div class="mt-1">Vaše hodnotenie má význam!</div>
          </div>
          <div class="drop-shadow font-light lg:text-xl opacity-75 text-center">
            Vaša spätná väzba je kľúčová. Po vykonaní prác môžete ohodnotiť hviezdičkami, odporučiť a recenzovať firmu alebo majstra.
            Pomáhate tým budovať spoľahlivú komunitu a zlepšovať výber.
          </div>
          <div class="absolute top-1/2 -translate-y-1/2 -left-14 rotate-45 opacity-5">
            <svg class="w-60 h-60" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="col-span-11 md:col-span-4">
        <top-profiles-panel/>
      </div>
      <div class="col-span-11">

        <div class="lg:w-11/12 mx-auto">
          <div class="text-2xl font-medium mb-6 px-4 md:px-0 text-center">Najnovšie požiadavky</div>

          <panel divide="y" class="overflow-hidden text-lg">

            <!-- Loading Panel Offers -->
            <skeleton-offers :rows=6 v-if="store.state.offers_loading" />

            <template v-for="offer in store.state.offers.slice(0, 6)">
              <router-link :to="{ name: 'offerDetail', params: { id: offer.id } }" v-if="offer.status">
                <div class="panel-item py-4 px-4 flex gap-3 items-center">
                  <div>
                    <Status :status="Boolean(offer.status)" />
                  </div>
                  <div>
                    {{ offer.title }} <i class="fa-solid fa-grip-lines-vertical mx-2 opacity-30"></i> <span class="text-sm">{{ offer.address }}</span>
                  </div>
                  <div class="ms-auto text-sm opacity-50">
                    {{ timeSince(offer.created_at) }}
                  </div>
                </div>
              </router-link>
            </template>

          </panel>

          <div class="font-medium text-sm mt-6 px-4 md:px-0">
            <router-link :to="{ name: 'offers' }" class="link flex items-center gap-1.5 justify-center">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1h3m0 3h6m-3 5h3m-6 0h0m3 4h3m-6 0h0m1-13v4h4V3h-4Z"/>
              </svg>
              Zobraziť všetky
            </router-link>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>