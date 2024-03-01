<script setup lang="ts">
import {formatIsoDate, timeSince} from "@/plugins/functions";
import store from "@/plugins/offers";
import Panel from "@/components/Panel.vue";
import SkeletonOfferInformation from "@/components/skeleton/SkeletonOfferInformation.vue";
import Nickname from "@/components/Nickname.vue";
</script>

<!--
  @todo ukazuje chybu
-->

<template>
  <transition name="fade">

    <panel divide="y" v-if="!store.state.offer_loading">
      <div class="py-4 px-6 font-medium uppercase">
        Informácie k požiadavke
      </div>
      <div class="p-6">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
          <li class="flex justify-between p-2">
            <span>Vytvoril</span>
            <div>
              <router-link :to="{ name: 'profile' , params: { id: store.state.offer?.author_id }}" class="link" :class="{ 'font-medium': store.state.offer?.author_verify }">
                <nickname :nickname="store.state.offer?.author_name ? store.state.offer?.author_name : store.state.offer?.author_username" :verify="store.state.offer?.author_verify" />
              </router-link>
            </div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Sekcia</span>
            <div v-text="store.state.offer?.section_title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Kategória</span>
            <div v-text="store.state.offer?.category_title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Vytvorené</span>
            <div v-text="timeSince(store.state.offer?.created_at)" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <div>{{ store.state.offer?.status ? 'Aktualne do' : 'Uzavreté dňa' }}</div>
            <div v-text="formatIsoDate(store.state.offer?.closed_at)" class="text-end"></div>
          </li>
          <template v-if="store.state.offer?.time_range">
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <span>Začiatok prác</span>
              <div v-text="formatIsoDate(store.state.offer?.start_at)" class="text-end"></div>
            </li>
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <div>Koniec prác</div>
              <div v-text="formatIsoDate(store.state.offer?.end_at)" class="text-end"></div>
            </li>
          </template>
        </ul>
      </div>
    </panel>

    <!-- Loading panel Info -->
    <skeleton-offer-information v-else />

  </transition>
</template>