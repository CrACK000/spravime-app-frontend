<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useMeta} from 'vue-meta';
import Panel from "@/components/Panel.vue";
import Status from "@/components/app/OfferStatus.vue";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import store from "@/plugins/offers";
import SkeletonOffers from "@/components/skeletons/SkeletonOffers.vue";
import Container from "@/components/Container.vue";
import PanelFilter from "@/components/PanelFilter.vue";

useMeta({ title: 'Dostupné požiadavky' });

const form = ref<any>({
  search: '',
  section: 0,
  category: 0,
  address: '',
});
const filteredOffers = ref<Offer[]>([]);
const filteredResult = ref<boolean>(false)
const filteredLoading = ref<boolean>(true)

const slovakData = ref<Zipcodes[]>(skZipcodes);
const sections = ref<Sections[]>(categoriesData.sections);
const categories = ref<Categories[]>(categoriesData.categories);

const submitFilter = () => {
  const { search, address, section, category } = form.value;

  filteredResult.value = form.value.search.length || (form.value.section !== 0) || (form.value.category !== 0) || form.value.search.length;

  if (!search && !address && !section && !category) {
    filteredOffers.value = store.state.offers;
    return;
  }

  const searchFragments = search.toLowerCase().split(' ');
  const addressFragments = address.toLowerCase().split(' ');

  filteredOffers.value = store.state.offers.filter((offer: any) => {
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

const loadFilteredOffers = () => {
  filteredOffers.value = store.state.offers
  if (filteredOffers.value.length){
    filteredLoading.value = false
  }
}

onMounted(async () => {
  await store.fetchOffers()
  loadFilteredOffers()
});
</script>

<template>
  <Container>
    <div class="grid grid-cols-12 gap-12">

      <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <PanelFilter :submit="submitFilter" :keyup="submitFilter">
          <div class="relative">
            <input type="search" v-model="form.search" class="input w-full ps-9" placeholder="Hľadáte ?">
            <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
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
        </PanelFilter>
      </div>

      <div class="col-span-12 lg:col-span-8">

        <div class="bg-gradient-to-bl from-blue-200/10 to-blue-200/40 dark:to-blue-500/20 dark:from-blue-500/5 text-blue-600/60 dark:text-blue-400/60 md:rounded-2xl p-6 mb-6">
          <div class="font-medium mb-1">
            Pracovné príležitosti na mieru!
          </div>
          <p class="text-sm">
            V našom zozname požiadaviek nájdete svoj ideálny projekt. S filtrovaním môžete nájsť prácu presne
            podľa vašich predstáv, bez ohľadu na oblasť. Objavujte nové možnosti ešte dnes!
          </p>
        </div>

        <panel divide="y" class="overflow-hidden">

          <div class="p-4 font-medium uppercase">Výsledky vyhľadávania</div>

          <!-- Loading Panel Offers -->
          <skeleton-offers :rows=15 v-if="filteredLoading || store.state.offers_loading" />

          <router-link
            v-else-if="filteredOffers.length"
            v-for="offer in filteredOffers"
            :to="{ name: 'offerDetail', params: { id: offer.id } }"
          >
            <div class="panel-item py-4 px-4 flex gap-3 items-center">
              <div>
                <Status :status="Boolean(offer.status)" />
              </div>
              <div>
                {{ offer.title }} <i class="fa-solid fa-grip-lines-vertical mx-2 opacity-30"></i> <span class="text-sm">{{ offer.address }}</span>
              </div>
            </div>
          </router-link>

          <div v-else class="py-8 px-4 flex gap-4 justify-center items-start bg-white/75 dark:bg-gray-800/50">
            <svg class="w-6 h-6 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
            <div class="text-xl font-light">
              Žiadne výsledky.
              <div class="text-sm opacity-75" v-if="filteredResult">
                Skúste upraviť parametre filtrovania.
              </div>
              <div class="text-sm opacity-75" v-else>
                Zatiaľ neboli vytvorené žiadne požiadavky.
              </div>
            </div>
          </div>

        </panel>

      </div>
    </div>
  </Container>
</template>