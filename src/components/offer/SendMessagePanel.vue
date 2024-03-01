<script setup lang="ts">
import PanelFormActions from "@/components/PanelFormActions.vue";
import Panel from "@/components/Panel.vue";
import store from "@/plugins/offers";
import {inject, onMounted, ref, watchEffect} from "vue";
import type {Auth, User} from "@/types/users";
import axios from "axios";
import {settings} from "@/plugins/config";
import SkeletonOfferMessage from "@/components/skeleton/SkeletonOfferMessage.vue";

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const message = ref<string>('')
const checkMsg = ref<boolean>(false)
const loadingMsg = ref<boolean>(false)

const checkMessages = (offerId: number) => {
  loadingMsg.value = true
  axios.post(`${settings.backend}/api/offers/check-msg`, { offerId: offerId }, { withCredentials: true })
    .then(response => {
      checkMsg.value = response.data.check_msg
    })
    .finally(() => {
      loadingMsg.value = false
    })
}
const sendMsg = () => {

  const data = {
    offerId: store.state.offer?.id,
    msg: message.value
  }

  axios.post(`${settings.backend}/api/offers/send-msg`, data, { withCredentials: true })
    .then(response => {
      console.log(response)
      checkMessages(Number(store.state.offer?.id))
    })
    .catch(err => {
      console.log(err)
    })
}

onMounted(() => {
  watchEffect(() => {
    if (store.state.offer?.id) {
      checkMessages(Number(store.state.offer?.id));
    }
  });
});

</script>

<template>
  <transition name="fade">

    <div v-if="!store.state.offer_loading && !loadingMsg">
      <form method="post" v-if="store.state.offer?.status && loggedIn && (user.id !== store.state.offer.author)" @submit.prevent="sendMsg">
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