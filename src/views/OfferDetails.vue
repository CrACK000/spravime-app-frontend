<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
      <div class="lg:w-8/12 flex flex-col gap-6">

        <panel divide="y" v-if="!loading">
          <div class="p-4 flex items-center justify-between gap-3">
            <div v-if="offer" v-text="offer.title"></div>
          </div>
          <div class="p-4">
            <div class="flex flex-col-reverse md:flex-row gap-4">
              <div class="md:w-8/12">
                <div v-if="offer" class="p-4" v-text="offer.description"></div>
              </div>
              <div class="md:w-4/12 flex gap-3 flex-row md:flex-col">
                <div class="w-full bg-black/5 shadow p-3 rounded">
                  <div class="opacity-75 text-sm mb-2">Status</div>
                  <div v-if="offer">
                    <div v-if="offer.status" class="text-blue-500 flex items-center gap-3 font-medium">
                      <div class="bg-blue-500 shadow-md shadow-blue-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
                      Otvorené
                    </div>
                    <div v-else class="text-red-500 flex items-center gap-3 font-medium">
                      <div class="bg-red-500 shadow-md shadow-red-600/100 w-1.5 h-1.5 rounded-full inline-block"></div>
                      Uzavreté
                    </div>
                  </div>
                </div>
                <div class="w-full bg-black/5 shadow p-3 rounded">
                  <div class="opacity-75 text-sm mb-2">Miesto práce</div>
                  <div v-if="offer" v-text="offer.address"></div>
                </div>
              </div>
            </div>
          </div>
        </panel>

        <!-- Loading panel Title&Desc -->
        <panel divide="y" v-else>
          <div class="p-4 py-5 flex items-center justify-between gap-3">
            <div class="loading-bar h-3 w-80 animate-pulse"></div>
          </div>
          <div class="w-full p-5 animate-pulse">
            <div class="loading-bar h-3 w-96 mb-4"></div>
            <div class="loading-bar h-3 w-[420px] mb-4"></div>
            <div class="loading-bar h-3 w-[500px] mb-4"></div>
            <div class="loading-bar h-3 w-[400px] mb-4"></div>
            <div class="loading-bar h-3 w-[380px] mb-4"></div>
            <div class="loading-bar h-3 w-[560px]"></div>
          </div>
        </panel>

        <panel divide="y" class="rework-element" v-if="!loading">
          <div class="p-4">
            Komentáre k požiadavke
          </div>
          <div class="p-4">
            Komentáre
          </div>
        </panel>

        <!-- Loading panel Comments -->
        <panel divide="y" v-else>
          <div class="p-4 py-5 flex items-center justify-between gap-3">
            <div class="loading-bar h-3 w-80 animate-pulse"></div>
          </div>
          <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">
            <div class="w-full p-5 animate-pulse grid grid-cols-11">
              <div class="col-span-1">
                <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </div>
              <div class="col-span-10 px-5">
                <div class="loading-bar h-3 w-32 mb-6"></div>
                <div class="loading-bar h-2.5 w-96 mb-3"></div>
                <div class="loading-bar h-2.5 w-[420px] mb-3"></div>
                <div class="loading-bar h-2.5 w-[500px] mb-3"></div>
                <div class="loading-bar h-2.5 w-[400px]"></div>
              </div>
            </div>
            <div class="w-full p-5 animate-pulse grid grid-cols-11">
              <div class="col-span-1">
                <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </div>
              <div class="col-span-10 px-5">
                <div class="loading-bar h-3 w-32 mb-6"></div>
                <div class="loading-bar h-2.5 w-[500px] mb-3"></div>
                <div class="loading-bar h-2.5 w-80 mb-3"></div>
                <div class="loading-bar h-2.5 w-[400px]"></div>
              </div>
            </div>
            <div class="w-full p-5 animate-pulse grid grid-cols-11">
              <div class="col-span-1">
                <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
              </div>
              <div class="col-span-10 px-5">
                <div class="loading-bar h-3 w-32 mb-6"></div>
                <div class="loading-bar h-2.5 w-96 mb-3"></div>
                <div class="loading-bar h-2.5 w-[400px] mb-3"></div>
                <div class="loading-bar h-2.5 w-[450px] mb-3"></div>
                <div class="loading-bar h-2.5 w-[380px]"></div>
              </div>
            </div>
          </div>
        </panel>

      </div>
      <div class="lg:w-4/12 flex flex-col gap-6">

        <panel divide="y" v-if="!loading">
          <div class="p-4">
            Informácie k požiadavke
          </div>
          <div class="p-4">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
              <li class="flex justify-between p-2">
                <span>Vytvoril</span>
                <div v-if="author">
                  <router-link :to="{ name: 'profile' , params: { id: author.id }}" class="link" :class="{ 'font-semibold': author.verify }">
                    <i v-if="author.verify" class="fa-regular fa-circle-check fa-sm me-0.5"></i>
                    {{ author?.name ?? author?.username }}
                  </router-link>
                </div>
              </li>
              <li class="flex items-center justify-between px-2 py-2.5 pt-3">
                <span>Sekcia</span>
                <div v-if="offer" v-text="offer.section_title" class="text-end"></div>
              </li>
              <li class="flex items-center justify-between px-2 py-2.5 pt-3">
                <span>Kategória</span>
                <div v-if="offer" v-text="offer.category_title" class="text-end"></div>
              </li>
              <li class="flex items-center justify-between px-2 py-2.5 pt-3">
                <span>Vytvorené dňa</span>
                <div v-if="offer" v-text="formatIsoDate(offer.created_at)" class="text-end"></div>
              </li>
              <li class="flex items-center justify-between px-2 py-2.5 pt-3">
                <span>Začiatok prác</span>
                <div v-if="offer" v-text="formatIsoDate(offer.start_at)" class="text-end"></div>
              </li>
              <li class="flex items-center justify-between px-2 py-2.5 pt-3">
                <div v-if="offer">{{ offer.status ? 'Trvá do' : 'Uzavreté dňa' }}</div>
                <div v-if="offer" v-text="formatIsoDate(offer.end_at)" class="text-end"></div>
              </li>
            </ul>
          </div>
        </panel>

        <!-- Loading panel Info -->
        <panel divide="y" v-else>
          <div class="p-4 py-5">
            <div class="loading-bar h-3 w-60 animate-pulse"></div>
          </div>
          <div class="w-full animate-pulse p-4">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-20 max-w-full"></div>
                <div class="loading-bar h-3 w-32 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-16 max-w-full"></div>
                <div class="loading-bar h-3 w-44 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-20 max-w-full"></div>
                <div class="loading-bar h-3 w-48 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-20 max-w-full"></div>
                <div class="loading-bar h-3 w-36 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-32 max-w-full"></div>
                <div class="loading-bar h-3 w-24 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-28 max-w-full"></div>
                <div class="loading-bar h-3 w-28 max-w-full"></div>
              </li>
              <li class="flex justify-between p-2 py-3.5">
                <div class="loading-bar h-3 w-24 max-w-full"></div>
                <div class="loading-bar h-3 w-20 max-w-full"></div>
              </li>
            </ul>
          </div>
        </panel>

        <div v-if="!loadingMsg">
          <form method="post" v-if="offer && offer.status && auth.loggedIn.value && !checkAuthor" @submit.prevent="sendMsg">
            <panel divide="y" v-if="checkMsg">
              <div class="p-4">
                Odpovedať
              </div>
              <div class="p-4">
                <label class="mb-1 block" for="message">Správa</label>
                <textarea rows="4" id="message" v-model="message" class="input w-full"></textarea>
              </div>
              <panel-form-actions>
                <template #left>
                  <a href="#" class="form-success-button-sm">
                    <i class="fa-solid fa-phone me-1.5"></i> Zavolať
                  </a>
                </template>
                <template #right>
                  <button type="submit" class="form-button-sm">
                    Odoslať <i class="fa-regular fa-paper-plane ms-1.5"></i>
                  </button>
                </template>
              </panel-form-actions>
            </panel>
            <panel v-else>
              <div class="p-6">Na požiadavku ste už reagovali. Skontrolujte si <router-link :to="{name: 'messages'}" class="link">Správy</router-link></div>
            </panel>
          </form>
        </div>

        <!-- Loading panel Message -->
        <panel divide="y" v-else>
          <div class="p-4 py-5">
            <div class="loading-bar h-3 w-36 animate-pulse"></div>
          </div>
          <div class="w-full animate-pulse p-4">
            <div class="loading-bar h-3 w-48 max-w-full mb-3"></div>
            <div class="loading-bar h-3 w-32 max-w-full mb-3"></div>
            <div class="loading-bar h-3 w-56 max-w-full"></div>
          </div>
        </panel>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, inject} from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from "vue-meta";
import axios from "axios";
import Cookies from 'js-cookie';
import Panel from "@/components/Panel.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import { settings } from "@/plugins/config";
import { formatIsoDate } from "@/plugins/functions";
import type { Offer } from "@/types/offers";
import type { User } from "@/types/users";

const auth = inject<any>('auth');

useMeta({ title: 'Požiadavka'});

const route = useRoute()
const offer = ref<Offer | null>(null)
const author = ref<User | null>(null)

const loading = ref(false)
const loadingMsg = ref(false)

const message = ref('')
const checkMsg = ref(true)
const checkAuthor = ref(false)

watch(() => offer.value, (newOfferValue) => {
  if (newOfferValue && newOfferValue.title) {
    document.title = newOfferValue.title
  }
}, { immediate: true })

const loadOffer = async () => {
  loadingMsg.value = true
  loading.value = true
  try {
    const response = await axios.get(`${settings.backend}/api/offers/${route.params.id}`, { withCredentials: true })

    offer.value = response.data

    const authorResponse = await axios.get(`${settings.backend}/api/user/link/${offer.value?.author}`, { withCredentials: true })

    author.value = authorResponse.data

    checkMessages()

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const checkMessages = () => {
  axios.post(`${settings.backend}/api/offers/check-msg`, { offerId: offer.value?.id }, { withCredentials: true })
    .then(response => {
      checkMsg.value = response.data.check_msg
      checkAuthor.value = response.data.check_author
      console.log(response)
    })
    .finally(() => {
      loadingMsg.value = false
    })
}

const sendMsg = () => {

  const data = {
    offerId: offer.value?.id,
    msg: message.value
  }

  axios.post(`${settings.backend}/api/offers/send-msg`, data, { withCredentials: true })
    .then(response => {
      console.log(response)
      checkMessages()
    })
    .catch(err => {
      console.log(err)
    })
}

const counter = async () => {
  const currentOffersInCookies = JSON.parse(
    Cookies.get('offerViews') || '[]'
  )
  try {
    const response = await axios.post(
      `${settings.backend}/api/offers/counter`,
      { offer_id: route.params.id },
      { withCredentials: true }
    )
    if (response.data.status) {
      currentOffersInCookies.push(route.params.id.toString())
      Cookies.set('offerViews', JSON.stringify(currentOffersInCookies), { expires: 1 / 144 })
    } else {
      console.log(response.data.message)
    }
  } catch (err) {
    console.log(err)
  }
}

const checkCookie = () => {
  const offerViews = JSON.parse(Cookies.get('offerViews') || '[]')
  if (!offerViews.includes(route.params.id.toString())) {
    counter()
  }
}

onMounted(() => {
  loadOffer()
  checkCookie()
})

</script>