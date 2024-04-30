<script setup lang="ts">
import {formatIsoDate, timeSince} from "@/plugins/functions"
import request from "@/plugins/requests"
import Panel from "@/components/template/Panel.vue"
import SkeletonRequestInformation from "@/components/skeletons/SkeletonRequestInformation.vue"
import Nickname from "@/components/app/Nickname.vue"
import categories from "@/plugins/data/categories.json"
import InfoPanelItem from "@/components/views/request/InfoPanelItem.vue";

const Categories = categories.categories
const Sections = categories.sections

</script>

<template>
  <transition name="fade">

    <div v-if="!request.data.request_loading">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <panel class="p-3 md:p-4">
          <div class="opacity-75 text-sm mb-2">Status</div>
          <div>
            <div v-if="request.data.request?.status" class="text-blue-500 flex items-center gap-3 font-medium">
              <div class="bg-blue-500 shadow-md shadow-blue-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
              Otvorené
            </div>
            <div v-else class="text-red-500 flex items-center gap-3 font-medium">
              <div class="bg-red-500 shadow-md shadow-red-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
              Uzavreté
            </div>
          </div>
        </panel>
        <panel class="p-3 md:p-4">
          <div class="opacity-75 text-sm mb-2">Miesto práce</div>
          <div v-text="request.data.request?.address"></div>
        </panel>
      </div>

      <panel divide="y">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">

          <InfoPanelItem title="Vytvoril">
            <router-link :to="{ name: 'profile', params: { userId: request.data.request?.author._id }}" class="link" :class="{ 'font-medium': request.data.request?.author.verify }">
              <nickname
                :nickname="`${request.data.request?.author.profile.name?.length ? request.data.request?.author.profile.name : request.data.request?.author.username}`"
                :verify="request.data.request?.author.verify"
              />
            </router-link>
          </InfoPanelItem>

          <InfoPanelItem title="Sekcia">
            {{ Sections.find(section => section.id === request.data.request?.section)?.title }}
          </InfoPanelItem>

          <InfoPanelItem title="Kategória">
            {{ Categories.find(category => category.id === request.data.request?.category)?.title }}
          </InfoPanelItem>

          <InfoPanelItem title="Vytvorené">
            {{ timeSince(String(request.data.request?.created_at)) }}
          </InfoPanelItem>

          <InfoPanelItem :title="request.data.request?.status ? 'Aktualne do' : 'Uzavreté dňa'">
            {{ formatIsoDate(String(request.data.request?.closed_at)) }}
          </InfoPanelItem>

          <template v-if="request.data.request?.time_range">
            <InfoPanelItem title="Začiatok prác">
              {{ formatIsoDate(request.data.request?.time_range.start_at) }}
            </InfoPanelItem>

            <InfoPanelItem title="Koniec prác">
              {{ formatIsoDate(request.data.request?.time_range.end_at) }}
            </InfoPanelItem>
          </template>

        </ul>
      </panel>
    </div>

    <!-- Loading panel Info -->
    <skeleton-request-information v-else />

  </transition>
</template>