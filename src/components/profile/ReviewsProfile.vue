<script setup lang="ts">
import {inject, ref, watch} from "vue"
import {useRoute} from "vue-router"
import {nl2br, timeSince} from "@/plugins/functions"
import user from "@/plugins/profile"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"
import {useDialog} from "primevue/usedialog"
import {FwbSpinner} from "flowbite-vue"
import Panel from "@/components/Panel.vue"
import Nickname from "@/components/app/Nickname.vue"
import SkeletonProfileReviews from "@/components/skeletons/SkeletonProfileReviews.vue"
import Avatar from "@/components/app/Avatar.vue"
import ReviewRecommendation from "@/components/profile/reviews/ReviewRecommendation.vue"
import ReviewRating from "@/components/profile/reviews/ReviewRating.vue"
import ReviewCreateModal from "@/components/dialogs/ReviewCreateModal.vue"
import ReportModal from "@/components/dialogs/ReportModal.vue"

const toast = useToast()
const confirm = useConfirm()
const dialog = useDialog()
const route = useRoute()
const auth = inject<Auth>('auth')
const userData = ref(auth?.userData as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const reviews = ref<Review[]>(user.data.reviews)
const loading = ref<boolean>(user.data.reviews_loading)

watch(() => route.params.id, async (newId, oldId) => {
  loading.value = true
  await user.profileReviews(String(newId ?? oldId))
  loading.value = user.data.reviews_loading
  reviews.value = user.data.reviews
}, { immediate: true })

const checkAlreadyReview = () => {
  return reviews.value.some(review => review.author._id === userData.value._id)
}

const showEditMode = ref<number | null>(null)
const textareaEditMode = ref<string>('')
const loadingEditMode = ref<boolean>(false)
const editMode = (key: number, data: string) => {

  textareaEditMode.value = data
  showEditMode.value = key

}
const editModeClose = () => {

  textareaEditMode.value = ''
  showEditMode.value = null

}
const editModeSave = async (_id: string) => {

  loadingEditMode.value = true

  await user.profileEditReview(_id, textareaEditMode.value)
    .then((response: any) => {
      if (response.success) {

        const reviewIndex = reviews.value.findIndex(review => review._id === _id)

        if (reviewIndex !== -1) {
          reviews.value[reviewIndex].description = textareaEditMode.value
        }

        textareaEditMode.value = ''
        showEditMode.value = null

        toast.add({
          severity: 'success',
          summary: 'Úspech',
          detail: "Recenzia bola aktualizovaná.",
          group: 'br',
          life: 4000
        })

      } else {

        textareaEditMode.value = ''
        showEditMode.value = null

        toast.add({
          severity: 'error',
          summary: 'Chyba',
          detail: response.message,
          group: 'br',
          life: 5000
        })

      }
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: 'Server',
        detail: "Vyskytla sa systémová chyba. Skúste to neskôr.",
        group: 'br',
        life: 8000
      })
    })
    .finally(() => {

      loadingEditMode.value = false

    })
}

const removeReview = (_id: string) => {

  confirm.require({
    header: 'Recenzia',
    message: 'Naozaj chcete odstrániť recenziu?',
    icon: 'fa-regular fa-trash-can',
    rejectIcon: 'fa-regular fa-circle-xmark',
    acceptIcon: 'fa-regular fa-circle-check',
    rejectClass: 'form-secondary-button-sm',
    acceptClass: 'form-danger-button-sm',
    acceptLabel: 'Odstrániť',
    rejectLabel: 'Zrušiť',
    accept: () => {
      axios.post(`${process.env.VITE_BACKEND}/reviews/remove`, { review_id: _id }, { withCredentials: true })
        .then(response => {

          if (response.data.success) {

            reviews.value = reviews.value.filter(review => review._id !== _id)

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

const showModalCreateReview = () => {
  dialog.open(ReviewCreateModal, {
    props: {
      header: 'Napísať recenziu',
      contentClass: 'max-w-3xl',
      modal: true,
    },
    data: {
      profileId: route.params.id
    },
    onClose: (opt: any) => {
      reviews.value.push(opt.data)
    }
  })
}

const sendReport = () => {
  dialog.open(ReportModal, {
    props: {
      header: 'Odoslať hlásenie',
      modal: true,
    },
    data: {
      type: "review",
      key: route.params.id,
      author: userData.value._id
    } as ReportData
  })
}
</script>

<template>

  <div v-if="!loading">

    <div class="flex justify-between items-end gap-3 px-4 md:px-0 mb-4">
      <div class="text-xl font-light">Recenzie</div>
      <button type="button" class="form-button-sm" v-if="loggedIn && !(userData._id === user.data.user?._id) && !checkAlreadyReview()" @click="showModalCreateReview">
        <i class="fa-solid fa-pencil me-1"></i> Napísať recenziu
      </button>
    </div>

    <panel divide="y" v-if="loggedIn">

      <div v-for="(review, key) in reviews" v-if="reviews.length" class="p-4 review">
        <div class="flex items-center gap-4">

          <Avatar :img="review.author.avatar" :alt="review.author.profile.name ?? review.author.username" rounded="full" />

          <div class="flex flex-col md:flex-row justify-between items-start">
            <div>
              <router-link :to="{ name: 'profile', params: { id: review.author._id } }" class="font-medium hover:text-gray-900 dark:hover:text-gray-300 transition">
                <nickname :nickname="review.author.profile.name?.length ? review.author.profile.name : review.author.username" :verify="review.author.verify" icon-width="4" />
              </router-link>
              <div class="flex flex-col md:flex-row gap-1 md:gap-5 md:items-center text-xs mt-0.5">
                <div>{{ timeSince(review.created_at) }}</div>
                <ReviewRating :rating="review.rating"/>
                <ReviewRecommendation :recommendation="review.recommendation"/>
              </div>
            </div>
          </div>

          <div class="flex gap-1 review_buttons ms-auto" v-if="userData">
            <button v-tooltip.top="'Nahlásiť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="sendReport" v-if="!(userData._id === review.author._id)">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </button>
            <button v-tooltip.top="'Upraviť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="editMode(key, review.description)" v-if="userData._id === review.author._id">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button v-tooltip.top="'Odstrániť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="removeReview(review._id)" v-if="userData._id === review.author._id">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>

        </div>
        <div class="p-5 text-sm">

          <div v-if="showEditMode !== key" v-html="nl2br(review.description)"></div>

          <div v-else>

            <textarea v-model="textareaEditMode" :disabled="loadingEditMode" class="bg-transparent w-full rounded-xl border border-dashed text-sm" rows="4"></textarea>

            <div class="flex justify-end items-center gap-x-4">
              <button type="button" @click="editModeSave(review._id)" :disabled="loadingEditMode" class="text-blue-400 hover:text-blue-500 transition flex items-center gap-x-1">
                <fwb-spinner v-if="loadingEditMode" class="me-1" />
                <svg v-else class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 4.7 4.5 9.3-9"/>
                </svg>
                uložiť zmeny
              </button>
              <button type="button" @click="editModeClose" :disabled="loadingEditMode" class="text-red-400 hover:text-red-500 transition flex items-center gap-x-1">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
                </svg>
                zrušiť
              </button>
            </div>

          </div>

        </div>
      </div>

      <div v-else class="p-5">
        Na tento profil ešte nikto nenapísal recenziu.
      </div>

    </panel>

    <panel v-else class="p-5">
      Recenzie profilu môžete vidieť až po prihlásení. <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link>
    </panel>

  </div>

  <skeleton-profile-reviews v-else />

</template>