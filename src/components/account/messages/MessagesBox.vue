<script setup lang="ts">
import {computed, inject, onBeforeMount, ref} from "vue"
import axios from "axios"
import msg from "@/plugins/messages"
import {useToast} from "primevue/usetoast"
import {timeSince} from "@/plugins/functions"
import Avatar from "@/components/app/Avatar.vue"
import SkeletonMessagesContainer from "@/components/skeletons/SkeletonMessagesContainer.vue"
import MessagesBackButton from "@/components/MessagesBackButton.vue";
import MessagesContainerHead from "@/components/MessagesContainerHead.vue";
import MessagesContainerMsg from "@/components/MessagesContainerMsg.vue";
import MessagesContainerBody from "@/components/MessagesContainerBody.vue";
import MessagesContainerFooter from "@/components/MessagesContainerFooter.vue";

interface TemplateMessage {
  _id: string,
  message: string,
  new: boolean,
  created_at: string,
  updated_at: string,
  author: boolean,
}

type Mode = 'from' | 'to';

const props = defineProps({
  containerId: String
})

const toast = useToast()
const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

const messageInput = ref<string>('')
const sendLoading = ref<boolean>(false)

function addMessage() {

  sendLoading.value = true

  const data = {
    message: messageInput.value,
    container: props.containerId
  }

  axios.post(`${process.env.VITE_BACKEND}/auth/messages/add`, data, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {

        // Kód pre zlúčenie správ
        if(msg.data.container && response.data.data.container) {
          (['from', 'to'] as Mode[]).forEach((mode: Mode) => {
            if(response.data.data.container[mode]?.messages) {
              response.data.data.container[mode].messages.forEach((newMessage: Message) => {

                // Nájdite existujúce správy s rovnakým _id
                const existingMessage = msg.data.container.container[mode].messages?.find((message: Message) => message._id === newMessage._id)

                if(existingMessage) {

                  // Ak existuje taká správa, aktualizujte jej hodnoty
                  Object.assign(existingMessage, newMessage);
                } else {

                  // Ak neexistuje taká správa, pridajte ju do zoznamu správ
                  msg.data.container.container[mode].messages?.push(newMessage)
                }
              })
            }
          })
        }

        messageInput.value = ''
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 3000 })
      } else {
        toast.add({ severity: 'success', summary: 'Chyba', detail: response.data.message, group: 'br', life: 3000 })
      }
    })
    .finally(() => {
      sendLoading.value = false
    })
}

const closeMsgPanel = () => {
  ["accounts", "messages"].forEach(id => {
    const element = document.getElementById(id)
    if (!element) return
    if (id === "accounts") {
      element.classList.remove('hidden', 'md:block')
    } else if (id === "messages") {
      element.classList.add('hidden', 'md:block')
    }
  })
}

const mergedMessages = computed<TemplateMessage[]>(() => {
  if (!msg.data.container) return []

  const fromMessages = msg.data.container.container.from.messages.map(m => ({
    ...m,
    author: msg.data.container?.container.from.user_id._id === user.value._id,
  }))

  const toMessages = msg.data.container.container.to.messages.map(m => ({
    ...m,
    author: msg.data.container?.container.to.user_id._id === user.value._id,
  }))

  return [...fromMessages, ...toMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
})

onBeforeMount(async () => {
  if (String(msg.data.container._id) !== props.containerId) {
    await msg.selectContainer(String(props.containerId))
  }
})

</script>

<template>

  <MessagesContainerHead>
    <template #backButton>
      <MessagesBackButton @click="closeMsgPanel"/>
    </template>
    <template #title>
      <div v-if="!msg.data.container_loading" v-text="msg.data.container.key.title" class="px-4 md:text-base text-sm line-clamp-2"></div>
      <div v-else class="loading-bar h-3 w-60 ms-4 animate-pulse"></div>
    </template>
  </MessagesContainerHead>

  <MessagesContainerBody>
    <transition-group enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut" tag="div">
      <MessagesContainerMsg v-if="!msg.data.container_loading" v-for="(message, key) in mergedMessages" :author="message.author" :key="key">
        <template #message>{{ message.message }}</template>
        <template #date>{{ timeSince(message.created_at) }}</template>
        <template #avatar>
          <Avatar :img="`${(msg.data.container.container.from.user_id._id === user._id ? message.author : !message.author) ? msg.data.container.container.from.user_id.avatar : msg.data.container.container.to.user_id.avatar}`"
                  :alt="msg.data.container.container.from.user_id.profile.name ?? msg.data.container.container.from.user_id.username"
                  :class="[message.author ? 'order-2' : 'order-1']"
                  resolution="50x50"
                  size="xs"
                  rounded="full"
                  class="mt-0.5"
          />
        </template>
      </MessagesContainerMsg>
      <skeleton-messages-container v-else />
    </transition-group>
    <div class="h-36"></div>
  </MessagesContainerBody>

  <MessagesContainerFooter :submit="addMessage">
    <template #textarea>
      <textarea v-model="messageInput" placeholder="Napísať správu" class="w-full h-full hide-scrollbar resize-none bg-gray-100/80 dark:bg-gray-900/80 focus:bg-white dark:focus:bg-gray-900 backdrop-blur-3xl shadow-md shadow-black/10 dark:shadow-lg dark:shadow-gray-800/10 p-3 pe-20 rounded-lg group-hover:ring-4 focus:ring-4 group-hover:ring-blue-600 border-0 transition duration-100"></textarea>
    </template>
    <template #button>
      <button type="submit" class="form-button-sm h-full w-14" :disabled="!messageInput.length || sendLoading">
        <template v-if="!sendLoading">
          <svg class="w-5 h-5 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2.707 14.293 5.586-5.586a1 1 0 0 0 0-1.414L2.707 1.707A1 1 0 0 0 1 2.414v11.172a1 1 0 0 0 1.707.707Z"/>
          </svg>
        </template>
        <template v-else>
          <svg aria-hidden="true" role="status" class="inline w-5 h-5 text-white animate-spin mx-auto" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
        </template>
      </button>
    </template>
  </MessagesContainerFooter>

</template>