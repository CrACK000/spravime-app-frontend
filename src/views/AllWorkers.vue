<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="lg:w-4/12">

        <form @submit.prevent="submitFilter">
          <panel divide="y">
            <div class="p-4">
              Filter
            </div>
            <div class="p-4 flex flex-col gap-4">
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
            </div>
          </panel>
        </form>

      </div>
      <div class="lg:w-8/12">
        <panel divide="y" class="overflow-hidden">
          <div class="p-4">Výsledky vyhľadávania</div>

          <template v-if="!loading" v-for="user in filteredWorkers">
            <router-link :to="{ name: 'profile', params: { id: user.id } }">
              <div class="p-4 grid grid-cols-10 gap-3.5 items-center text-sm sm:text-base bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
                <div class="col-span-2 sm:col-span-1">
                  <img :src="user.avatar" class="rounded-full w-full shadow-xl mx-auto" alt="CrACK">
                </div>
                <div class="col-span-6 sm:col-span-5">
                  <div class="font-medium mb-0.5 sm:mb-1" v-text="user.name ?? user.username"></div>
                  <div class="text-xs opacity-75 line-clamp-2" v-text="user.slogan"></div>
                </div>
                <div class="col-span-2">
                  <div class="text-sm font-semibold text-center mb-1 hidden sm:block">Hodnotenie</div>
                  <div class="text-xl font-bold text-center">
                    <div class="text-blue-500">23 %</div>
                  </div>
                </div>
                <div class="col-span-2 ms-auto hidden sm:block">
                  <button class="form-secondary-button-sm">
                    Zobraziť viac
                  </button>
                </div>
              </div>
            </router-link>
          </template>

          <!-- Loading Panel Workers -->
          <div v-for="key in 6" v-else :key="key">
            <div class="p-4 flex gap-3.5 items-center bg-white/75 dark:bg-gray-800/50">
              <div class="animate-pulse">
                <svg class="w-14 h-14 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </div>
              <div class="animate-pulse">
                <div class="loading-bar h-3 w-80 mb-3"></div>
                <div class="loading-bar h-2 w-48"></div>
              </div>
              <div class="ms-auto animate-pulse">
                <div class="loading-bar h-2.5 w-20 mb-3 mx-auto"></div>
                <div class="loading-bar h-3.5 w-10 mx-auto"></div>
              </div>
              <div class="ms-auto animate-pulse">
                <div class="loading-bar h-4 w-20"></div>
              </div>
            </div>
          </div>

        </panel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useMeta } from "vue-meta";
import {settings} from '@/plugins/config'
import Panel from "@/components/Panel.vue";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import type {Sections, Zipcodes} from "@/types/offers";
import type {User} from "@/types/users";
import categoriesData from "@/plugins/categories.json";
import axios from "axios";

useMeta({ title: 'Vyhľadať si firmu alebo spoľahlivého majstra' })

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