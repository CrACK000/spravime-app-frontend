<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import { useMeta } from "vue-meta";
import Panel from "@/components/Panel.vue";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import axios from "axios";
import SkeletonWorkers from "@/components/skeletons/SkeletonWorkers.vue";
import Nickname from "@/components/app/Nickname.vue";
import AverageRating from "@/components/app/AverageRating.vue";
import PanelFilter from "@/components/PanelFilter.vue";

useMeta({ title: 'Vyhľadať si firmu alebo spoľahlivého majstra' })

const auth = inject<Auth>('auth');
const loggedIn = ref(auth?.loggedIn as boolean)

const form = ref<any>({
  search: '',
  type: 'none',
  section: 0,
  address: '',
});

const workers = ref<User[]>([])
const filteredWorkers = ref<User[]>([])
const loading = ref(false)

const sections = ref<Sections[]>(categoriesData.sections);
const slovakData = ref<Zipcodes[]>(skZipcodes);

const removeDiacritics = (str: any) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const submitFilter = () => {
  const { search, type, section, address } = form.value;

  const searchFragments = search.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from search
  const addressFragments = address.toLowerCase().split(' ').map(removeDiacritics); // Remove diacritics from address

  filteredWorkers.value = workers.value.filter((worker: any) => {

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

const fetchWorkers = async () => {
  loading.value = true;

  await axios.get(`${settings.backend}/api/workers`, { withCredentials: true })
    .then(response => {
      workers.value = response.data
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  await fetchWorkers()
  filteredWorkers.value = workers.value;
})
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="grid grid-cols-12 gap-12">
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-8">

        <PanelFilter :submit="submitFilter" :keyup="submitFilter">
          <div class="relative">
            <input type="search" class="input w-full ps-9" v-model="form.search" placeholder="Meno, názov firmy alebo kľúčové slová">
            <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
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
          <div class="relative">
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
          <div class="flex justify-between items-end">
            <div class="w-52 font-medium text-xs leading-none mb-2">
              Výsledky: {{ filteredWorkers.length }}
            </div>
            <button class="form-secondary-button-sm" type="submit">
              <i class="fa-solid fa-filter me-3 opacity-50"></i> Filtrovať
            </button>
          </div>
        </PanelFilter>

      </div>
      <div class="col-span-12 lg:col-span-8">

        <div class="bg-gradient-to-bl from-blue-200/10 to-blue-200/40 dark:to-blue-500/20 dark:from-blue-500/5 text-blue-600 dark:text-blue-400 md:rounded-2xl p-6 mb-6">
          <div class="font-medium mb-1">
            Potrebujete oživiť svoju kúpeľňu?
          </div>
          <div class="text-sm">
            Zverte svoje očakávania nám! Sme tu, aby sme vám pomohli nájsť ideálneho partnera pre váš projekt.
            Nech už chcete podať požiadavku alebo vyhľadať skúsenú firmu, ktorá sa špecializuje na vaše potreby, sme tu
            pre vás.
          </div>
        </div>

        <panel divide="y" class="overflow-hidden">
          <div class="p-4 font-medium uppercase">Výsledky vyhľadávania</div>

          <!-- Loading Panel Workers -->
          <skeleton-workers v-if="loading" />

          <router-link v-else-if="filteredWorkers.length" v-for="user in filteredWorkers" :to="{ name: 'profile', params: { id: user.id } }">
            <div class="panel-item p-4 grid grid-cols-10 gap-3.5 items-center text-sm sm:text-lg">
              <div class="col-span-2 sm:col-span-1">
                <img :src="user.avatar" class="rounded-full w-full shadow-xl mx-auto" :alt="user.name ?? user.username">
              </div>
              <div :class="[user.count_reviews ? 'col-span-6 sm:col-span-5' : 'col-span-8 sm:col-span-7']">
                <nickname :nickname="user.name ?? user.username" :verify="user.verify" class="mb-0.5 sm:mb-1 font-medium" />
                <div class="text-xs opacity-75 line-clamp-2" v-text="user.slogan"></div>
              </div>
              <div class="col-span-2" v-if="user.count_reviews">
                <div class="text-sm font-semibold text-center mb-1 hidden sm:block">Hodnotenie</div>
                <div class="text-xl font-bold text-center">
                  <average-rating :rating="Number(user.average_rating)"/>
                </div>
              </div>
              <div class="col-span-2 ms-auto hidden sm:block">
                <button type="button" class="form-secondary-button-sm">
                  Zobraziť viac
                </button>
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
  </div>
</template>