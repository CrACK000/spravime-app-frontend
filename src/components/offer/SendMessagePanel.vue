<script setup lang="ts">
import {inject, onMounted, ref, watchEffect} from "vue"
import axios from "axios"
import offer from "@/plugins/offers"
import SkeletonOfferMessage from "@/components/skeletons/SkeletonOfferMessage.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"

const auth = inject<Auth>('auth')
const loggedIn = ref(auth?.loggedIn as boolean)

const message = ref<string>('')
const checkMsg = ref<boolean>(false)
const loadingMsg = ref<boolean>(false)

const checkMessages = (offerId: string) => {
  loadingMsg.value = true
  axios.post(`${import.meta.env.VITE_BACKEND}/api/offers/check-msg`, { offerId: offerId }, { withCredentials: true })
    .then(response => {
      checkMsg.value = response.data.check_msg
    })
    .finally(() => {
      loadingMsg.value = false
    })
}

const sendMsg = () => {
  const data = {
    offerId: offer.data.offer?._id,
    msg: message.value
  }
  axios.post(`${import.meta.env.VITE_BACKEND}/api/offers/send-msg`, data, { withCredentials: true })
    .then(response => {
      console.log(response)
      checkMessages(String(offer.data.offer?._id))
    })
    .catch(err => {
      console.log(err)
    })
}

onMounted(() => {
  watchEffect(() => {
    if (offer.data.offer?._id) {
      checkMessages(String(offer.data.offer?._id))
    }
  })
})

</script>

<template>
  <transition name="fade">

    <div v-if="!offer.data.offer_loading && !loadingMsg">
      <form method="post" v-if="offer.data.offer?.status && loggedIn && (offer.data.offer?._id !== offer.data.offer.author)" @submit.prevent="sendMsg">
        <panel divide="y" v-if="checkMsg">
          <div class="py-4 px-6 font-medium uppercase">
            Odpovedať
          </div>
          <div class="p-6">
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
          <div class="p-6">Na požiadavku ste už reagovali. Skontrolujte si <router-link :to="{ name: 'messages' }" class="link">Správy</router-link></div>
        </panel>
      </form>
    </div>

    <!-- Loading panel Message -->
    <skeleton-offer-message v-else />

  </transition>
</template>