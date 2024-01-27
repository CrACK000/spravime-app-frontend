<template>
  <div class="fixed top-28 bottom-0 right-0 w-full lg:w-[800px] bg-white dark:bg-gray-900 shadow-xl rounded-t-xl lg:rounded-t-none lg:rounded-tl-xl overflow-hidden" v-if="true">
    <div class="flex flex-col h-full divide-y divide-gray-200 dark:divide-gray-700/40 dark:bg-gray-800/80">
      <div class="py-4 px-5 flex justify-between items-center">
        <div>
          Úprava požiadavky: <span class="tracking-widest ms-2 font-medium">#{{ props.offerId }}</span>
        </div>
        <button v-tooltip.left="'Zatvoriť'" @click="" class="text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 focus:outline-none rounded-lg p-2.5 transition duration-100">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
      <div class="h-full relative overflow-y-auto mb-16 divide-y divide-gray-200 dark:divide-gray-700/40">

        <panel-form>
          <div class="mb-10">
            <label class="mb-1 block" for="title">Názov požiadavky</label>
            <input type="text" class="input w-full" v-model="form.title" id="title" placeholder="Požiadavka na..." required>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <div class="col-span-1">
              <label class="mb-1 block" for="section">Sekcia</label>
              <select class="input w-full" v-model="form.section" id="section">
                <option value="0" class="text-gray-500">Vyberte sekciu</option>
                <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
              </select>
            </div>
            <div v-if="form.section != 0" class="col-span-1">
              <label class="mb-1 block" for="category">Kategórie</label>
              <select class="input w-full" v-model="form.category" id="category">
                <option v-for="category in filteredCategories" :value="category.id">{{ category.title }}</option>
              </select>
            </div>
          </div>
        </panel-form>
        <panel-form>
          <div>
            <div class="flex flex-nowrap border-b border-gray-300 dark:border-gray-700/40 bg-gradient-to-t from-gray-200 dark:from-gray-800 to-75% to-transparent -mx-4 xs:-mx-6 sm:-mx-0 mb-5">
              <button type="button" @click="addressMode('address')" class="px-3 py-1.5" :class="{'text-blue-500 bg-blue-500/10 rounded-t': address_mode === 'address'}">
                Miesto práce
              </button>
              <button type="button" @click="addressMode('route')" class="px-3 py-1.5" :class="{'text-blue-500 bg-blue-500/10 rounded-t': address_mode === 'route'}">
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
                  <input type="text" list="addressData" class="input w-full" id="from_where" v-model="from_where" @change="foo" placeholder="Mesto alebo PSČ">
                </div>
                <div>
                  <label class="mb-1 block" for="to">Kam</label>
                  <input type="text" list="addressData" class="input w-full" id="to" v-model="to" @change="foo" placeholder="Mesto alebo PSČ">
                </div>
              </div>
            </div>
            <datalist id="addressData">
              <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
            </datalist>
          </div>
        </panel-form>

        <panel-form>
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

      </div>
      <panel-form-actions class="absolute bottom-0 inset-x-0 h-16 px-5">
        <template #left></template>
        <template #right>
          <button class="form-button-sm">Uložiť</button>
        </template>
      </panel-form-actions>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import PanelForm from "@/components/PanelForm.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import type {Sections, Categories, Zipcodes} from "@/types/offers";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import {settings} from "@/plugins/config";

const props = defineProps({
  offerId: Number
})

const offerData = async () => {
  await axios.get(`${settings.backend}/api/offers/${props.offerId}`, { withCredentials: true })
    .then(response => {
      form.value = {
        title: response.data.title,
        address: response.data.address,
        section: 0,
        category: 0,
        description: response.data.description,
        time_range: false,
        start_at: '2023-12-06T02:36',
        end_at: 'desc',
      };
    })
};

const form = ref<any>({
  title: '',
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

const filteredCategories = computed(() => {
  if (form.value.section === 0) return [];
  return categories.value.filter((category: Categories) => category.section_id === form.value.section);
});
const foo = () => {
  form.value.address = from_where.value + ' - ' + to.value;
};
const addressMode = (input: string) => {
  address_mode.value = input
  form.value.address = ''
  from_where.value = ''
  to.value = ''
};

onMounted(() => {
  offerData()
})

</script>