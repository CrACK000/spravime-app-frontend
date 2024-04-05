<script setup lang="ts">
import {inject, ref} from "vue"
import TopGridItem from "@/components/template/TopGridItem.vue"

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

const dialogRef = inject('dialogRef') as { value: any }
const requestData = dialogRef.value.data.reviewData as Request

const closeDialog = (callback: any) => {
  dialogRef.value.close(callback)
}
</script>

<template>
  <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40 w-full md:w-[700px]">

    <div class="pb-4 px-4 md:px-0">
      <p class="font-medium text-lg mb-1">{{ requestData.title }}</p>
      <p class="text-sm opacity-75">Identifikačné číslo: <span class="font-medium">{{ requestData._id }}</span></p>

      <div v-if="!user.verify" class="mt-4 bg-blue-500/10 rounded-lg p-2 text-blue-500 text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Aktivujte si službu <b>Plus+</b> a získajte zľavu 25% na topovanie všetkých vašich požiadaviek.</span>
        <router-link :to="{ name: 'user-plus' }" @click="closeDialog" class="form-button-sm ms-auto">Aktivovať</router-link>
      </div>

    </div>

    <div class="grid grid-cols-12 items-center gap-x-1 md:gap-x-4 px-2 py-3.5 md:px-4 md:py-4 text-xs md:text-base text-gray-500 dark:text-gray-400">
      <div class="col-span-5 md:col-span-6 text-sm">
        Dĺžka topovania
      </div>
      <div class="col-span-2 text-center">
        <div class="text-blue-500 font-semibold">Plus+</div>
        <div class="text-xs">Zľava 25%</div>
      </div>
      <div class="col-span-2 text-center">
        <div class="text-xs md:text-sm">Základná<br>cena</div>
      </div>
    </div>

    <TopGridItem title="Topovať na 7 dní" :price="0.99">
      <button type="button" class="form-button-sm">
        Aktivovať
      </button>
    </TopGridItem>

    <TopGridItem title="Topovať na 14 dní" :price="1.49">
      <button type="button" class="form-button-sm">
        Aktivovať
      </button>
    </TopGridItem>

    <TopGridItem title="Topovať na 30 dní" :price="2.49">
      <button type="button" class="form-button-sm">
        Aktivovať
      </button>
    </TopGridItem>

    <TopGridItem title="Topovať na 60 dní" :price="4.49">
      <button type="button" class="form-button-sm">
        Aktivovať
      </button>
    </TopGridItem>

  </div>
</template>