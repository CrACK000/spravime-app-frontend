<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useMeta} from "vue-meta"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {timeUntil} from "@/plugins/functions"
import {useDialog} from "primevue/usedialog"
import {useConfirm} from "primevue/useconfirm"
import myOffers from "@/plugins/auth/my-offers"
import EditMyOffer from "@/components/dialogs/EditMyOffer.vue"

useMeta({ title: 'Moje požiadavky' })

const toast = useToast()
const dialog = useDialog()
const confirm = useConfirm()

const offers = ref<Offer[]>(myOffers.data.offers)
const loading = ref<boolean>(myOffers.data.offers_loading)

const showRight = ref(true);
const showLeft = ref(false);
const overlayLeft = ref(0);
const overlayRight = ref(0);
const scrollable = ref<null | HTMLDivElement>(null);

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

const removeOffer = (ids: string) => {

  confirm.require({
    header: 'Požiadavka',
    message: 'Naozaj chcete odstrániť požiadavku?',
    icon: 'fa-regular fa-trash-can',
    rejectIcon: 'fa-regular fa-circle-xmark',
    acceptIcon: 'fa-regular fa-circle-check',
    rejectClass: 'form-secondary-button-sm',
    acceptClass: 'form-danger-button-sm',
    acceptLabel: 'Odstrániť',
    rejectLabel: 'Zrušiť',
    accept: () => {
      axios.post(`${process.env.VITE_BACKEND}/auth/offers/remove`, { ids }, { withCredentials: true })
        .then(response => {

          if (response.data.success) {

            offers.value = offers.value.filter(offer => !ids.includes(offer._id))

            toast.add({
              severity: 'success',
              summary: 'Úspech',
              detail: response.data.message,
              group: 'br',
              life: 5000
            })

          } else {

            toast.add({
              severity: 'error',
              summary: 'Chyba',
              detail: response.data.message,
              group: 'br',
              life: 5000
            })

          }
        })
        .catch(error => {
          toast.add({
            severity: 'error',
            summary: 'Server',
            detail: "Vyskytla sa systémová chyba. Skúste to neskôr.",
            group: 'br',
            life: 5000
          })
        })
    }
  })

}

const showEditModal = (_id: string, data: any) => {
  dialog.open(EditMyOffer, {
    props: {
      header: 'Upraviť požiadavku',
      contentClass: 'max-w-6xl',
      modal: true,
    },
    data: {
      reviewData: data
    },
    onClose: (opt: any) => {
      if (opt.data) {
        offers.value = offers.value.map(offer => offer._id === opt.data._id ? opt.data : offer)
      }
    }
  })
}

onMounted(async () => {
  if (!offers.value.length) {
    await myOffers.all()
    offers.value = myOffers.data.offers
    loading.value = myOffers.data.offers_loading
  }
})

</script>

<template>
  <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

    <div class="relative flex flex-row flex-nowrap overflow-x-auto hide-scrollbar bg-gray-200/75 dark:bg-gray-900/50 w-full" ref="scrollable" @scroll="checkScroll" @wheel="onWheel">
      <router-link :to="{ name: 'offers-all' }"
         class="px-5 py-3.5 w-auto hover:text-gray-950 dark:hover:text-gray-300 border-b-2 hover:border-blue-600/75 transition duration-200 whitespace-nowrap font-medium flex items-center gap-4"
         :class="[$route.name === 'offers-all' ? 'border-blue-600 text-gray-800 dark:text-gray-300' : 'border-transparent']">
        Všetky <span class="inline-flex justify-center items-center bg-white dark:bg-blue-200/20 w-5 h-5 text-xs rounded-full shadow-md">{{ offers.filter(offer => offer.approved).length }}</span>
      </router-link>
      <router-link :to="{ name: 'offers-waiting' }"
         class="px-5 py-3.5 w-auto hover:text-gray-950 dark:hover:text-gray-300 border-b-2 hover:border-blue-600/75 transition duration-200 whitespace-nowrap font-medium flex items-center gap-4"
         :class="[$route.name === 'offers-waiting' ? 'border-blue-600 text-gray-800 dark:text-gray-300' : 'border-transparent']">
        Čakajú na schválenie <span class="inline-flex justify-center items-center bg-white dark:bg-blue-200/20 w-5 h-5 text-xs rounded-full shadow-md">{{ offers.filter(offer => !offer.approved).length }}</span>
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

    <template v-if="!loading">
      <!-- Všetky -->
      <template v-if="$route.name === 'offers-all' || $route.name === 'my-offers'">
        <template v-if="offers.filter(el => el.approved).length" v-for="offer in offers" :key="offer.id">
          <div v-if="offer.approved" class="flex flex-wrap gap-5 items-center p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition">
            <div>
              <div v-text="offer.title"></div>
              <div class="text-sm font-light opacity-75 mt-1">
                Aktívne ešte {{ timeUntil(offer.closed_at) }}
              </div>
            </div>
            <div class="ms-auto flex justify-center items-center gap-x-4">
              <div class="text-center flex flex-col justify-center items-center">
                <span class="text-xs mb-1">Zobrazenia</span>
                <div class="text-xl font-medium">{{ offer.views }}</div>
              </div>
            </div>
            <div class="flex justify-end items-center gap-3">
              <button class="form-secondary-button-sm" type="button" @click="showEditModal(offer._id, offer)">
                Upraviť
              </button>
              <button type="button" class="form-danger-button-sm" @click="removeOffer(offer._id)">
                Odstrániť
              </button>
            </div>
          </div>
        </template>
        <div v-else class="flex justify-center items-center py-8 px-4 bg-white/75 dark:bg-gray-800/50 text-xl">
          Zatiaľ ste nenapísali žiadnu požiadavku. <router-link :to="{ name: 'offerAdd' }" class="link ms-1.5">Vytvoriť požiadavku</router-link>
        </div>
      </template>

      <!-- Čakajúce na schválenie -->
      <template v-if="$route.name === 'offers-waiting'">
        <template v-if="offers.filter(el => !el.approved).length" v-for="offer in offers" :key="offer.id">
          <div v-if="!offer.approved" class="flex flex-wrap gap-5 items-center p-4 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-gray-100 transition">
            <div>
              <div v-text="offer.title"></div>
              <div class="text-sm font-light opacity-75 mt-1">
                Aktívne ešte {{ timeUntil(offer.closed_at) }}
              </div>
            </div>
            <div class="ms-auto flex justify-center items-center gap-x-4">
              <div class="text-center flex flex-col justify-center items-center">
                <span class="text-xs mb-1">Zobrazenia</span>
                <div class="text-xl font-medium">{{ offer.views }}</div>
              </div>
            </div>
            <div class="flex justify-end items-center gap-3">
              <button class="form-secondary-button-sm" type="button" @click="showEditModal(offer._id, offer)">
                Upraviť
              </button>
              <button type="button" class="form-danger-button-sm" @click="removeOffer(offer._id)">
                Odstrániť
              </button>
            </div>
          </div>
        </template>
        <div v-else class="flex justify-center items-center py-8 px-4 bg-white/75 dark:bg-gray-800/50 text-xl">
          Žiadna vaša požiadavka nieje v procese schvaľovania.
        </div>
      </template>
    </template>

    <!-- loading my offers -->
    <template v-else>
      <div v-for="key in 5" :key="key" class="flex flex-wrap gap-8 items-center p-4 bg-white/75 dark:bg-gray-800/50">
        <div class="animate-pulse">
          <div :style="{ 'width': Math.floor(Math.random()*(400-200+1)+200) + 'px' }" class="loading-bar h-3.5 max-w-full"></div>
          <div class="loading-bar h-2.5 w-36 mt-3.5"></div>
        </div>
        <div class="animate-pulse ms-auto flex flex-col justify-center items-center">
          <div class="loading-bar h-2.5 w-20"></div>
          <div class="loading-bar h-3.5 w-10 mt-3.5"></div>
        </div>
        <div class="animate-pulse flex justify-end items-center gap-3">
          <div class="loading-bar h-5 w-16"></div>
          <div class="loading-bar h-5 w-16"></div>
        </div>
      </div>
    </template>

  </div>
</template>