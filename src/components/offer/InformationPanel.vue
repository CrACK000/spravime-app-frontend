<script setup lang="ts">
import {formatIsoDate, timeSince} from "@/plugins/functions"
import offer from "@/plugins/offers"
import Panel from "@/components/Panel.vue"
import SkeletonOfferInformation from "@/components/skeletons/SkeletonOfferInformation.vue"
import Nickname from "@/components/app/Nickname.vue"
import categories from "@/plugins/data/categories.json"

const Categories = categories.categories
const Sections = categories.sections

</script>

<template>
  <transition name="fade">

    <panel divide="y" v-if="!offer.data.offer_loading">
      <div class="py-4 px-6 font-medium uppercase">
        Informácie k požiadavke
      </div>
      <div class="p-6">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
          <li class="flex justify-between p-2">
            <span>Vytvoril</span>
            <div>
              <router-link :to="{ name: 'profile' , params: { id: offer.data.offer?.author._id }}" class="link" :class="{ 'font-medium': offer.data.offer?.author.verify }">
                <nickname :nickname="`${offer.data.offer?.author.profile.name?.length ? offer.data.offer?.author.profile.name : offer.data.offer?.author.username}`" :verify="offer.data.offer?.author.verify" />
              </router-link>
            </div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Sekcia</span>
            <div v-text="Sections.find(section => section.id === offer.data.offer?.section)?.title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Kategória</span>
            <div v-text="Categories.find(category => category.id === offer.data.offer?.category)?.title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Vytvorené</span>
            <div v-text="timeSince(String(offer.data.offer?.created_at))" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <div>{{ offer.data.offer?.status ? 'Aktualne do' : 'Uzavreté dňa' }}</div>
            <div v-text="formatIsoDate(String(offer.data.offer?.closed_at))" class="text-end"></div>
          </li>
          <template v-if="offer.data.offer?.time_range">
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <span>Začiatok prác</span>
              <div v-text="formatIsoDate(offer.data.offer?.time_range.start_at)" class="text-end"></div>
            </li>
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <div>Koniec prác</div>
              <div v-text="formatIsoDate(offer.data.offer?.time_range.end_at)" class="text-end"></div>
            </li>
          </template>
        </ul>
      </div>
    </panel>

    <!-- Loading panel Info -->
    <skeleton-offer-information v-else />

  </transition>
</template>