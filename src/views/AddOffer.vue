<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10 relative">
      <div class="lg:w-3/12 hidden lg:block">
        <div class="sticky top-0 p-4">
          <ul class="flex flex-col gap-2">
            <li v-for="tab in tabs" @click="methods.selectTab(tab.name)">
              <a :href="'#'+tab.name"
                 v-text="tab.title"
                 :class="{'tab-active': selectedTab === tab.name}"
                 class="cursor-pointer block w-full transition duration-100 px-2 py-1.5 rounded-md hover:text-blue-500 before:content-['#'] before:me-2 before:font-medium"
              ></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="lg:w-9/12">

        <form @submit.prevent="methods.createOffer" v-if="auth.loggedIn.value">
          <panel divide="y">
            <div id="rules" class="p-4 xs:p-6 md:p-10">
              <div>
                <div class="text-xl font-light mb-5">Vytvoriť novú požiadavku</div>
                <div class="text-sm mt-2">
                  <div class="mb-1">Skôr ako začneš, prečitaj si podmienky pridania požiadavky.</div>
                  <ul class="list-decimal list-inside bg-gray-100 dark:bg-gray-700/25 shadow-md text-gray-600 dark:text-gray-300/75 p-3 rounded-md">
                    <li class="mb-1 leading-tight">Každá požiadavka bude viditeľná iba 2 mesiace, po uplynutí 3 mesiacov sa požiadavka automaticky odstráni zo systému a nebude ju možne obnoviť.</li>
                    <li>Ďalšia podmienka</li>
                  </ul>
                </div>
              </div>
            </div>
            <panel-form id="info">
              <div class="mb-10">
                <label class="mb-1 block" for="title">Stručný názov požiadavky</label>
                <input type="text" class="input w-full" v-model="form.title" id="title" placeholder="Požiadavka na..." required>
                <div class="text-sm mt-2 opacity-75">
                  Príklad „<span class="italic">Požiadavka na výstavbu štvorizbového bungalovu na kľúč</span>”
                </div>
              </div>
              <div class="mb-10 grid grid-cols-2 gap-x-4 gap-y-2">
                <div class="col-span-1">
                  <label class="mb-1 block" for="section">Sekcia</label>
                  <select class="input w-full" v-model="form.section" id="section" @change="checkSelectSection">
                    <option :value="0" class="text-gray-500">Vyberte sekciu</option>
                    <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
                  </select>
                </div>
                <div v-if="form.section != 0" class="col-span-1">
                  <label class="mb-1 block" for="category">Kategórie</label>
                  <select class="input w-full" v-model="form.category" id="category">
                    <option :value="0" class="text-gray-500">Vyberte kategóriu</option>
                    <option v-for="category in filteredCategories" :value="category.id">{{ category.title }}</option>
                  </select>
                </div>
                <div class="col-span-2 text-sm opacity-75">
                  Výber kategórie pod ktorú spadá požiadavka.
                </div>
              </div>
              <div>
                <div class="flex flex-nowrap border-b border-gray-300 dark:border-gray-700/40 bg-gradient-to-t from-gray-200 dark:from-gray-800 to-75% to-transparent -mx-4 xs:-mx-6 sm:-mx-0 mb-5">
                  <button type="button" @click="methods.addressMode('address')" class="px-3 py-1.5" :class="{'text-blue-500 bg-blue-500/10 rounded-t': address_mode === 'address'}">
                    Miesto práce
                  </button>
                  <button type="button" @click="methods.addressMode('route')" class="px-3 py-1.5" :class="{'text-blue-500 bg-blue-500/10 rounded-t': address_mode === 'route'}">
                    Trasa
                  </button>
                </div>
                <div v-if="address_mode === 'address'" class="p-1">
                  <div>
                    <label class="mb-1 block" for="address">Miesto práce</label>
                    <input type="text" list="addressData" class="input w-full" v-model="form.address" id="address" placeholder="Mesto alebo PSČ">
                  </div>
                </div>
                <div v-if="address_mode === 'route'" class="p-1">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="mb-1 block" for="from_where">Odkiaľ</label>
                      <input type="text" list="addressData" class="input w-full" id="from_where" v-model="from_where" @change="methods.foo" placeholder="Bratislava">
                    </div>
                    <div>
                      <label class="mb-1 block" for="to">Kam</label>
                      <input type="text" list="addressData" class="input w-full" id="to" v-model="to" @change="methods.foo" placeholder="Košice">
                    </div>
                  </div>
                </div>
                <datalist id="addressData">
                  <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
                </datalist>
              </div>
            </panel-form>
            <panel-form id="job">
              <div v-if="!form.time_range" class="mb-10">
                <div class="mb-1">Dátum prác</div>
                <button type="button" @click="form.time_range = !form.time_range" class="form-secondary-button">
                  <i class="fa-regular fa-calendar me-1"></i> Zadať časový rozsah
                </button>
                <div class="mt-2 text-sm opacity-75">
                  Ak je potrebné požiadavku vykonať v určitom čase.
                </div>
              </div>
              <div v-if="form.time_range">
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 w-full mb-10">
                  <div>
                    <label class="mb-1 block text-end" for="start_at">Začiatok prác</label>
                    <input type="datetime-local" class="input w-full" v-model="form.start_at" id="start_at">
                  </div>
                  <div>
                    <label class="mb-1 block text-start" for="end_at">Ukončenie</label>
                    <input type="datetime-local" class="input w-full" v-model="form.end_at" id="end_at">
                  </div>
                  <div class="col-span-2 text-sm opacity-75">
                    <button type="button" @click="form.time_range = !form.time_range">Zrušiť</button>
                  </div>
                </div>
              </div>
              <div>
                <label class="mb-1 block" for="description">Informácie k požiadavke</label>
                <textarea class="input w-full" rows="8" v-model="form.description" id="description" maxlength="500"></textarea>
                <div class="mt-2 text-sm opacity-80 font-light">
                  {{ form.description.length }}/500
                </div>
              </div>
            </panel-form>
            <panel-form-actions>
              <template #left>
                <span class="opacity-75 text-sm">Vytvorením požiadavky súhlasíš s <a href="#rules" @click="methods.selectTab('rules')" class="text-gray-700 dark:text-gray-400 underline">podmienkami pridania požiadavky</a>.</span>
              </template>
              <template #right>
                <button type="submit" class="form-button">
                  <i class="fa-regular fa-square-plus fa-lg me-1"></i> Vytvoriť
                </button>
              </template>
            </panel-form-actions>
          </panel>
        </form>

        <Panel v-else class="p-10 flex items-center justify-center">
          <div class="text-2xl font-light">
            Na pridávanie požiadaviek musíš byť prihlásený.
            <div class="text-center">
              <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link> alebo
              <router-link :to="{ name: 'register' }" class="link">Vytvoriť nový účet</router-link>
            </div>
          </div>
        </Panel>

      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-active {
  background: none;
}
.tab-active:after {
  display: none;
}
</style>

<script setup lang="ts">
import {ref, computed, nextTick, inject} from 'vue';
import Panel from "@/components/Panel.vue";
import PanelForm from "@/components/PanelForm.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import type {Categories, Sections, Zipcodes} from "@/types/offers";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";

const auth = inject<any>('auth');

const form = ref<any>({
  title: 'Požiadavka na ',
  address: '',
  section: 0,
  category: 0,
  description: 'desc',
  time_range: false,
  start_at: '2023-12-06T02:36',
  end_at: 'desc',
});

const slovakData = ref<Zipcodes[]>(skZipcodes);
const sections = ref<Sections[]>(categoriesData.sections);
const categories = ref<Categories[]>(categoriesData.categories);


const address_mode = ref('address');
const from_where = ref('');
const to = ref('');
const selectedTab = ref('rules');
const tabs = [
  {name: 'rules', title: 'Pravidlá'},
  {name: 'info', title: 'Informácie'},
  {name: 'job', title: 'Práca'},
];

const checkSelectSection = () => {
  if (form.value.section! > 0) {
    form.value.category = 0
  }
}

const filteredCategories = computed(() => {
  if (form.value.section === 0) return [];
  return categories.value.filter(category => category.section_id === form.value.section);
});

if (location.hash) selectedTab.value = location.hash.replace('#', '')

const methods = {
  createOffer(){
    console.log(form)
    alert('ok')
  },
  selectTab(name: string) {
    selectedTab.value = name
    nextTick(() => {
      const element = document.getElementById(name)
      element?.scrollIntoView({ behavior: 'smooth' })
    })
  },
  foo() {
    form.value.address = from_where.value + ' - ' + to.value;
  },
  addressMode(input: string) {
    address_mode.value = input
    form.value.address = ''
    from_where.value = ''
    to.value = ''
  },
}
</script>