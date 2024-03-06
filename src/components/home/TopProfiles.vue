<script setup lang="ts">
import {onBeforeMount, ref} from "vue"
import account from "@/plugins/account"
import Nickname from "@/components/app/Nickname.vue"
import Panel from "@/components/Panel.vue"
import SkeletonTopProfilesPanel from "@/components/skeletons/SkeletonTopProfilesPanel.vue"
import AverageRating from "@/components/app/AverageRating.vue"

const topAccounts = ref<any>(account.data.accounts)

onBeforeMount(async () => {
  if (!topAccounts.value.length) {
    await account.all()
    topAccounts.value = account.data.accounts.slice(0, 5)
  }
})

</script>

<template>
  <panel divide="y" class="overflow-hidden" v-if="!account.data.accounts_loading">
    <router-link v-for="profile in topAccounts" :to="{ name: 'profile', params: { id: profile._id }}" class="panel-item flex items-center gap-4 p-4" :key="profile._id">
      <div class="w-14">
        <img :src="profile.avatar" class="w-full rounded-full" :alt="profile.username" />
      </div>
      <div class="font-medium truncate w-full">
        <nickname :nickname="profile.profile.name ?? profile.username" :verify="profile.verify" />
      </div>
      <div class="ms-auto text-center">
        <div class="text-2xl font-bold text-center">
          <!--<average-rating :rating="Number(profile.average_rating)"/>-->
        </div>
      </div>
    </router-link>
  </panel>
  <panel v-else divide="y" class="overflow-hidden">
    <skeleton-top-profiles-panel/>
  </panel>
</template>