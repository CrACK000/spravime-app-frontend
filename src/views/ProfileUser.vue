<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 mx-auto">
    <div class="flex flex-col lg:flex-row overflow-hidden bg-white/75 dark:bg-gray-800/50 shadow-md shadow-blue-700/5 dark:shadow-black/10 md:rounded-lg">
      <div class="w-full lg:w-3/12 bg-gray-100 dark:bg-black/5 pb-4 lg:p-4" :class="{ 'pt-4': account.verify }">

        <!-- Sidebar -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center text-xs text-blue-500 font-medium col-span-2" v-if="account.verify">
            <i class="fa-regular fa-circle-check fa-lg me-0.5"></i> Profil je overený
          </div>
          <div class="col-span-2">
            <svg v-if="loading" class="w-52 h-52 mt-8 mx-auto text-gray-300 dark:text-gray-700 animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/></svg>
            <img v-else :src="account.avatar" :alt="account.username" class="w-52 rounded-3xl mx-auto shadow-xl" :class="{ 'border-4 border-transparent shadow-blue-600/40': account.verify }">
          </div>
          <div class="col-span-2 text-center">
            <ul class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40 md:hidden text-start">
              <li class="py-2 px-3">
                <div v-if="loading" class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-52 my-1.5 animate-pulse"></div>
                <div v-else>
                  <div class="w-32 inline-block text-lg font-medium text-gray-700 dark:text-gray-400">
                    {{ state.accountTypeDisplay[account.type] }}
                  </div>{{ account.name ?? account.username }}
                </div>
              </li>
              <li class="py-2 px-3 truncate">
                <div v-if="loading" class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-44 my-1.5 animate-pulse"></div>
                <div v-else>
                  <div class="w-32 inline-block">E-mail</div>
                  <a :href="'mailto:' + account.email" class="link">{{ account.email }}</a>
                </div>
              </li>
              <li v-if="account.mobile" class="py-2 px-3 truncate">
                <div class="w-32 inline-block">Tel. číslo</div>
                <a :href="'tel:' + account.mobile" class="link">{{ account.mobile }}</a>
              </li>
              <li v-if="account.socialPages" class="py-2 px-3">
                <div class="w-32 inline-block">Sociálne siete</div>
                <div class="inline-flex gap-3">
                  <a v-for="social in account.socialPages" :href="social.name" target="_blank" class="link">
                    <i class="fa-xl" :class="state.social_icons[social.type]"></i>
                  </a>
                </div>
              </li>
              <li v-if="loading" class="py-2 px-3">
                <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-24 my-1.5 animate-pulse"></div>
              </li>
            </ul>
            <div v-if="loading" role="status" class="max-w-sm animate-pulse pt-1">
              <div class="h-3.5 lg:block hidden rounded-full bg-gray-300 dark:bg-gray-700 w-44 mb-4 mx-auto"></div>
              <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-60 mx-auto"></div>
            </div>
            <div v-else>
              <h1 class="text-lg font-medium lg:block hidden mt-5">{{ account.name ?? account.username }}</h1>
              <div class="text-xs opacity-75 px-4 py-6 md:py-4 md:px-0" v-if="account.slogan" v-text="account.slogan"></div>
            </div>
          </div>
        </div>

      </div>

      <div class="w-full lg:w-9/12 p-4">

        <!-- Galéria -->
        <div v-if="showGallery">
          <div v-if="loadingGallery" class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-36 mb-4 mt-3 animate-pulse"></div>
          <div v-else class="py-2 px-3 text-lg font-medium text-gray-700 dark:text-gray-400">{{ account.type === 'company' ? 'Naša práca' : 'Moja práca' }}</div>
          <div class="relative flex flex-row flex-nowrap gap-4 overflow-x-auto hide-scrollbar p-3 rounded bg-black/10 mb-14" ref="scrollable" @scroll="checkScroll" @wheel="onWheel">
            <div v-if="!loadingGallery" v-for="(image, index) in gallery" :key="index" @click="openModalGallery(index)" class="w-[200px] cursor-pointer opacity-75 hover:opacity-100 transition duration-200">
              <div class="w-[200px] h-32 overflow-hidden rounded">
                <img :src="`${settings.backend}/images/galleries/${image.path}`" :alt="image.description" class="w-full">
              </div>
            </div>

            <!-- Loading Panel for galleries -->
            <div v-else v-for="key in 5" class="min-w-[200px] animate-pulse opacity-50" :key="key">
              <div class="flex items-center justify-center w-full h-32 rounded bg-gray-400 dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18"><path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/></svg>
              </div>
            </div>

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
        </div>

        <!-- Informácie -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" :class="{'mb-14': account.description}">
          <div class="lg:block hidden">
            <ul class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">
              <li class="py-2 px-3">
                <div v-if="loading" class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-52 my-1.5 animate-pulse"></div>
                <div v-else>
                  <div class="w-32 inline-block text-lg font-medium text-gray-700 dark:text-gray-400">
                    {{ state.accountTypeDisplay[account.type] }}
                  </div>{{ account.name ?? account.username }}
                </div>
              </li>
              <li v-if="account.address" class="py-2 px-3 truncate">
                <div class="w-32 inline-block">Adresa</div>
                <span>{{ account.address }}</span>
              </li>
              <li class="py-2 px-3 truncate">
                <div v-if="loading" class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-44 my-1.5 animate-pulse"></div>
                <div v-else>
                  <div class="w-32 inline-block">E-mail</div>
                  <a :href="'mailto:' + account.email" class="link">{{ account.email }}</a>
                </div>
              </li>
              <li v-if="account.mobile" class="py-2 px-3 truncate">
                <div class="w-32 inline-block">Tel. číslo</div>
                <a :href="'tel:' + account.mobile" class="link tracking-wider">{{ account.mobile }}</a>
              </li>
              <li v-if="account.socialPages" class="py-2 px-3">
                <div class="w-32 inline-block">Sociálne siete</div>
                <div class="inline-flex gap-3">
                  <a v-for="social in account.socialPages" :href="social.name" target="_blank" class="link">
                    <i class="fa-xl" :class="state.social_icons[social.type]"></i>
                  </a>
                </div>
              </li>
              <li v-if="loading" class="py-2 px-3">
                <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-24 my-1.5 animate-pulse"></div>
              </li>
            </ul>
          </div>
          <div v-if="loading">
            <div class="w-full animate-pulse">
              <div class="h-4 rounded-full bg-gray-300 dark:bg-gray-700 w-36 mb-5 mt-3 ms-2"></div>
              <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-80 mb-3 ms-3"></div>
              <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-56 mb-3 ms-3"></div>
              <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-28 mb-3 ms-3"></div>
            </div>
          </div>
          <div v-else-if="account.description">
            <h1 class="py-2 px-3 text-lg font-medium text-gray-700 dark:text-gray-400" v-text="state.descriptionTypeDisplay[account.type]"></h1>
            <p class="px-4" v-html="nl2br(account.description)"></p>
          </div>
        </div>

        <!-- Recenzie -->
        <div>
          <div v-if="!loading" class="flex justify-between items-end gap-3 mb-4">
            <div class="font-light text-xl ms-1">Recenzie</div>
            <button type="button" class="form-button-sm" v-if="loggedIn && !(user.id === Number(route.params.id)) && !checkAlreadyReview()" @click="openModalNewReview"><i class="fa-solid fa-pencil me-1"></i> Napísať recenziu</button>
          </div>
          <div v-else class="flex justify-between items-end gap-3 mb-6">
            <div class="h-3 loading-bar w-36 animate-pulse"></div>
            <div class="h-3 loading-bar w-32 animate-pulse"></div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700/20 mb-0 rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40" v-if="loading || loggedIn">

            <div v-if="loading" v-for="key in 2" class="flex gap-4 p-4 animate-pulse" :key="key">
              <div>
                <svg class="w-10 h-10 xs:w-14 xs:h-14 text-gray-300 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </div>
              <div>
                <div class="h-3 rounded-full bg-gray-300 dark:bg-gray-700 w-32 mb-2"></div>
                <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-40 mb-5 inline-block me-5"></div>
                <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-32 mb-5 inline-block me-5"></div>
                <div class="h-2 rounded-full bg-gray-300 dark:bg-gray-700 w-20 mb-5 inline-block"></div>
                <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[650px] mb-3"></div>
                <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[520px] mb-3"></div>
                <div class="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 max-w-full w-[390px] mb-3"></div>
              </div>
            </div>

            <div v-else-if="!reviews.length" class="p-4">
              Na tento profil ešte nikto nenapísal recenziu.
            </div>

            <div v-else v-for="review in reviews" class="p-4 review">
              <div class="flex items-center gap-4">
                <img :src="review.author_avatar" class="w-10 h-10 xs:w-14 xs:h-14 rounded-full shadow-lg" :alt="review.author_name ?? review.author_username">
                <div class="flex flex-col md:flex-row justify-between items-start">
                  <div>
                    <router-link :to="{ name: 'profile', params: { id: review.author_id } }" class="font-medium hover:text-gray-900 dark:hover:text-gray-300 transition">{{ review.author_name ?? review.author_username }}</router-link>
                    <div class="flex flex-col md:flex-row gap-1 md:gap-5 md:items-center text-xs mt-0.5">
                      <div>{{ timeSince(review.created_at) }}</div>
                      <div>
                        Hodnotenie
                        <span class="text-blue-500">
                          <i v-for="x in 5" class="fa-star" :class="[ review.rating >= x ? 'fa-solid' : 'fa-regular' ]"></i>
                        </span>
                      </div>
                      <div v-if="review.recommendation" class="text-emerald-500 font-semibold">
                        <i class="fa-regular fa-thumbs-up"></i> Odporúčam
                      </div>
                      <div v-else class="text-red-400 font-semibold">
                        <i class="fa-regular fa-thumbs-down"></i> Neodporúčam
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-1 review_buttons ms-auto" v-if="user && ((user.id === Number(route.params.id) && !(user.id === review.author_id)) || (user.id === review.author_id))">
                  <button v-tooltip.top="'Nahlásiť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalReportReview" v-if="user.id === Number(route.params.id) && !(user.id === review.author_id)">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </button>
                  <button v-tooltip.top="'Upraviť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalEditReview" v-if="user.id === review.author_id">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button v-tooltip.top="'Odstrániť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalDeleteReview" v-if="user.id === review.author_id">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="p-5 text-sm" v-html="nl2br(review.description)"></div>

              <!-- Modálne okno Upraviť recenziu -->
              <edit-review :show-modal="showModalEditReview" :key="review.id" :review-id="review.id" v-if="user.id === review.author_id"/>

              <!-- Modálne okno Nahlásiť recenziu -->
              <report-review :show-modal="showModalReportReview" :key="review.id" :review-id="review.id" v-if="user.id === Number(route.params.id) && !(user.id === review.author_id)"/>

              <!-- Modálne confirm okno Odstrániť recenziu -->
              <delete-review :show-modal="showModalDeleteReview" :key="review.id" :review-id="review.id" v-if="user.id === review.author_id"/>


            </div>

          </div>

          <div v-else class="bg-gray-100 dark:bg-gray-700/20 p-5 rounded-md overflow-hidden">
            Recenzie profilu môžete vidieť až po prihlásení. <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link>
          </div>
        </div>

        <!-- Modálne okno galérie -->
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="showModal">

            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">

              <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalGallery"></div>

              <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full md:w-11/12 lg:w-9/12">
                <div class="p-4">
                  <img :src="`${settings.backend}/images/galleries/${activeImage.path}`" :alt="activeImage.description" class="w-full object-cover">
                </div>

                <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between py-2 px-3">
                  <button @click="closeModalGallery" class="form-secondary-button-sm"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
                  <div class="flex gap-2">
                    <button @click="prevImage" class="form-secondary-button-sm"><i class="fa-solid fa-arrow-left"></i></button>
                    <button @click="nextImage" class="form-secondary-button-sm"><i class="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Modálne okno Napísať recenziu -->
        <write-review :show-modal="showModalNewReview" :profile-id="Number(route.params.id)" v-if="loggedIn && !(user.id === Number(route.params.id)) && !checkAlreadyReview()"/>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useMeta} from "vue-meta";
import {settings} from "@/plugins/config";
import {computed, inject, onMounted, provide, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import type {Auth, User, UserGallery} from "@/types/users";
import type {Reviews} from "@/types/reviews";
import axios from "axios";
import { nl2br, timeSince } from "@/plugins/functions";
import WriteReview from "@/views/modals/WriteReview.vue";
import EditReview from "@/views/modals/EditReview.vue";
import ReportReview from "@/views/modals/ReportReview.vue";
import DeleteReview from "@/views/modals/DeleteReview.vue";

useMeta({ title: 'Profil' })

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const route = useRoute()

const account = ref({} as User)
const reviews = ref<Reviews[]>([])
const gallery = ref<UserGallery[]>([])

const state = reactive({
  accountTypeDisplay: {
    'company': 'Firma',
    'worker': 'Majster',
    'normal': 'Meno'
  },
  descriptionTypeDisplay: {
    'company': 'Ponúkame',
    'worker': 'Ponúkam',
    'normal': 'O mne'
  },
  social_icons: {
    'instagram': 'fa-brands fa-instagram',
    'facebook': 'fa-brands fa-square-facebook',
  },
})

const activeIndex = ref<any>(0);
const showModal = ref<boolean>(false);

const showModalNewReview = ref<boolean>(false);
const showModalEditReview = ref<boolean>(false);
const showModalReportReview = ref<boolean>(false);
const showModalDeleteReview = ref<boolean>(false);

const showRight = ref<boolean>(true);
const showLeft = ref<boolean>(false);
const overlayLeft = ref<any>(0);
const overlayRight = ref<any>(0);
const scrollable = ref<null | HTMLDivElement>(null);

const loading = ref<boolean>(false);
const loadingGallery = ref<boolean>(false);
const showGallery = ref<boolean>(true);

const activeImage = computed(() => gallery.value[activeIndex.value]);

const checkAlreadyReview = () => {
  return reviews.value.some(review => review.author_id === user.value.id)
}
const writeReviewModal = () => {
  showModalNewReview.value = !showModalNewReview.value
}
const editReviewModal = () => {
  showModalEditReview.value = !showModalEditReview.value
}
const reportReviewModal = () => {
  showModalReportReview.value = !showModalReportReview.value
}
const deleteReviewModal = () => {
  showModalDeleteReview.value = !showModalDeleteReview.value
}
const openModalEditReview = () => {
  showModalEditReview.value = true;
}
const openModalReportReview = () => {
  showModalReportReview.value = true;
}
const openModalNewReview = () => {
  showModalNewReview.value = true;
}
const openModalDeleteReview = () => {
  showModalDeleteReview.value = true;
}
const openModalGallery = (index?: any) => {
  activeIndex.value = index;
  showModal.value = true;
}
const closeModalGallery = () => {
  showModal.value = false;
}
const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % gallery.value.length;
}
const prevImage = () => {
  activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length;
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
const fetchAccount = async () => {
  loading.value = true

  await axios.get(`${settings.backend}/api/user/${route.params.id}`, { withCredentials: true })
    .then(response => {
      account.value = response.data
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}
const fetchGallery = async () => {
  loadingGallery.value = true

  await axios.get(`${settings.backend}/api/user/gallery/${route.params.id}`, { withCredentials: true })
    .then(response => {
      gallery.value = response.data
      showGallery.value = !!response.data.length
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      loadingGallery.value = false
    })
}
const fetchReviews = async () => {
  await axios.get(`${settings.backend}/api/reviews/all/${route.params.id}`, { withCredentials: true })
    .then(response => {
      reviews.value = response.data
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      console.log('finally')
    })
}

provide('writeReviewModal', writeReviewModal)
provide('editReviewModal', editReviewModal)
provide('reportReviewModal', reportReviewModal)
provide('deleteReviewModal', deleteReviewModal)

onMounted(() => {
  fetchAccount()
  fetchGallery()
  fetchReviews()
})

</script>