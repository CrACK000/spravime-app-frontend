<script setup lang="ts">
import {nl2br} from "@/plugins/functions";
import store from "@/plugins/offers";
import Panel from "@/components/Panel.vue";
import SkeletonOfferTitleDescription from "@/components/skeleton/SkeletonOfferTitleDescription.vue";
</script>

<template>
  <transition name="fade">

    <panel divide="y" v-if="!store.state.offer_loading">
      <div class="py-4 px-6 font-medium uppercase">
        <div v-text="store.state.offer?.title"></div>
      </div>
      <div class="p-6">
        <div class="flex flex-col-reverse md:flex-row gap-4">
          <div class="md:w-8/12">
            <div class="p-3" v-html="nl2br(store.state.offer?.description)"></div>
          </div>
          <div class="md:w-4/12 flex gap-3 flex-row md:flex-col">
            <div class="w-full bg-black/5 shadow p-3 rounded">
              <div class="opacity-75 text-sm mb-2">Status</div>
              <div>
                <div v-if="store.state.offer?.status" class="text-blue-500 flex items-center gap-3 font-medium">
                  <div class="bg-blue-500 shadow-md shadow-blue-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
                  Otvorené
                </div>
                <div v-else class="text-red-500 flex items-center gap-3 font-medium">
                  <div class="bg-red-500 shadow-md shadow-red-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
                  Uzavreté
                </div>
              </div>
            </div>
            <div class="w-full bg-black/5 shadow p-3 rounded">
              <div class="opacity-75 text-sm mb-2">Miesto práce</div>
              <div v-text="store.state.offer?.address"></div>
            </div>
          </div>
        </div>
      </div>
    </panel>

    <!-- Loading panel Title&Desc -->
    <skeleton-offer-title-description v-else />

  </transition>
</template>