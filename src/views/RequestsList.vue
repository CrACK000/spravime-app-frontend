<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useMeta} from 'vue-meta'
import request from "@/plugins/requests"
import {timeSince} from "@/plugins/functions"
import Panel from "@/components/template/Panel.vue"
import Status from "@/components/app/RequestStatus.vue"
import skZipcodes from "@/plugins/zipcodes/sk.json"
import categoriesData from "@/plugins/data/categories.json"
import SkeletonRequests from "@/components/skeletons/SkeletonRequests.vue"
import Container from "@/components/template/Container.vue"
import PanelFilter from "@/components/template/PanelFilter.vue"

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

onMounted(async () => {
  if (!filteredRequests.value.length) {
    await request.all()
    filteredRequests.value = request.data.requests
  }
})
</script>

<template>
  <Container>
    <div class="grid grid-cols-12 gap-y-6 lg:gap-y-8">

      <div class="col-span-12 bg-gradient-to-bl from-blue-200/10 to-blue-200/40 dark:to-blue-500/20 dark:from-blue-500/5 text-blue-600 dark:text-blue-400/75 md:rounded-2xl p-6">
        <div class="font-medium text-lg mb-3 flex items-center gap-x-2">
          <svg class="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"/>
          </svg>
          Pracovné príležitosti na mieru!
        </div>
        <p>
          V našom zozname požiadaviek nájdete svoj ideálny projekt. S filtrovaním môžete nájsť prácu presne
          podľa vašich predstáv, bez ohľadu na oblasť. Objavujte nové možnosti ešte dnes!
        </p>
      </div>

      <div class="col-span-12 flex flex-col gap-12">
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

      <div class="col-span-12">

        <panel divide="y" class="overflow-hidden">

          <div class="p-4 flex justify-between items-center">
            <div class="font-medium uppercase">
              Výsledky vyhľadávania
            </div>
            <div class="text-sm">
              <small>Počet: </small>
              <span class="font-medium" v-text="filteredRequests.length"></span>
            </div>
          </div>

          <!-- Loading Panel Requests -->
          <skeleton-requests :rows=15 v-if="request.data.requests_loading" />

          <router-link
            v-else-if="filteredRequests.length"
            v-for="request in filteredRequests"
            :to="{ name: 'request', params: { requestId: request._id } }"
          >
            <div class="panel-item py-4 px-4 group">
              <div class="flex flex-wrap gap-3 items-center mb-1">
                <div class="md:text-lg">{{ request.title }} <Status :status="Boolean(request.status)" class="inline-block align-middle ms-1.5"/></div>
              </div>
              <div class="opacity-60 group-hover:opacity-100 transition flex flex-wrap items-center gap-x-6 gap-y-2">
                <div class="flex items-center gap-x-0.5 text-xs font-medium">
                  <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                  {{ request.author.profile.name ?? request.author.username }}
                </div>
                <div class="flex items-center gap-x-1 text-xs font-medium">
                  <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg>
                  {{ timeSince(request.created_at) }}
                </div>
                <div class="flex items-center gap-x-1 text-xs font-medium">
                  <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11H4m15.5 5a.5.5 0 0 0 .5-.5V8a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44l-1.436-2.12a1 1 0 0 0-.828-.44H8a1 1 0 0 0-1 1M4 9v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44L9.985 8.44A1 1 0 0 0 9.157 8H5a1 1 0 0 0-1 1Z"/></svg>
                  {{ sections[request.section].title }}
                </div>
                <div class="lg:ms-auto flex items-center gap-x-1 text-sm">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 14h0a7 7 0 1 0-11.5 0h0l.1.3.3.3L12 21l5.1-6.2.6-.7.1-.2Z"/>
                  </svg>
                  {{ request.address }}
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
              <div class="text-sm opacity-75" v-if="!filteredRequests.length">
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