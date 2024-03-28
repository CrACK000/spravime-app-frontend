<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue"
import {useRoute} from "vue-router"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import request from "@/plugins/requests"
import SkeletonRequestMessage from "@/components/skeletons/SkeletonRequestMessage.vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import Panel from "@/components/template/Panel.vue"
import TextareaLabel from "@/components/template/TextareaLabel.vue"

interface ResponseAlready { data: { isAlready: boolean } }

const route = useRoute()
const toast = useToast()
const auth = inject<Auth>('auth')
const loggedIn = ref(auth?.loggedIn as boolean)

const message = ref<string>('')
const checkMsg = ref<boolean>(false)
const loadingMsg = ref<boolean>(false)
const loadingPost = ref<boolean>(false)
const errors = ref<any>([])

const checkAlreadyWrittenMessages = async () => {

  loadingMsg.value = true

  await axios.post(`${import.meta.env.VITE_BACKEND}/messages/check`, { requestId: route.params.requestId }, { withCredentials: true })
    .then((response: ResponseAlready) => {
      checkMsg.value = response.data.isAlready
    })
    .catch(error => {
      console.error('Server neodpovedá.', error)
    })
    .finally(() => {
      loadingMsg.value = false
    })

}
const sendMsg = () => {

  if (!message.value) return false

  loadingPost.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/messages/send`, { requestId: route.params.requestId, msg: message.value }, { withCredentials: true })
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

onBeforeMount(async () => {
  if (loggedIn.value) { await checkAlreadyWrittenMessages() }
})

</script>

<template>
  <transition name="fade">

    <div v-if="!request.data.request_loading && !loadingMsg">
      <form v-if="request.data.request?.status && loggedIn && (auth?.userData.value._id !== request.data.request.author._id)" @submit.prevent="sendMsg">
        <panel divide="y" v-if="!checkMsg">
          <div class="py-4 px-6 font-medium uppercase">
            Odpovedať
          </div>
          <div class="p-6">
            <TextareaLabel label="Správa" label-key="message" v-model="message"/>
          </div>
          <panel-form-actions>
            <template #left>
              <a href="#" class="form-success-button-sm">
                <i class="fa-solid fa-phone me-1.5"></i> Zavolať
              </a>
            </template>
            <template #right>
              <button type="submit" class="form-button" :disabled="loadingPost || errors.length">
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
    <skeleton-request-message v-else />

  </transition>
</template>