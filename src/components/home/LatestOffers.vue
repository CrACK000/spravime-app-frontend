<script setup lang="ts">
import {onBeforeMount, ref} from "vue"
import offer from "@/plugins/offers"
import {timeSince} from "@/plugins/functions"
import SkeletonOffers from "@/components/skeletons/SkeletonOffers.vue"
import OfferStatus from "@/components/app/OfferStatus.vue"
import Panel from "@/components/Panel.vue"

const offers = ref<Offer[]>(offer.data.offers)

onBeforeMount(async () => {
  if (!offers.value.length) {
    await offer.all()
    offers.value = offer.data.offers
  }
})
</script>

<template>
  <div class="lg:w-11/12 mx-auto">
    <div class="text-2xl font-medium mb-6 px-4 md:px-0 text-center">Najnovšie požiadavky</div>

    <panel divide="y" class="overflow-hidden text-lg">

      <!-- Loading Panel Offers -->
      <skeleton-offers :rows="6" v-if="offer.data.offers_loading" />

      <template v-for="offer in  offers.slice(0, 6)">
        <router-link :to="{ name: 'offerDetail', params: { id: offer._id } }" v-if="offer.status">
          <div class="panel-item py-4 px-4 flex gap-3 items-center">
            <div>
              <OfferStatus :status="offer.status" />
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
</template>