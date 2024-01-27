<script lang="ts">
import axios from "axios"
import { settings } from "@/plugins/config"

export default {
  name: 'Messages',
  props: ['userId', 'loadingPanel'],
  data() {
    return {
      messages: [] as any,
      offerTitle: '',
      offerId: null,

      loading: false,

      postMessage: {
        message: '',
        errors: [] as any,
        enablePost: false,
        loading: false,
      }
    }
  },
  mounted() {
    this.selectMessages()
    this.scrollToBottom()
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    selectMessages(){

      this.loading = true

      axios.get(settings.backend + '/api/messages/' + this.userId, { withCredentials: true })
        .then((response) => {
          this.messages = response.data.messages
          this.offerId = response.data.offer.id
          this.offerTitle = response.data.offer.title
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false;
        })
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.scrollContainer) {
          const container = this.$refs.scrollContainer as HTMLElement;
          container.scrollTop = container.scrollHeight;
        }
      })
    },
    addMessage() {
      this.postMessage.loading = true

      const data = {
        id: this.userId,
        message: this.postMessage.message,
        offerId: this.offerId
      }

      axios.post(settings.backend + '/api/messages/add', data, { withCredentials: true })
        .then((response) => {
          if (response.data.success === true) {
            this.$toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
            this.postMessage.message = ''
            this.selectMessages()
          } else {
            this.postMessage.errors = response.data.errors
            this.postMessage.errors.forEach((el: any) => {
              this.$toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 5000 })
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.postMessage.loading = false
        })
    },
    closeMsgPanel() {
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
  }
}
</script>

<template>
  <div class="h-14 bg-gray-300/20 dark:bg-gray-700/5 shadow-lg flex items-center">
    <button type="button" @click="closeMsgPanel" class="px-5 border-r border-gray-200 dark:border-gray-700/40 self-stretch hover:bg-black/5 text-gray-500 block md:hidden">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
      </svg>
    </button>
    <div v-if="!loading && !loadingPanel" v-text="offerTitle" class="px-4 md:text-base text-sm"></div>
    <div v-else class="loading-bar h-3 w-60 ms-4 animate-pulse"></div>
  </div>
  <div ref="scrollContainer" class="h-full overflow-y-auto hide-scrollbar p-4 md:p-8 pb-32">
    <div v-if="!loading && !loadingPanel" v-for="message in messages" class="text-sm md:px-3" :class="[message.from_id !== userId ? 'text-end' : 'text-start']">
      <div class="inline-block mb-2 p-2 rounded-md leading-tight shadow-lg"
           :class="[message.from_id !== userId ? 'bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-300' : 'bg-blue-600 dark:bg-blue-700/60 text-white dark:text-gray-300']">
        {{ message.message }}
      </div>
    </div>
    <div v-else class="absolute inset-0 flex items-center justify-center">
      <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
  <div class="sticky bottom-0 w-full p-5 z-50">
    <form method="post" @submit.prevent="addMessage" @keyup="postMessage.enablePost = !!postMessage.message">
      <div class="h-20 relative group">
        <textarea v-model="postMessage.message" placeholder="Napísať správu" class="w-full h-full hide-scrollbar resize-none bg-gray-100/80 dark:bg-gray-900/80 focus:bg-white dark:focus:bg-gray-900 backdrop-blur-3xl shadow-md shadow-black/10 dark:shadow-lg dark:shadow-gray-800/10 p-3 pe-20 rounded-lg group-hover:ring-4 focus:ring-4 group-hover:ring-blue-600 border-0 transition duration-100"></textarea>
        <div class="absolute bottom-0 h-full right-0 p-2">
          <button type="submit" class="form-button-sm h-full w-16" :disabled="!postMessage.enablePost || loading">
            <template v-if="!postMessage.loading">
              <svg class="w-5 h-5 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2.707 14.293 5.586-5.586a1 1 0 0 0 0-1.414L2.707 1.707A1 1 0 0 0 1 2.414v11.172a1 1 0 0 0 1.707.707Z"/>
              </svg>
            </template>
            <template v-else>
              <svg aria-hidden="true" role="status" class="inline w-5 h-5 text-white animate-spin mx-auto" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
            </template>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>