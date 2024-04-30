<script setup lang="ts">
import {inject, onMounted, onUnmounted, reactive, ref} from "vue"
import {useDialog} from "primevue/usedialog"
import {useRoute} from "vue-router"
import {FwbDropdown} from "flowbite-vue"
import request from "@/plugins/requests"
import {nl2br, timeSince} from "@/plugins/functions"
import axios from "axios"
import {useConfirm} from "primevue/useconfirm"
import {useToast} from "primevue/usetoast"
import Panel from "@/components/template/Panel.vue"
import SkeletonRequestComments from "@/components/skeletons/SkeletonRequestComments.vue"
import Avatar from "@/components/app/Avatar.vue"
import Nickname from "@/components/app/Nickname.vue"
import AddComment from "@/components/dialogs/AddComment.vue"
import ReportModal from "@/components/dialogs/ReportModal.vue"
import PaginationArrow from "@/components/pagination/PaginationArrow.vue"
import PaginationButton from "@/components/pagination/PaginationButton.vue"
import PaginationPages from "@/components/pagination/PaginationPages.vue"
import ReplyComment from "@/components/dialogs/ReplyComment.vue"
import EditComment from "@/components/dialogs/EditComment.vue"
import PaginationContainer from "@/components/pagination/PaginationContainer.vue"
import EditReply from "@/components/dialogs/EditReply.vue"

const confirm = useConfirm()
const toast = useToast()
const dialog = useDialog()
const route = useRoute()
const auth = inject<Auth>('auth')
const userData = ref(auth?.userData as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const perPage = ref(5) // Počet príspevkov na stránku
const currentPage = ref(1) // Aktuálna stránka
const totalPages = ref(0) // Celkový (počet) strán
const maxReplies = ref(2)
const shownReplies = reactive<any>({})
const avatarComment = ref<'md' | 'sm'>('md')
const avatarReply = ref<'sm' | 'xs'>('sm')

const updateAvatarSize = () => {
  if (window.innerWidth <= 767) {    // Tablet
    avatarComment.value = 'sm'
    avatarReply.value = 'xs'
  } else {                           // Desktop
    avatarComment.value = 'md'
    avatarReply.value = 'sm'
  }
}

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
const editComment = (commentData: Comment) => {
  dialog.open(EditComment, {
    props: {
      header: 'Upraviť komentár',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      objectId: route.params.requestId,
      commentData: commentData
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          if (request.data.request?.comments) {
            const index = request.data.request.comments.findIndex((comment) => comment._id === commentData._id)
            if(index !== -1) {
              request.data.request.comments[index].comment = opt.data
            }
          }
        }
      }
    }
  })
}
const removeComment = (_id: string) => {
  confirm.require({
    header: 'Komentár',
    message: 'Naozaj chcete odstrániť komentár?',
    icon: 'fa-regular fa-trash-can',
    rejectIcon: 'fa-regular fa-circle-xmark',
    acceptIcon: 'fa-regular fa-circle-check',
    rejectClass: 'form-secondary-button-sm',
    acceptClass: 'form-danger-button-sm',
    acceptLabel: 'Odstrániť',
    rejectLabel: 'Zrušiť',
    accept: () => {
      axios.post(`${import.meta.env.VITE_BACKEND}/comment/remove`, { objectId: route.params.requestId, commentId: _id, type: 'request' }, { withCredentials: true })
        .then(response => {
          if (response.data.success) {
            if(request.data.request && request.data.request.comments){
              request.data.request.comments = request.data.request.comments.filter((comment) => comment._id !== _id)
            }
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
          console.error('[RemoveCommentError]', error)
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

const addReply = (commentData: Comment) => {
  dialog.open(ReplyComment, {
    props: {
      header: 'Odpovedať na komentár',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      objectId: route.params.requestId,
      commentData: commentData
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          if (request.data.request?.comments) {
            const index = request.data.request.comments.findIndex((comment) => comment._id === commentData._id)
            if(index !== -1) {
              request.data.request.comments[index].replies.push(opt.data)
            }
          }
        }
      }
    }
  })
}
const editReply = (replyData: Comment, commentId: string) => {
  dialog.open(EditReply, {
    props: {
      header: 'Upraviť odpoveď',
      contentClass: 'px-0 pb-0 md:px-6 md:pb-6',
      modal: true,
    },
    data: {
      objectId: route.params.requestId,
      replyData,
      commentId
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          if (request.data.request?.comments) {
            const comment = request.data.request.comments.find((comment) => comment._id === commentId)
            if(comment && comment.replies){
              const reply = comment.replies.find(reply => reply._id === replyData._id)
              if(reply){
                reply.comment = opt.data
              }
            }
          }
        }
      }
    }
  })
}
const removeReply = (replyId: string, commentId: string) => {
  confirm.require({
    header: 'Odpoveď',
    message: 'Naozaj chcete odstrániť odpoveď?',
    icon: 'fa-regular fa-trash-can',
    rejectIcon: 'fa-regular fa-circle-xmark',
    acceptIcon: 'fa-regular fa-circle-check',
    rejectClass: 'form-secondary-button-sm',
    acceptClass: 'form-danger-button-sm',
    acceptLabel: 'Odstrániť',
    rejectLabel: 'Zrušiť',
    accept: () => {
      axios.post(`${import.meta.env.VITE_BACKEND}/comment/reply/remove`, { objectId: route.params.requestId, commentId, replyId, type: 'request' }, { withCredentials: true })
        .then(response => {
          if (response.data.success) {
            if(request.data.request && request.data.request.comments){
              const comment = request.data.request.comments.find((comment) => comment._id === commentId)
              if(comment){
                comment.replies = comment.replies.filter((reply) => reply._id !== replyId)
              }
            }
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
          console.error('[RemoveReplyError]', error)
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
const paginateReplies = (replies: Comment[], limit: any) => {
  replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return replies.slice(0, limit);
}

onMounted(() => {
  window.addEventListener('resize', updateAvatarSize)
  updateAvatarSize()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateAvatarSize)
})
</script>

<template>
  <transition name="fade">

    <div v-if="!request.data.request_loading">

      <div class="p-4 flex justify-between items-center">
        <div class="font-medium uppercase">Komentáre k požiadavke</div>
        <button v-if="loggedIn" type="button" @click="addComment" class="form-button-sm flex items-center gap-x-2">
          <span class="hidden sm:block">Pridať komentár</span>
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
        </button>
      </div>


      <div v-if="loggedIn" class="flex flex-col gap-y-3">

        <panel v-if="request.data.request?.comments.length" v-for="comment in paginate(request.data.request?.comments)" class="relative group p-4 md:p-6">

          <div class="flex items-stretch gap-x-2.5 sm:gap-x-4 h-full">
            <div class="relative flex flex-col gap-y-2">
              <div>
                <Avatar :img="comment.author.avatar" :size="avatarComment" rounded="full"/>
              </div>
              <div v-if="comment.author._id === request.data.request.author._id" class="bg-blue-500/40 text-blue-800 dark:bg-blue-700/30 dark:text-blue-500 text-center px-1 py-0.5 rounded-md text-xs font-medium">
                Autor
              </div>
              <div v-if="comment.replies.length" class="h-full w-full relative">
                <div class="absolute right-1/2 translate-x-1/2 w-[1px] h-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-wrap items-center gap-x-3 mb-1" :class="[ comment.author._id === userData._id ? 'me-20' : 'me-10' ]">
                <router-link :to="{ name: 'profile', params: { userId: comment.author._id }}" class="text-sm md:text-base whitespace-nowrap">
                  <Nickname :nickname="comment.author.profile.name ?? comment.author.username" :verify="comment.author.verify" icon-width="4" class="font-medium truncate"/>
                </router-link>

                <div class="text-xs opacity-50">{{ timeSince(comment.created_at) }}</div>

                <div class="absolute right-2 top-2 lg:opacity-0 lg:group-hover:opacity-100 lg:transition">
                  <div class="flex items-center gap-x-0.5 sm:gap-x-1">
                    <div>
                      <button type="button" title="Odpovedať" @click="addReply(comment)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                        <i class="fa-solid fa-reply"></i>
                      </button>
                    </div>
                    <div v-if="comment.author._id === userData._id">
                      <button type="button" title="Upraviť" @click="editComment(comment)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                        <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                    </div>
                    <div v-if="comment.author._id === userData._id">
                      <button type="button" title="Odstrániť" @click="removeComment(comment._id)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                    <div>
                      <button type="button" title="Nahlásiť" @click="sendReport(comment._id)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="opacity-75 text-sm mb-1" v-html="nl2br(comment.comment)"></div>
              <div v-if="comment.created_at !== comment.updated_at" class="text-end text-[10px] sm:text-xs opacity-50 italic">Upravené {{ timeSince(comment.updated_at) }}</div>
            </div>
          </div>


          <!-- REPLIES -->

          <div v-if="comment.replies.length" v-for="(reply, key) in paginateReplies(comment.replies, shownReplies[comment._id] || maxReplies)" class="flex items-stretch gap-x-2.5 sm:gap-x-4 mt-1">
            <div class="relative -mt-1">
              <div class="w-12 md:w-16"></div>
              <div class="absolute right-1/2 translate-x-1/2 w-[1px] bg-gray-200 dark:bg-gray-700" :class="[ comment.replies.length !== (key + 1) || comment.replies.length > maxReplies ? 'h-full' : 'h-1/2']"></div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-1/2 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="group/item bg-gray-100 dark:bg-gray-900/25 relative w-full rounded-lg p-2">
              <div>
                <div class="flex items-start gap-x-2 sm:gap-x-3">
                  <div>
                    <Avatar :img="reply.author.avatar" :size="avatarReply" rounded="full"/>
                    <div v-if="reply.author._id === request.data.request.author._id" class="bg-blue-500/40 text-blue-800 dark:bg-blue-700/30 dark:text-blue-500 text-center mt-2 px-1 py-0.5 rounded-md text-[8px] sm:text-[10px] font-medium">
                      Autor
                    </div>
                  </div>
                  <div class="w-full">
                    <div class="flex flex-wrap items-center gap-x-3 mb-1 md:mb-1" :class="[ comment.author._id === userData._id ? 'me-20' : 'me-10' ]">
                      <router-link :to="{ name: 'profile', params: { userId: reply.author._id }}" class="text-sm whitespace-nowrap">
                        <Nickname :nickname="reply.author.profile.name ?? reply.author.username" :verify="reply.author.verify" icon-width="4" class="font-medium truncate"/>
                      </router-link>
                      <div class="text-[10px] sm:text-[11px] opacity-50">{{ timeSince(reply.created_at) }}</div>
                      <div class="absolute right-1 top-1 lg:opacity-0 lg:group-hover/item:opacity-100 lg:transition">
                        <div class="flex items-center gap-x-1">
                          <div v-if="reply.author._id === userData._id">
                            <button type="button" title="Upraviť" @click="editReply(reply, comment._id)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                              <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                          </div>
                          <div v-if="reply.author._id === userData._id">
                            <button type="button" title="Odstrániť" @click="removeReply(reply._id, comment._id)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                              <i class="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                          <div>
                            <button type="button" title="Nahlásiť" @click="sendReport(reply._id)" class="text-xs sm:text-sm px-1 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 text-gray-500 hover:text-gray-900 rounded transition">
                              <i class="fa-solid fa-triangle-exclamation"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="opacity-75 text-sm" v-html="nl2br(reply.comment)"></div>
                    <div v-if="reply.created_at !== reply.updated_at" class="text-end text-[10px] sm:text-xs opacity-50 italic">Upravené {{ timeSince(reply.updated_at) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="comment.replies.length > maxReplies" class="flex items-stretch gap-x-2.5 sm:gap-x-4 mt-1">
            <div class="relative -mt-1">
              <div class="w-12 md:w-16"></div>
              <div class="absolute right-1/2 translate-x-1/2 w-[1px] bg-gray-200 dark:bg-gray-700 h-1/2"></div>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-1/2 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="py-3">
              <button type="button" class="link text-sm" v-if="!(shownReplies[comment._id] >= comment.replies.length)" @click="shownReplies[comment._id] = comment.replies.length">
                Zobraziť všetky odpovede
              </button>

              <button type="button" class="link text-sm" v-else @click="shownReplies[comment._id] = maxReplies">
                Zobraziť menej odpovedí
              </button>
            </div>
          </div>

        </panel>


        <panel v-else class="p-6 text-center">
          Zatiaľ neboli pridané žiadne komentáre
        </panel>

        <PaginationContainer v-if="request.data.request?.comments.length && (request.data.request?.comments.length > perPage)">
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
        </PaginationContainer>


      </div>

      <panel v-else class="p-6 text-center">
        Komentáre sú dostupné iba pre prihlásených užívateľov. <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link>
      </panel>




    </div>

    <!-- Loading panel Comments -->
    <skeleton-request-comments v-else />

  </transition>
</template>