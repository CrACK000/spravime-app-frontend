<template>
  <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

    <div class="relative flex flex-row flex-nowrap overflow-x-auto hide-scrollbar bg-gray-200/75 dark:bg-gray-900/50 w-full" ref="scrollable" @scroll="checkScroll" @wheel="onWheel">
      <router-link :to="{ name: 'offers-all' }"
         class="px-5 py-3.5 w-auto hover:text-gray-950 dark:hover:text-gray-300 border-b-2 hover:border-blue-600/75 transition duration-200 whitespace-nowrap font-medium flex items-center gap-4"
         :class="[$route.name === 'offers-all' ? 'border-blue-600 text-gray-800 dark:text-gray-300' : 'border-transparent']">
        Všetky <span class="gg-badge">{{ offers.filter(offer => offer.approved).length }}</span>
      </router-link>
      <router-link :to="{ name: 'offers-waiting' }"
         class="px-5 py-3.5 w-auto hover:text-gray-950 dark:hover:text-gray-300 border-b-2 hover:border-blue-600/75 transition duration-200 whitespace-nowrap font-medium flex items-center gap-4"
         :class="[$route.name === 'offers-waiting' ? 'border-blue-600 text-gray-800 dark:text-gray-300' : 'border-transparent']">
        Čakajú na schválenie <span class="gg-badge">{{ offers.filter(offer => !offer.approved).length }}</span>
      </router-link>

      <!-- Overlays -->
      <div :style="{ left: `${overlayLeft}px`, right: `${overlayRight}px`}" class="absolute flex justify-between top-0 bottom-0 w-full pointer-events-none">
        <!-- Left edge overlay -->
        <div :class="{ 'opacity-0': !showLeft }"
             class="w-32 bg-gradient-to-r from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
        <!-- Right edge overlay -->
        <div :class="{ 'opacity-0': !showRight }"
             class="w-32 bg-gradient-to-l from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
      </div>
    </div>

    <!-- Všetky -->
    <template v-if="$route.name === 'offers-all' || $route.name === 'my-offers'">
      <template v-for="offer in offers" :key="offer.id">
        <div v-if="offer.approved" class="grid grid-cols-12 gap-3 items-center p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
          <div class="col-span-8" v-text="offer.title"></div>
          <div class="col-span-2 flex justify-center items-center gap-x-4">
            <div class="text-center flex flex-col justify-center items-center">
              <span class="text-xs">Zobrazenia</span>
              <div class="text-xl font-bold">{{ offer.views }}</div>
            </div>
          </div>
          <div class="col-span-2 flex justify-end items-center gap-3">
            <button class="form-secondary-button-sm" type="button" @click="openEditModal(offer.id)">
              Upraviť
            </button>
          </div>
        </div>
      </template>
    </template>

    <!-- Čakajúce na schválenie -->
    <template v-if="$route.name === 'offers-waiting'">
      <template v-for="offer in offers" :key="offer.id">
        <div v-if="!offer.approved" class="grid grid-cols-12 gap-3 items-center p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition duration-100">
          <div class="col-span-8" v-text="offer.title"></div>
          <div class="col-span-2 flex justify-center items-center gap-x-4">
            <div class="text-center flex flex-col justify-center items-center">
              <span class="text-xs">Zobrazenia</span>
              <div class="text-xl font-bold">{{ offer.views }}</div>
            </div>
          </div>
          <div class="col-span-2 flex justify-end items-center gap-3">
            <button class="form-secondary-button-sm" type="button" @click="openEditModal(offer.id)">
              Upraviť
            </button>
          </div>
        </div>
      </template>
    </template>

    <transition enter-active-class="transition ease-out duration-100 transform" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition ease-in duration-75 transform" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="openEditPanel">
        <div class="flex items-end justify-center h-screen sm:block">
          <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeEditModal"></div>
          <div class="fixed top-28 bottom-0 right-0 w-full lg:w-[800px] bg-white dark:bg-gray-800 shadow-xl rounded-t-xl lg:rounded-t-none lg:rounded-tl-xl overflow-hidden">
            <form @submit.prevent="submitEditOffer" class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40 h-full">

              <div class="px-5 flex justify-between items-center h-16 shadow-lg shadow-black/5">
                <div>
                  Upraviť požiadavku
                </div>
                <button type="button" @click="closeEditModal" class="text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 focus:outline-none rounded-lg p-2.5 transition duration-100">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                </button>
              </div>

              <div class="h-full mb-16 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700/40">

                <panel-form>
                  <div class="mb-10">
                    <label class="mb-1 block" for="title">Názov požiadavky</label>
                    <input type="text" :class="[ getError('title') ? 'input-danger' : 'input', 'w-full']" v-model="form.title" @change="validTitle" id="title" placeholder="Požiadavka na..." required>
                    <div class="text-red-500 text-sm mt-1.5" v-if="getError('title')" v-text="getError('title')"></div>
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
                  </div>
                </panel-form>

                <panel-form>

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

              </div>

              <panel-form-actions class="absolute bottom-0 inset-x-0 h-16">
                <template #left>
                  <button type="submit" class="form-button" :disabled="loadingEdit">
                    <template v-if="!loadingEdit">Uložiť zmeny</template>
                    <template v-else>Ukladá sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
                  </button>
                </template>
                <template #right>

                </template>
              </panel-form-actions>

            </form>
          </div>
        </div>
      </div>
    </transition>

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

  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useMeta} from "vue-meta";
import axios from "axios";
import {settings} from "@/plugins/config";
import type {Categories, Offer, Sections, Zipcodes} from "@/types/offers";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import categoriesData from "@/plugins/categories.json";
import {useToast} from "primevue/usetoast";
import PanelForm from "@/components/PanelForm.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";

useMeta({ title: 'Moje požiadavky' });

const toast = useToast()

const offers = ref<Offer[]>([])
const loading = ref(false)
const loadingEdit = ref<boolean>(false);
const errorsEdit = ref<any>([]);
const openEditPanel = ref<boolean>(false);

const form = ref<any>({
  offer_id: 0 as number,
  title: '' as string,
  section: 0 as number,
  category: 0 as number,
  address: '' as string,
  time_range: false as boolean,
  start_at: null,
  end_at: null,
  description: '' as string,
});

const showRight = ref(true);
const showLeft = ref(false);
const overlayLeft = ref(0);
const overlayRight = ref(0);
const scrollable = ref<null | HTMLDivElement>(null);

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

const myOffers = () => {
  loading.value = true

  axios.post(`${settings.backend}/api/offers/my`, null, { withCredentials: true })
    .then(response => {
      offers.value = response.data
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const openEditModal = (offerId: number) => {
  offerEditingData(offerId)
  openEditPanel.value = !openEditPanel.value
}

const closeEditModal = () => {
  form.value = {
    offer_id: 0 as number,
    title: '' as string,
    section: 0 as number,
    category: 0 as number,
    address: '' as string,
    time_range: false as boolean,
    start_at: null,
    end_at: null,
    description: '' as string,
  };
  openEditPanel.value = !openEditPanel.value
}

const offerEditingData = async (offerId: number) => {
  await axios.get(`${settings.backend}/api/offers/${offerId}`, { withCredentials: true })
    .then(response => {

      let dateTimeStartAt: string = response.data.start_at;
      let startDate: Date = new Date(dateTimeStartAt);
      let StartAt: string = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().substring(0, 16);
      let dateTimeEndAt: string = response.data.end_at;
      let endDate: Date = new Date(dateTimeEndAt);
      let EndAt: string = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().substring(0, 16);

      form.value = {
        offer_id: response.data.id,
        title: response.data.title,
        section: response.data.section,
        category: response.data.category,
        address: response.data.address,
        time_range: response.data.time_range,
        start_at: response.data.start_at ? StartAt : null,
        end_at: response.data.end_at ? EndAt : null,
        description: response.data.description,
      };
    })
};

const submitEditOffer = () => {
  loadingEdit.value = true

  checkEditingForm()

  if (errorsEdit.value.length) {
    loadingEdit.value = false
    return false
  }

  axios.post(`${settings.backend}/api/offers/edit`, form.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({severity: 'success', summary: 'Požiadavka', detail: 'Vaša požiadavka bola aktualizovaná.', group: 'br', life: 3000})
        closeEditModal()
        myOffers()
      } else {
        console.log(response.data.message)
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loadingEdit.value = false
    })

}

const checkEditingForm = () => {
  errorsEdit.value = []

  validTitle()
  validSection()
  validCategory()
  validAddress()
  validDescription()

  if (form.value.time_range) {
    validStartAt()
    validEndAt()
  }

}

const validTitle = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'title')
  if (form.value.title.length < 30) {
    errorsEdit.value.push({ where: 'title', message: 'Názov požiadavky musí mať aspoň 30 znakov.' })
  } else if (form.value.title.length > 100) {
    errorsEdit.value.push({ where: 'title', message: 'Názov požiadavky môže mať maximálne 100 znakov.' })
  }
}

const validSection = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'section')
  if (form.value.section === 0) errorsEdit.value.push({ where: 'section', message: 'Vyberte sekciu.' })
}

const validCategory = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'category')
  if (form.value.category === 0) errorsEdit.value.push({ where: 'category', message: 'Vyberte kategóriu.' })
}

const validAddress = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'address')
  if (!form.value.address.length) errorsEdit.value.push({ where: 'address', message: 'Adresa musí byť nastavená.' })
}

const validStartAt = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'start_at')
  if (form.value.start_at === null) errorsEdit.value.push({ where: 'start_at', message: 'Nastavte čas kedy majú práce začať.' })
}

const validEndAt = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'end_at')
  if (form.value.end_at === null) errorsEdit.value.push({ where: 'end_at', message: 'Nastavte čas kedy majú práce skončiť.' })
}

const validDescription = () => {
  errorsEdit.value = errorsEdit.value.filter((error: any) => error.where !== 'description')
  if (form.value.description.length < 150) {
    errorsEdit.value.push({ where: 'description', message: 'Informácie o požiadavke musia mať aspoň 150 znakov.' })
  } else if (form.value.description.length > 1000) {
    errorsEdit.value.push({ where: 'description', message: 'Informácie o požiadavke môžu mať maximálne 1000 znakov.' })
  }
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

const setTimeRange = () => {
  form.value.time_range = true
}

const closeTimeRange = () => {
  form.value.start_at = null
  form.value.end_at = null
  form.value.time_range = false
}

const getAddressError = (search: any) => {
  const emailError = addressErrors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}

const getError = (search: any) => {
  const emailError = errorsEdit.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}

const closeModalAddress = () => {
  showModalAddress.value = false
}

const checkScroll = (event?: any) => {
  const { scrollWidth, scrollLeft, clientWidth } = event.target;

  showLeft.value = scrollLeft > 0;
  showRight.value = scrollLeft + clientWidth < scrollWidth;
  overlayLeft.value = scrollLeft;
  overlayRight.value = scrollWidth - (scrollLeft + clientWidth);
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (scrollable.value) {
    scrollable.value.scrollLeft += e.deltaY / 3;
  }
}


onMounted(() => {
  myOffers()
})

</script>