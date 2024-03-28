<script setup lang="ts">
import {onMounted, ref} from "vue"
import { useMeta } from "vue-meta"
import account from "@/plugins/account"
import Panel from "@/components/template/Panel.vue"
import skZipcodes from "@/plugins/zipcodes/sk.json"
import categoriesData from "@/plugins/data/categories.json"
import SkeletonWorkers from "@/components/skeletons/SkeletonWorkers.vue"
import Nickname from "@/components/app/Nickname.vue"
import AverageRating from "@/components/app/AverageRating.vue"
import PanelFilter from "@/components/template/PanelFilter.vue"
import Avatar from "@/components/app/Avatar.vue"
import Container from "@/components/template/Container.vue"

useMeta({ title: 'Vyhľadať si firmu alebo spoľahlivého majstra' })

const form = ref<any>({
  search: '',
  type: 'none',
  section: 0,
  address: '',
})
const filteredWorkers = ref<User[]>([])

const sections = ref<Sections[]>(categoriesData.sections)
const slovakData = ref<Zipcodes[]>(skZipcodes)

const removeDiacritics = (str: any) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const submitFilter = () => {
  const { search, type, section, address } = form.value;

  const searchFragments = search.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from search
  const addressFragments = address.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from address

  filteredWorkers.value = account.data.accounts.filter((worker: any) => {

    const usernameLowerCased = (removeDiacritics(worker.username ?? "")).toLowerCase(); // username
    const emailLowerCased = (removeDiacritics(worker.email ?? "")).toLowerCase(); // email
    const nameLowerCased = (removeDiacritics(worker.name ?? "")).toLowerCase(); // Convert to lower case and remove diacritics from name
    const descriptionLowerCased = (removeDiacritics(worker.description ?? "")).toLowerCase(); // Same for description
    const sloganLowerCased = (removeDiacritics(worker.slogan ?? "")).toLowerCase(); // Same for slogan
    const addressLowerCased = (removeDiacritics(worker.address ?? "")).toLowerCase(); // Same for address

    const isSearchMatch = searchFragments.some((fragment: any) =>
      usernameLowerCased.includes(fragment) ||
      emailLowerCased.includes(fragment) ||
      nameLowerCased.includes(fragment) ||
      descriptionLowerCased.includes(fragment) ||
      sloganLowerCased.includes(fragment)
    );

    const isAddressMatch = addressFragments.some((fragment: any) => addressLowerCased.includes(fragment));
    const isSectionMatch = section == 0 || (worker.sections ?? []).includes(section);
    const isTypeMatch = type === 'none' || worker.type === type;

    return isSearchMatch && isAddressMatch && isSectionMatch && isTypeMatch;
  });
}

onMounted(async () => {
  if (!filteredWorkers.value.length) {
    await account.all()
    filteredWorkers.value = account.data.accounts
  }
})
</script>

<template>
  <Container>
    <div class="grid grid-cols-12 gap-y-6 lg:gap-y-8">

      <div class="col-span-12 bg-gradient-to-bl from-blue-200/10 to-blue-200/40 dark:to-blue-500/20 dark:from-blue-500/5 text-blue-600 dark:text-blue-400/75 md:rounded-2xl p-6">
        <div class="font-medium text-lg mb-3 flex items-center gap-x-2">
          <svg class="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          </svg>
          Potrebujete oživiť svoju kúpeľňu?
        </div>
        <p>
          Zverte svoje očakávania nám! Sme tu, aby sme vám pomohli nájsť ideálneho partnera pre váš projekt.
          Nech už chcete podať požiadavku alebo vyhľadať skúsenú firmu, ktorá sa špecializuje na vaše potreby, sme tu
          pre vás.
        </p>
      </div>

      <div class="col-span-12 flex flex-col gap-12">
        <PanelFilter :submit="submitFilter" :keyup="submitFilter">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-5 relative">
              <input type="search" class="input w-full ps-9" v-model="form.search" placeholder="Meno, názov firmy alebo kľúčové slová">
              <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
              <div>
                <select class="input w-full" v-model="form.type">
                  <option value="none">Firmy & Majstri</option>
                  <option value="company">Firmy</option>
                  <option value="worker">Majstri</option>
                </select>
              </div>
              <div>
                <select class="input w-full" v-model="form.section">
                  <option :value="0" class="text-gray-500">Vybrať sekciu</option>
                  <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
                </select>
              </div>
            </div>
            <div class="col-span-8 lg:col-span-2 relative">
              <input type="text" list="addressData" class="input w-full ps-9" v-model="form.address" placeholder="Lokalita alebo PSČ">
              <datalist id="addressData">
                <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
              </datalist>
              <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 14h0a7 7 0 1 0-11.5 0h0l.1.3.3.3L12 21l5.1-6.2.6-.7.1-.2Z"/>
                </svg>
              </div>
            </div>
            <div class="col-span-4 lg:col-span-1">
              <button class="form-secondary-button w-full" type="submit">
                Hľadať
              </button>
            </div>
          </div>
        </PanelFilter>
      </div>

      <div class="col-span-12">
        <panel divide="y" class="overflow-hidden">
          <div class="p-4 flex justify-between items-center">
            <div class="font-medium uppercase">
              Výsledky vyhľadávania
            </div>
            <div class="text-sm">
              <small>Počet: </small>
              <span class="font-medium" v-text="filteredWorkers.length"></span>
            </div>
          </div>

          <!-- Loading Panel Workers -->
          <skeleton-workers v-if="account.data.accounts_loading" />

          <router-link v-else-if="filteredWorkers.length" v-for="user in filteredWorkers" :to="{ name: 'profile', params: { userId: user._id } }">
            <div class="panel-item p-4 flex gap-3.5 md:gap-4 lg:gap-5 xl:gap-6 items-center text-sm sm:text-lg">
              <div class="text-center">
                <Avatar :img="user.avatar" :alt="user.profile.name ?? user.username" class="mx-auto" rounded="xxl" />
              </div>
              <div class="w-full">
                <nickname :nickname="user.profile.name ?? user.username" :verify="user.verify" class="mb-0.5 font-medium" />
                <div class="text-xs sm:text-sm opacity-75 line-clamp-2" v-text="user.profile.slogan"></div>
              </div>
              <div class="ms-auto flex items-center gap-x-6" v-if="user.reviews.count_reviews">
                <div>
                  <div class="text-sm font-semibold text-center mb-1 hidden sm:block">Hodnotenie</div>
                  <div class="text-xl font-bold text-center">
                    <average-rating :rating="Number(user.reviews.average_rating)" class="justify-center"/>
                  </div>
                </div>
                <div class="hidden sm:block">
                  <div class="text-sm font-semibold text-center mb-1 whitespace-nowrap">Počet recenzií</div>
                  <div class="text-xl font-bold text-center">
                    {{ user.reviews.count_reviews }}
                  </div>
                </div>
              </div>
            </div>
          </router-link>

          <div v-else class="py-8 px-4 flex gap-4 justify-center items-start bg-white/75 dark:bg-gray-800/50">
            <svg class="w-6 h-6 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
            <div class="text-xl font-light">
              Žiadne výsledky.
              <div class="text-sm opacity-75" v-if="filteredWorkers">
                Skúste upraviť parametre filtrovania.
              </div>
              <div class="text-sm opacity-75" v-else>
                Zatiaľ neboli vytvorené žiadne firemné účty.
              </div>
            </div>
          </div>

        </panel>
      </div>

    </div>
  </Container>
</template>