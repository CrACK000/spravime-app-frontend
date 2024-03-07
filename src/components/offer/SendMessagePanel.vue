<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue"
import {useRoute} from "vue-router"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import offer from "@/plugins/offers"
import {FwbButton} from "flowbite-vue"
import SkeletonOfferMessage from "@/components/skeletons/SkeletonOfferMessage.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"

const route = useRoute()
const toast = useToast()
const auth = inject<Auth>('auth')
const loggedIn = ref(auth?.loggedIn as boolean)

const message = ref<string>('')
const checkMsg = ref<boolean>(false)
const loadingMsg = ref<boolean>(false)
const loadingPost = ref<boolean>(false)
const changed = ref<boolean>(false)
const errors = ref<any>([])

const checkAlreadyWrittenMessages = async () => {

  loadingMsg.value = true

  await axios.post(`${import.meta.env.VITE_BACKEND}/messages/check`, { offerId: route.params.id }, { withCredentials: true })
    .then(response => {
      checkMsg.value = response.data.isAlready
    })
    .finally(() => {
      loadingMsg.value = false
    })

}
const sendMsg = () => {

  if (!checkForm()) return

  loadingPost.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/messages/send`, { offerId: route.params.id, msg: message.value }, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        checkAlreadyWrittenMessages()
        toast.add({ severity: 'success', summary: 'Správy', detail: response.data.message, group: 'br', life: 3000 })
      } else {
        toast.add({ severity: 'error', summary: 'Správy', detail: response.data.message, group: 'br', life: 3000 })
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      loadingPost.value = false
    })

}
const checkForm = () => {

  errors.value = []

  changed.value = message.value.length > 0

  if (!(message.value.length > 5)) {
    errors.value.push({where: 'message', message: 'Napíšte správu.'})
  }

  return !errors.value.length

}
const getError = (search: any) => {
  const emailError = errors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}

onBeforeMount(async () => {
  if (loggedIn.value) {
    await checkAlreadyWrittenMessages()
  }
})

</script>

<template>
  <transition name="fade">

    <div v-if="!offer.data.offer_loading && !loadingMsg">
      <form v-if="offer.data.offer?.status && loggedIn && (auth?.userData.value._id !== offer.data.offer.author._id)" @submit.prevent="sendMsg" @keyup="checkForm">
        <panel divide="y" v-if="!checkMsg">
          <div class="py-4 px-6 font-medium uppercase">
            Odpovedať
          </div>
          <div class="p-6">
            <label class="mb-1 block" for="message">Správa</label>
            <textarea v-model="message" :class="[ getError('message') ? 'input-danger' : 'input', 'w-full']" rows="4" id="message"></textarea>
          </div>
          <panel-form-actions>
            <template #left>
              <a href="#" class="form-success-button-sm">
                <i class="fa-solid fa-phone me-1.5"></i> Zavolať
              </a>
            </template>
            <template #right>
              <button type="submit" class="form-button" :disabled="!changed || loadingPost || errors.length">
                <template v-if="loadingPost"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Odosiela sa</template>
                <template v-else><i class="fa-regular fa-paper-plane me-1"></i> Odoslať</template>
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