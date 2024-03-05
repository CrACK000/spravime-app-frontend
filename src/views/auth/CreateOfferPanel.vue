<template>
  <form @submit.prevent="submitForm" v-if="loggedIn">
    <panel divide="y">

      <div class="text-xl font-light py-4 xs:py-6 md:py-10 px-4 xs:px-6 md:px-10">Vytvoriť novú požiadavku</div>

      <panel-form>
        <div class="mb-10">
          <label class="mb-1 block" for="title">Stručný názov požiadavky</label>
          <input type="text" :class="[ getError('title') ? 'input-danger' : 'input', 'w-full']" v-model="form.title" @change="validTitle" id="title" placeholder="Požiadavka na..." required>
          <div class="text-red-500 text-sm mt-1.5" v-if="getError('title')" v-text="getError('title')"></div>
          <div class="text-sm mt-2 opacity-75">
            Príklad „<span class="italic">Požiadavka na výstavbu štvorizbového bungalovu na kľúč</span>”
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <div class="col-span-1">
            <label class="mb-1 block" for="section">Sekcia</label>
            <select :class="[ getError('section') ? 'input-danger' : 'input', 'w-full']" v-model="form.section" id="section" @change="checkSelectSection">
              <option :value="0" class="text-gray-500">Vyberte sekciu</option>
              <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
            </select>
            <div class="text-red-500 text-sm mt-1.5" v-if="getError('section')" v-text="getError('section')"></div>
          </div>
          <div v-if="form.section != 0" class="col-span-1">
            <label class="mb-1 block" for="category">Kategórie</label>
            <select :class="[ getError('category') ? 'input-danger' : 'input', 'w-full']" v-model="form.category" @change="validCategory" id="category">
              <option :value="0" class="text-gray-500">Vyberte kategóriu</option>
              <option v-for="category in filteredCategories" :value="category.id">{{ category.title }}</option>
            </select>
            <div class="text-red-500 text-sm mt-1.5" v-if="getError('category')" v-text="getError('category')"></div>
          </div>
          <div class="col-span-2 text-sm opacity-75">
            Výber kategórie pod ktorú spadá požiadavka.
          </div>
        </div>
      </panel-form>

      <panel-form>

        <div class="mb-5" v-if="showButtonSetAddress">
          <button type="button" @click="showModalAddress = !showModalAddress" class="form-secondary-button flex gap-2 items-center">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 14h0a7 7 0 1 0-11.5 0h0l.1.3.3.3L12 21l5.1-6.2.6-.7.1-.2Z"/>
            </svg>
            Nastaviť adresu
          </button>
        </div>

        <div>
          <div class="mb-1">Adresa</div>
          <div :class="[ getError('address') ? 'border-red-200 dark:border-red-700/40' : 'border-gray-200 dark:border-gray-700/40', 'p-3 border rounded-md']">
            <div v-if="form.address.length">
              <span v-text="form.address" class="font-semibold"></span> - <button type="button" @click="showModalAddress = !showModalAddress" class="link text-sm">zmeniť</button>
            </div>
            <div v-else>
              Je potrebné nastaviť adresu
            </div>
          </div>
          <div class="text-red-500 text-sm mt-1.5" v-if="getError('address')" v-text="getError('address')"></div>
        </div>

      </panel-form>

      <panel-form>
        <div v-if="!form.time_range">
          <div class="mb-1">Dátum prác</div>
          <button type="button" @click="setTimeRange" class="form-secondary-button">
            <i class="fa-regular fa-calendar me-1"></i> Zadať časový rozsah
          </button>
          <div class="mt-2 text-sm opacity-75">
            Ak je potrebné požiadavku vykonať v určitom čase.
          </div>
        </div>
        <div v-if="form.time_range">
          <div class="flex flex-col gap-5">
            <div>
              <label class="mb-1 block" for="start_at">Začiatok prác</label>
              <input type="datetime-local" :class="[ getError('start_at') ? 'input-danger' : 'input', 'w-full']" v-model="form.start_at" @change="validStartAt" id="start_at">
              <div class="text-red-500 text-sm mt-1.5" v-if="getError('start_at')" v-text="getError('start_at')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="end_at">Ukončenie prác</label>
              <input type="datetime-local" :class="[ getError('end_at') ? 'input-danger' : 'input', 'w-full']" v-model="form.end_at" @change="validEndAt" id="end_at">
              <div class="text-red-500 text-sm mt-1.5" v-if="getError('end_at')" v-text="getError('end_at')"></div>
            </div>
            <div class="text-sm text-end">
              <button type="button" class="link" @click="closeTimeRange">zrušiť</button>
            </div>
          </div>
        </div>
      </panel-form>

      <panel-form width="full">
        <label class="mb-1 block" for="description">Informácie k požiadavke</label>
        <textarea :class="[ getError('description') ? 'input-danger' : 'input', 'w-full']" rows="8" v-model="form.description" @change="validDescription" id="description"></textarea>
        <div class="mt-1.5 text-sm flex justify-between gap-2">
          <div class="text-red-500" v-text="getError('description')"></div>
          <div class="font-light">{{ form.description.length }}/1000</div>
        </div>
      </panel-form>

      <panel-form width="full">
        <div>
          <div>
            <div class="mb-1">Podmienky požiadavky.</div>
            <ul class="mb-10 list-decimal list-inside bg-gray-100 dark:bg-gray-700/25 shadow text-gray-600 dark:text-gray-300/75 rounded-md divide-y divide-gray-200 dark:divide-gray-700/40">
              <li class="flex gap-5 items-start p-5">
                <div class="w-5 h-5 flex justify-center items-center bg-blue-500/75 rounded-full font-extrabold text-white text-xs mt-0.5">1</div>
                <div class="w-full">
                  Každá požiadavka bude viditeľná iba 2 mesiace, ak ju neobnovíte po uplynutí 3 mesiacov sa požiadavka automaticky odstráni zo systému a nebude ju možne obnoviť.
                </div>
              </li>
              <li class="flex gap-5 items-start p-5">
                <div class="w-5 h-5 flex justify-center items-center bg-blue-500/75 rounded-full font-extrabold text-white text-xs mt-0.5">2</div>
                <div class="w-full">
                  Dalšia podmienka
                </div>
              </li>
            </ul>
            <div class="flex gap-3 items-center">
              <input type="checkbox" id="rules" v-model="form.rules" @change="validRules" class="input-checkbox"/>
              <label for="rules" :class="[ getError('rules') ? 'text-red-500' : '' ]">Súhlasím s podmienkami požiadavky.</label>
            </div>
          </div>
        </div>
      </panel-form>

      <panel-form-actions>
        <template #left>
          <div v-if="errors.length" class="text-red-500">
            Máte {{ errors.length }} {{ errorInflection(errors.length) }}
          </div>
        </template>
        <template #right>
          <button type="submit" class="form-button" :disabled="loading">
            <template v-if="!loading">Vytvoriť</template>
            <template v-else>Overovanie <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
          </button>
        </template>
      </panel-form-actions>

    </panel>
  </form>

  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-address" role="dialog" aria-modal="true" v-if="showModalAddress">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
        <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalAddress"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full sm:w-10/12 md:w-8/12 xl:w-4/12">

          <form @submit.prevent="setAddress" class="divide-y divide-gray-200 dark:divide-gray-700/40">
            <div class="grid grid-cols-2 bg-gradient-to-t from-gray-200 dark:from-gray-800 to-75% to-transparent -mx-4 xs:-mx-6 sm:-mx-0">
              <button type="button" @click="addressMode('address')" class="px-3 py-4" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'address'}">
                Miesto práce
              </button>
              <button type="button" @click="addressMode('route')" class="px-3 py-4" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'route'}">
                Trasa
              </button>
            </div>

            <div class="p-6 md:p-10">
              <div v-if="address_mode === 'address'" class="p-1">
                <div>
                  <label class="mb-1 block" for="location">Miesto práce</label>
                  <input type="text" list="addressData" :class="[ getAddressError('location') ? 'input-danger' : 'input', 'w-full']" v-model="location" id="location" placeholder="Mesto alebo PSČ">
                  <div class="text-red-500 text-sm mt-1.5" v-if="getAddressError('location')" v-text="getAddressError('location')"></div>
                </div>
              </div>
              <div v-if="address_mode === 'route'" class="p-1">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1 block" for="location_from">Odkiaľ</label>
                    <input type="text" list="addressData" :class="[ getAddressError('location_from') ? 'input-danger' : 'input', 'w-full']" v-model="location_from" id="location_from" placeholder="Bratislava">
                    <div class="text-red-500 text-sm mt-1.5" v-if="getAddressError('location_from')" v-text="getAddressError('location_from')"></div>
                  </div>
                  <div>
                    <label class="mb-1 block" for="location_to">Kam</label>
                    <input type="text" list="addressData" :class="[ getAddressError('location_to') ? 'input-danger' : 'input', 'w-full']" v-model="location_to" id="location_to" placeholder="Košice">
                    <div class="text-red-500 text-sm mt-1.5" v-if="getAddressError('location_to')" v-text="getAddressError('location_to')"></div>
                  </div>
                </div>
              </div>
              <datalist id="addressData">
                <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
              </datalist>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalAddress" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button">Nastaviť adresu</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>

</template>

<script setup lang="ts">
import {ref, computed, inject} from 'vue';
import {useMeta} from "vue-meta";
import Panel from "@/components/Panel.vue";
import PanelForm from "@/components/PanelForm.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import type {Categories, Sections, Zipcodes} from "@/types/offers";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import type {Auth} from "@/types/users";
import axios from "axios";
import router from "@/router";
import {settings} from "@/plugins/config";
import {useToast} from "primevue/usetoast";

const auth = inject<Auth>('auth');
const loggedIn = ref(auth?.loggedIn as boolean)

const toast = useToast()
useMeta({ title: 'crea' })

const loading = ref<boolean>(false);
const errors = ref<any>([]);
const form = ref<any>({
  title: 'Požiadavka na ' as string,
  section: 0 as number,
  category: 0 as number,
  address: '' as string,
  time_range: false as boolean,
  start_at: null,
  end_at: null,
  description: '' as string,
  rules: false as boolean,
});

const slovakData = ref<Zipcodes[]>(skZipcodes);
const sections = ref<Sections[]>(categoriesData.sections);
const categories = ref<Categories[]>(categoriesData.categories);

const showModalAddress = ref<boolean>(false);
const showButtonSetAddress = ref<boolean>(true)
const addressErrors = ref<any>([]);
const address_mode = ref<string>('address');
const location = ref<string>('');
const location_from = ref<string>('');
const location_to = ref<string>('');

const submitForm = () => {
  loading.value = true

  checkForm()

  if (errors.value.length) {
    loading.value = false
    return false
  }

  axios.post(`${settings.backend}/auth/offers/create`, form.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({severity: 'success', summary: 'Požiadavka', detail: 'Vaša požiadavka úspešne vytvorená.', group: 'br', life: 4000})
        router.push({ name: 'offerDetail', params: { id: response.data.last_id } })
      } else {
        // backend error
        console.log(response.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })

}
const checkForm = () => {
  errors.value = []

  validTitle()
  validSection()
  validCategory()
  validAddress()
  validDescription()
  validRules()

  if (form.value.time_range) {
    validStartAt()
    validEndAt()
  }

}
const validTitle = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'title')
  if (form.value.title.length < 30) {
    errors.value.push({ where: 'title', message: 'Názov požiadavky musí mať aspoň 30 znakov.' })
  } else if (form.value.title.length > 100) {
    errors.value.push({ where: 'title', message: 'Názov požiadavky môže mať maximálne 100 znakov.' })
  }
}
const validSection = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'section')
  if (form.value.section === 0) errors.value.push({ where: 'section', message: 'Vyberte sekciu.' })
}
const validCategory = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'category')
  if (form.value.category === 0) errors.value.push({ where: 'category', message: 'Vyberte kategóriu.' })
}
const validAddress = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'address')
  if (!form.value.address.length) errors.value.push({ where: 'address', message: 'Adresa musí byť nastavená.' })
}
const validStartAt = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'start_at')
  if (form.value.start_at === null) errors.value.push({ where: 'start_at', message: 'Nastavte čas kedy majú práce začať.' })
}
const validEndAt = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'end_at')
  if (form.value.end_at === null) errors.value.push({ where: 'end_at', message: 'Nastavte čas kedy majú práce skončiť.' })
}
const validDescription = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'description')
  if (form.value.description.length < 150) {
    errors.value.push({ where: 'description', message: 'Informácie o požiadavke musia mať aspoň 150 znakov.' })
  } else if (form.value.description.length > 1000) {
    errors.value.push({ where: 'description', message: 'Informácie o požiadavke môžu mať maximálne 1000 znakov.' })
  }
}
const validRules = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'rules')
  if (!form.value.rules) errors.value.push({ where: 'rules', message: 'Musíte označiť že súhlasíte s podmienkami požiadavky.' })
}
const checkSelectSection = () => {
  validSection()
  if (form.value.section! > 0) {
    form.value.category = 0
  }
}
const filteredCategories = computed(() => {
  if (form.value.section === 0) return [];
  return categories.value.filter(category => category.section_id === form.value.section);
});
const addressMode = (input: string) => {
  address_mode.value = input
  location.value = ''
  location_from.value = ''
  location_to.value = ''
}
const setAddress = () => {

  checkAddress()

  if (addressErrors.value.length) {
    return false
  }

  if (address_mode.value === 'address') {
    form.value.address = location.value
  } else if (address_mode.value === 'route'){
    form.value.address = `${location_from.value} - ${location_to.value}`
  } else {
    form.value.address = ''
  }

  validAddress()
  showButtonSetAddress.value = false
  closeModalAddress()
}
const checkAddress = () => {

  addressErrors.value = []

  if (address_mode.value === 'address') {
    if (!location.value.length) addressErrors.value.push({ where: 'location', message: 'Adresa musí byť vyplnená.' })
  }

  if (address_mode.value === 'route'){
    if (!location_from.value.length) addressErrors.value.push({ where: 'location_from', message: 'Adresa musí byť vyplnená.' })
    if (!location_to.value.length) addressErrors.value.push({ where: 'location_to', message: 'Adresa musí byť vyplnená.' })
  }

}
const getAddressError = (search: any) => {
  const emailError = addressErrors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const setTimeRange = () => {
  form.value.time_range = true
}
const closeTimeRange = () => {
  form.value.start_at = null
  form.value.end_at = null
  form.value.time_range = false
}
const getError = (search: any) => {
  const emailError = errors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const closeModalAddress = () => {
  showModalAddress.value = false
}
const errorInflection = (count: number) => {
  if (count === 1) {
    return 'chybu';
  } else if (count >= 2 && count <= 4) {
    return 'chyby';
  } else {
    return 'chýb';
  }
}

</script>