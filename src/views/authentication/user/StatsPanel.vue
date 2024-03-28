<script setup lang="ts">
import {inject, ref} from "vue"
import {useMeta} from "vue-meta"
import PanelPlus from "@/components/template/PanelPlus.vue"
import PanelGrid from "@/components/template/PanelGrid.vue"
import StatsProfile from "@/components/account/stats/StatsProfile.vue"
import StatsRequests from "@/components/account/stats/StatsRequests.vue"
import StatsOffers from "@/components/account/stats/StatsOffers.vue"
import StatsNoVerifyProfile from "@/components/account/stats/StatsNoVerifyProfile.vue"

useMeta({ title: 'Štatistika' })

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)
</script>

<template>
  <PanelGrid grid="12">

    <template v-if="!user.verify">
      <StatsProfile/>
      <StatsRequests/>
      <StatsOffers/>
    </template>

    <template v-else>
      <PanelPlus class="col-span-12 flex flex-col md:flex-row items-center justify-between gap-5">
        <div class="self-start">
          Aktivujte si našu službu <span class="font-medium text-blue-500">Plus +</span> a získajte priehľadnú štatistiku vašeho profilu a tiež všetkých požiadaviek ktoré zverejníte.
        </div>
        <router-link :to="{ name: 'user-plus' }" class="form-button-sm self-end">
          Aktivovať
        </router-link>
      </PanelPlus>
      <StatsNoVerifyProfile/>
    </template>

  </PanelGrid>
</template>