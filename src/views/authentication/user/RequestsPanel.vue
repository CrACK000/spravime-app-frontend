<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useMeta} from "vue-meta"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {timeUntil} from "@/plugins/functions"
import {useDialog} from "primevue/usedialog"
import {useConfirm} from "primevue/useconfirm"
import userRequests from "@/plugins/auth/user-requests"
import EditRequest from "@/components/dialogs/EditRequest.vue"
import SkeletonUserRequests from "@/components/skeletons/SkeletonUserRequests.vue"
import AccountPanelHead from "@/components/template/AccountPanelHead.vue";

useMeta({ title: 'Moje požiadavky' })

const toast = useToast()
const dialog = useDialog()
const confirm = useConfirm()

const requests = ref<Request[]>(userRequests.data.requests)
const loading = ref<boolean>(userRequests.data.requests_loading)

const removeRequest = (ids: string) => {
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
      axios.post(`${import.meta.env.VITE_BACKEND}/auth/requests/remove`, { ids }, { withCredentials: true })
        .then(response => {

          if (response.data.success) {
            requests.value = requests.value.filter(request => !ids.includes(request._id))
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
          console.error('[RequestError]', error)
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
  dialog.open(EditRequest, {
    props: {
      header: 'Upraviť požiadavku',
      contentClass: 'p-0 md:p-6',
      modal: true,
    },
    data: {
      reviewData: data
    },
    onClose: (opt: any) => {
      if (opt.data) {
        requests.value = requests.value.map(request => request._id === opt.data._id ? opt.data : request)
      }
    }
  })
}

onMounted(async () => {
  if (!requests.value.length) {
    await userRequests.all()
    requests.value = userRequests.data.requests
    loading.value = userRequests.data.requests_loading
  }
})
</script>

<template>
  <div>
    <AccountPanelHead>
      Moje požiadavky
      <template #right>
        <router-link :to="{ name: 'create-request' }" class="flex items-center text-sm py-1.5 px-2.5 bg-gradient-to-bl from-blue-600 to-indigo-500 rounded-lg text-blue-100 hover:text-white transition">
          Vytvoriť novú
        </router-link>
      </template>
    </AccountPanelHead>

    <div class="shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-none md:rounded-lg overflow-hidden flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

      <template v-if="!loading">
        <!-- Všetky -->
        <template v-if="requests.length" v-for="request in requests" :key="request.id">
          <div class="flex flex-wrap gap-5 items-start p-5 bg-white/75 dark:bg-gray-800/50 dark:hover:bg-gray-800 hover:bg-white transition">
            <div>
              <div class="md:text-lg text-gray-900 dark:text-gray-300">
                {{ request.title }}
              </div>
              <div class="text-sm mt-1 flex items-center gap-2">
                <div class="text-blue-500 bg-blue-500/10 py-0.5 px-1 rounded" v-if="request.top">
                  <i class="fa-regular fa-star"></i>
                  Topované na 43 dní
                </div>
                <div class="text-orange-400 bg-orange-400/10 px-1 rounded" v-if="!request.approved">
                  <i class="fa-solid fa-spinner fa-spin me-1"></i>
                  Čaká na schválenie
                </div>
                <div class="text-gray-400 bg-gray-400/10 px-1 rounded">
                  Platnosť {{ timeUntil(request.closed_at) }}
                </div>
              </div>
            </div>
            <div class="ms-auto flex justify-end items-center gap-2">
              <!-- Top button -->
              <button class="text-blue-700 border border-blue-700 hover:bg-blue-800/10 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500/20 dark:focus:ring-blue-800" type="button" @click="showEditModal(request._id, request)">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-width="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"/>
                </svg>
              </button>
              <!-- Edit button -->
              <button class="text-blue-700 border border-blue-700 hover:bg-blue-800/10 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500/20 dark:focus:ring-blue-800" type="button" @click="showEditModal(request._id, request)">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                </svg>
              </button>
              <!-- Remove button -->
              <button type="button" class="text-red-700 border border-red-700 hover:bg-red-800/10 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-1 text-center dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600/20 dark:focus:ring-red-900" @click="removeRequest(request._id)">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
              </button>
            </div>
          </div>
        </template>
        <div v-else class="flex justify-center items-center py-8 px-4 bg-white/75 dark:bg-gray-800/50 text-xl">
          Zatiaľ ste nenapísali žiadnu požiadavku. <router-link :to="{ name: 'create-request' }" class="link ms-1.5">Vytvoriť požiadavku</router-link>
        </div>
      </template>

      <!-- loading my requests -->
      <SkeletonUserRequests v-else/>

    </div>
  </div>
</template>