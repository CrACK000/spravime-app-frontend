<script setup lang="ts">
import {inject, ref} from "vue"
import {useDialog} from "primevue/usedialog"
import {useRoute} from "vue-router"
import {FwbDropdown} from "flowbite-vue"
import request from "@/plugins/requests"
import {timeSince} from "@/plugins/functions"
import Panel from "@/components/template/Panel.vue"
import SkeletonRequestComments from "@/components/skeletons/SkeletonRequestComments.vue"
import Avatar from "@/components/app/Avatar.vue"
import Nickname from "@/components/app/Nickname.vue"
import AddComment from "@/components/dialogs/AddComment.vue"
import ReportModal from "@/components/dialogs/ReportModal.vue"
import PaginationArrow from "@/components/pagination/PaginationArrow.vue"
import PaginationButton from "@/components/pagination/PaginationButton.vue"
import PaginationPages from "@/components/pagination/PaginationPages.vue"

const dialog = useDialog()
const route = useRoute()
const auth = inject<Auth>('auth')
const userData = ref(auth?.userData as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const perPage = ref(5) // Počet príspevkov na stránku
const currentPage = ref(1) // Aktuálna stránka
const totalPages = ref(0) // Celkový (počet) strán

const addComment = () => {
  dialog.open(AddComment, {
    props: {
      header: 'Pridať komentár',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      objectId: route.params.requestId
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          request.data.request?.comments.unshift(opt.data)
        }
      }
    }
  })
}
const sendReport = (id: string) => {
  dialog.open(ReportModal, {
    props: {
      header: 'Odoslať hlásenie',
      modal: true,
    },
    data: {
      type: "comment",
      key: id,
      author: userData.value._id
    } as ReportData
  })
}

const paginate = (items: Comment[]) => {
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  totalPages.value = Math.ceil(items.length / perPage.value);
  return items.slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value);
}
</script>

<template>
  <transition name="fade">

    <panel divide="y" v-if="!request.data.request_loading">

      <div class="py-4 px-6 flex justify-between items-center">
        <div class="font-medium uppercase">Komentáre k požiadavke</div>
        <button v-if="loggedIn" type="button" @click="addComment" class="form-button-sm -my-1 -me-3 flex items-center gap-x-2">
          <span class="hidden sm:block">Pridať komentár</span>
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
        </button>
      </div>


      <div v-if="loggedIn" class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">

        <div v-if="request.data.request?.comments.length" v-for="comment in paginate(request.data.request?.comments)" class="group p-4 md:p-6">

          <div class="float-left me-4 mb-2">
            <Avatar :img="comment.author.avatar" size="md" class="hidden md:block" rounded="full"/>
            <Avatar :img="comment.author.avatar" size="sm" class="md:hidden block" rounded="full"/>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 mb-3 md:mb-1">
            <router-link :to="{ name: 'profile', params: { userId: comment.author._id }}" class="order-1 w-40 xxs:w-48 xs:w-56 sm:w-auto text-sm md:text-base whitespace-nowrap">
              <Nickname :nickname="comment.author.profile.name ?? comment.author.username" :verify="comment.author.verify" class="font-medium truncate"/>
            </router-link>
            <div v-if="comment.author._id === request.data.request.author._id" class="order-3 md:order-2 bg-blue-500/40 text-blue-800 dark:bg-blue-700/30 dark:text-blue-500 px-1 py-0.5 rounded-md text-xs font-medium">
              Autor
            </div>
            <div class="order-4 md:order-3 text-xs opacity-50">{{ timeSince(comment.created_at) }}</div>
            <div class="order-2 md:order-4 ms-auto">
              <fwb-dropdown placement="left">
                <template #trigger>
                  <button type="button" class="hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-lg p-2">
                    <svg class="w-4 h-4 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                    </svg>
                  </button>
                </template>
                <div class="z-10 bg-white divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow dark:bg-gray-700 overflow-hidden">
                  <ul class="text-gray-700 dark:text-gray-200">
                    <li v-if="comment.author._id === userData._id">
                      <button type="button" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Upraviť
                      </button>
                    </li>
                    <li>
                      <button type="button" @click="sendReport(comment._id)" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Nahlásiť
                      </button>
                    </li>
                    <li v-if="comment.author._id === userData._id">
                      <button type="button" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500">
                        Odstrániť
                      </button>
                    </li>
                  </ul>
                </div>
              </fwb-dropdown>
            </div>
          </div>

          <div class="opacity-75 text-sm" v-html="comment.comment"></div>

        </div>


        <div v-else class="p-6 text-center">
          Zatiaľ neboli pridané žiadne komentáre
        </div>

        <div v-if="request.data.request?.comments.length && (request.data.request?.comments.length > perPage)">
          <PaginationPages class="justify-center">
            <PaginationArrow side="left" text="Späť" :disabled="currentPage <= 1" @click="currentPage--"/>
            <PaginationButton
              v-for="page in totalPages"
              :page="page"
              :key="page"
              :disabled="page === currentPage"
              @click="currentPage = page"
            />
            <PaginationArrow side="right" text="Ďalšie" :disabled="currentPage >= totalPages" @click="currentPage++"/>
          </PaginationPages>
        </div>


      </div>

      <div v-else class="p-6 text-center">
        Komentáre sú dostupné iba pre prihlásených užívateľov. <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link>
      </div>




    </panel>

    <!-- Loading panel Comments -->
    <skeleton-request-comments v-else />

  </transition>
</template>