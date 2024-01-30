<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="lg:w-4/12">
        <form @submit.prevent="submitFilter">
          <panel divide="y">
            <div class="p-4">
              Filter
            </div>
            <div class="p-4 flex flex-col gap-4">
              <div class="relative">
                <input type="search" v-model="form.search" class="input w-full ps-9" placeholder="Hľadáte ?">
                <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div :class="[form.section > 0 ? 'col-span-1' : 'col-span-2']">
                  <select class="input w-full" v-model="form.section" @change="checkSelectSection">
                    <option :value="0" class="text-gray-500">Vybrať sekciu</option>
                    <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
                  </select>
                </div>
                <div v-if="form.section > 0">
                  <select class="input w-full" v-model="form.category">
                    <option :value="0" class="text-gray-500">Vybrať kategóriu</option>
                    <option v-for="category in filteredCategories" :value="category.id">{{ category.title }}</option>
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
                  Výsledky: {{ filteredOffers.length }}
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

        <panel class="mb-5">
          <div class="p-2 ps-5 flex justify-between items-center">
            <div class="flex items-center gap-5">
              <button class="link text-sm font-bold">Najnovšie</button>
              <button class="link text-sm">Najstaršie</button>
            </div>
            <div class="flex items-center gap-2">
              <button class="form-secondary-button-sm flex items-center gap-3">
                <Status :status="true" /> Otvorené
              </button>
              <button class="form-secondary-button-sm flex items-center gap-3">
                <Status :status="false" /> Uzatvorené
              </button>
            </div>
          </div>
        </panel>

        <panel divide="y" class="overflow-hidden">
          <div class="p-4">Dostupné požiadavky</div>

          <!-- Loading Panel Offers -->
          <div v-for="key in 10" v-if="loading" :key="key">
            <div class="p-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50">
              <div class="loading-bar h-1.5 w-1.5 animate-pulse"></div>
              <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-3 animate-pulse"></div>
              <div class="loading-bar ms-auto h-3 w-16 animate-pulse"></div>
            </div>
          </div>

          <template v-else v-for="offer in filteredOffers">
            <router-link :to="{ name: 'offerDetail', params: { id: offer.id } }">
              <div class="py-3 px-4 flex gap-3 items-center bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
                <Status :status="offer.status" />
                <div>
                  {{ offer.title }} <i class="fa-solid fa-grip-lines-vertical mx-2 opacity-30"></i> <span class="text-sm">{{ offer.address }}</span>
                </div>
                <div class="ms-auto">
                  <button class="form-secondary-button-sm">Zobraziť</button>
                </div>
              </div>
            </router-link>
          </template>

        </panel>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useMeta} from 'vue-meta';
import Panel from "@/components/Panel.vue";
import Status from "@/components/OfferStatus.vue";
import {settings} from "@/plugins/config";
import type {Categories, Offer, Sections, Zipcodes} from "@/types/offers";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import axios from "axios";

useMeta({ title: 'Dostupné požiadavky' });

const offers = ref<Offer[]>([]);
const filteredOffers = ref<Offer[]>([]);
const loading = ref<boolean>(false);

const form = ref<any>({
  search: '',
  section: 0,
  category: 0,
  address: '',
});

const slovakData = ref<Zipcodes[]>(skZipcodes);
const sections = ref<Sections[]>(categoriesData.sections);
const categories = ref<Categories[]>(categoriesData.categories);

const submitFilter = () => {
  const { search, address, section, category } = form.value;
  const searchFragments = search.toLowerCase().split(' ');
  const addressFragments = address.toLowerCase().split(' ');

  filteredOffers.value = offers.value.filter((offer: any) => {
    const titleLowerCased = offer.title.toLowerCase();
    const addressLowerCased = offer.address.toLowerCase();

    const isTitleMatch = searchFragments.some((fragment: any) => titleLowerCased.includes(fragment));
    const isAddressMatch = addressFragments.some((fragment: any) => addressLowerCased.includes(fragment));
    const isSectionMatch = section === 0 || offer.section === section;
    const isCategoryMatch = category === 0 || offer.category === category;

    return isTitleMatch && isAddressMatch && isSectionMatch && isCategoryMatch;
  });
}

const checkSelectSection = () => {
  if (form.value.section! > 0) {
    form.value.category = 0
  }
}

const filteredCategories = computed(() => {
  if (form.value.section === 0) return [];
  return categories.value.filter(category => category.section_id === form.value.section);
});

const fetchOffers = async () => {
  loading.value = true

  await axios.get(`${settings.backend}/api/offers`, { withCredentials: true })
    .then(response => {
      offers.value = response.data
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  await fetchOffers();
  filteredOffers.value = offers.value;
});
</script>