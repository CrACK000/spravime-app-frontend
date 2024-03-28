<script setup lang="ts">
import {formatIsoDate, timeSince} from "@/plugins/functions"
import request from "@/plugins/requests"
import Panel from "@/components/template/Panel.vue"
import SkeletonRequestInformation from "@/components/skeletons/SkeletonRequestInformation.vue"
import Nickname from "@/components/app/Nickname.vue"
import categories from "@/plugins/data/categories.json"

const Categories = categories.categories
const Sections = categories.sections

</script>

<template>
  <transition name="fade">

    <panel divide="y" v-if="!request.data.request_loading">
      <div class="py-4 px-6 font-medium uppercase">
        Informácie k požiadavke
      </div>
      <div class="p-6">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
          <li class="flex justify-between p-2">
            <span>Vytvoril</span>
            <div>
              <router-link :to="{ name: 'profile', params: { userId: request.data.request?.author._id }}" class="link" :class="{ 'font-medium': request.data.request?.author.verify }">
                <nickname :nickname="`${request.data.request?.author.profile.name?.length ? request.data.request?.author.profile.name : request.data.request?.author.username}`" :verify="request.data.request?.author.verify" />
              </router-link>
            </div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Sekcia</span>
            <div v-text="Sections.find(section => section.id === request.data.request?.section)?.title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Kategória</span>
            <div v-text="Categories.find(category => category.id === request.data.request?.category)?.title" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <span>Vytvorené</span>
            <div v-text="timeSince(String(request.data.request?.created_at))" class="text-end"></div>
          </li>
          <li class="flex items-center justify-between px-2 py-2.5 pt-3">
            <div>{{ request.data.request?.status ? 'Aktualne do' : 'Uzavreté dňa' }}</div>
            <div v-text="formatIsoDate(String(request.data.request?.closed_at))" class="text-end"></div>
          </li>
          <template v-if="request.data.request?.time_range">
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <span>Začiatok prác</span>
              <div v-text="formatIsoDate(request.data.request?.time_range.start_at)" class="text-end"></div>
            </li>
            <li class="flex items-center justify-between px-2 py-2.5 pt-3">
              <div>Koniec prác</div>
              <div v-text="formatIsoDate(request.data.request?.time_range.end_at)" class="text-end"></div>
            </li>
          </template>
        </ul>
      </div>
    </panel>

    <!-- Loading panel Info -->
    <skeleton-request-information v-else />

  </transition>
</template>