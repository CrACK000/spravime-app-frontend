<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useMeta} from "vue-meta"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {timeUntil} from "@/plugins/functions"
import {useDialog} from "primevue/usedialog"
import {useConfirm} from "primevue/useconfirm"
import userRequests from "@/plugins/auth/user-requests"
import {FwbDropdown} from "flowbite-vue"
import Panel from "@/components/template/Panel.vue"
import EditRequest from "@/components/dialogs/EditRequest.vue"
import SkeletonUserRequests from "@/components/skeletons/SkeletonUserRequests.vue"
import AccountPanelHead from "@/components/template/AccountPanelHead.vue"
import TopRequest from "@/components/dialogs/TopRequest.vue"

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
const showTopModal = (_id: string, data: any) => {
  dialog.open(TopRequest, {
    props: {
      header: 'Topovať požiadavku',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      reviewData: data
    },
    onClose: (opt: any) => {
      if (opt.data) {
        console.log(opt.data)
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
        <router-link :to="{ name: 'create-request' }" class="form-button-sm">
          Vytvoriť novú
        </router-link>
      </template>
    </AccountPanelHead>

    <panel divide="y">

      <template v-if="!loading">
        <!-- Všetky -->
        <template v-if="requests.length" v-for="request in requests" :key="request.id">
          <div class="flex flex-wrap gap-5 items-center p-5 hover:bg-white dark:hover:bg-gray-900/5 transition first:md:rounded-t-2xl last:md:rounded-b-2xl">
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
                <div class="text-gray-500 bg-gray-200 dark:text-gray-400 dark:bg-gray-400/10 px-1 rounded">
                  Aktívne ešte {{ timeUntil(request.closed_at) }}
                </div>
              </div>
            </div>
            <div class="ms-auto">
              <fwb-dropdown placement="left">
                <template #trigger>
                  <button type="button" class="bg-white dark:bg-gray-800 dark:hover:bg-gray-700/50 hover:bg-gray-100 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 rounded-lg p-2">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                    </svg>
                  </button>
                </template>
                <div class="z-10 bg-white divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow dark:bg-gray-700 overflow-hidden">
                  <ul class="text-gray-700 dark:text-gray-200">
                    <li>
                      <button type="button" @click="showEditModal(request._id, request)" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Upraviť
                      </button>
                    </li>
                    <li>
                      <button type="button" @click="showTopModal(request._id, request)" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Topovať
                      </button>
                    </li>
                    <li>
                      <button type="button" @click="removeRequest(request._id)" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500">
                        Odstrániť
                      </button>
                    </li>
                  </ul>
                </div>
              </fwb-dropdown>
            </div>
          </div>
        </template>
        <div v-else class="flex justify-center items-center py-8 px-4 bg-white/75 dark:bg-gray-800/50 text-xl">
          Zatiaľ ste nenapísali žiadnu požiadavku. <router-link :to="{ name: 'create-request' }" class="link ms-1.5">Vytvoriť požiadavku</router-link>
        </div>
      </template>

      <!-- loading my requests -->
      <SkeletonUserRequests v-else/>

    </panel>
  </div>
</template>