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

    <panel divide="y" v-if="!request.data.request_loading">
      <div class="py-4 px-6 font-medium uppercase">
        Informácie k požiadavke
      </div>
      <div class="p-4 md:p-6">
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
      </div>
    </panel>

    <!-- Loading panel Info -->
    <skeleton-request-information v-else />

  </transition>
</template>