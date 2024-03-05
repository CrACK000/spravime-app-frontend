<script setup lang="ts">
import panel from "@/plugins/panels";
import Nickname from "@/components/app/Nickname.vue";
import Panel from "@/components/Panel.vue";
import SkeletonTopProfilesPanel from "@/components/skeletons/SkeletonTopProfilesPanel.vue";
import AverageRating from "@/components/app/AverageRating.vue";
</script>

<template>
  <panel divide="y" class="overflow-hidden" v-if="!panel.data.loading_top_profiles">
    <router-link v-for="profile in panel.data.top_profiles" :to="{ name: 'profile', params: { id: profile.id }}" class="panel-item flex items-center gap-4 p-4" :key="profile.id">
      <div class="w-14">
        <img :src="profile.avatar" class="w-full rounded-full" :alt="profile.name" />
      </div>
      <div class="font-medium truncate w-full">
        <nickname :nickname="profile.name ?? profile.username" :verify="profile.verify" />
      </div>
      <div class="ms-auto text-center">
        <div class="text-2xl font-bold text-center">
          <average-rating :rating="Number(profile.average_rating)"/>
        </div>
      </div>
    </router-link>
  </panel>
  <panel v-else divide="y" class="overflow-hidden">
    <skeleton-top-profiles-panel/>
  </panel>
</template>