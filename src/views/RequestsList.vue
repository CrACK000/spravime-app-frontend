<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useMeta} from 'vue-meta'
import request from "@/plugins/requests"
import skZipcodes from "@/plugins/zipcodes/sk.json"
import categoriesData from "@/plugins/data/categories.json"
import SkeletonRequests from "@/components/skeletons/SkeletonRequests.vue"
import Container from "@/components/template/Container.vue"
import PanelFilter from "@/components/template/PanelFilter.vue"
import RequestsHead from "@/components/views/requests/RequestsHead.vue";
import RequestsNoFound from "@/components/views/requests/RequestsNoFound.vue"
import RequestsList from "@/components/views/requests/RequestsList.vue"
import PaginationArrow from "@/components/pagination/PaginationArrow.vue";
import PaginationPages from "@/components/pagination/PaginationPages.vue";
import PaginationContainer from "@/components/pagination/PaginationContainer.vue";
import PaginationButton from "@/components/pagination/PaginationButton.vue";

useMeta({ title: 'Dostupné požiadavky' })

const form = ref<any>({
  search: '',
  section: 0,
  category: 0,
  address: '',
})
const filteredRequests = ref<Request[]>([])

const slovakData = ref<Zipcodes[]>(skZipcodes)
const sections = ref<Sections[]>(categoriesData.sections)
const categories = ref<Categories[]>(categoriesData.categories)

const perPage = ref(30) // Počet príspevkov na stránku
const currentPage = ref(1) // Aktuálna stránka
const totalPages = ref(0) // Celkový (počet) strán

const submitFilter = () => {
  const { search, address, section, category } = form.value

  const searchFragments = search.toLowerCase().split(' ');
  const addressFragments = address.toLowerCase().split(' ');

  filteredRequests.value = request.data.requests.filter((request: any) => {
    const titleLowerCased = request.title.toLowerCase();
    const addressLowerCased = request.address.toLowerCase();

    const isTitleMatch = searchFragments.some((fragment: any) => titleLowerCased.includes(fragment));
    const isAddressMatch = addressFragments.some((fragment: any) => addressLowerCased.includes(fragment));
    const isSectionMatch = section === 0 || request.section === section;
    const isCategoryMatch = category === 0 || request.category === category;

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
})

const paginate = (items: any) => {
  totalPages.value = Math.ceil(items.length / perPage.value);
  return items.slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value);
}

onMounted(async () => {
  if (!filteredRequests.value.length) {
    await request.all()
    filteredRequests.value = request.data.requests
  }
})
</script>

<template>
  <Container>
    <div class="flex flex-col gap-y-6 lg:gap-y-8">

      <div class="flex flex-col gap-12">
        <PanelFilter :submit="submitFilter" :keyup="submitFilter">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-5 relative">
              <input type="search" v-model="form.search" class="input w-full ps-9" placeholder="Hľadáte ?">
              <div class="absolute top-1/2 -translate-y-1/2 px-2.5">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
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

      <div>
        <RequestsHead :count="filteredRequests.length"/>
        <div class="flex flex-col gap-y-3">
          <skeleton-requests :rows=15 v-if="request.data.requests_loading" />
          <RequestsList v-else-if="filteredRequests.length" :requests="paginate(filteredRequests)"/>
          <RequestsNoFound v-else :count="filteredRequests.length"/>
        </div>
      </div>

      <PaginationContainer v-if="filteredRequests.length > perPage">
        <PaginationPages>
          <PaginationArrow side="left" text="Späť" :disabled="currentPage <= 1" @click="currentPage--"/>
          <PaginationButton
            v-for="page in totalPages"
            :page="page"
            :key="page"
            :disabled="page === currentPage"
            @click="currentPage = page"
          />
          <PaginationArrow side="right" text="Ďalšie" :disabled="currentPage >= totalPages" @click="currentPage++"/>
        </PaginationPages>
      </PaginationContainer>

    </div>
  </Container>
</template>