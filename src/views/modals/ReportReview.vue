<script setup lang="ts">
import {inject, ref} from "vue";
import axios from "axios";
import {settings} from "@/plugins/config";

const props = defineProps({
  showModal: Boolean,
  reviewId: Number
})

const toggleModal = inject<() => void>('reportReviewModal')!

const formData = ref<any>({
  review_id: 3 as number,
  reason: '' as string
})

const closeModalNewReview = () => {
  toggleModal()
}

const submitReport = () => {
  axios.post(`${settings.backend}/api/reviews/report`, formData.value, { withCredentials: true })
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      console.log('finally')
    })
}

</script>

<template>
  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="props.showModal">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
        <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalNewReview"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full sm:w-10/12 md:w-8/12 xl:w-4/12">

          <form @submit.prevent="submitReport" class="divide-y divide-gray-200 dark:divide-gray-700/40">
            <div class="p-4">
              Nahlásiť recenziu
            </div>

            <div class="p-6 md:p-10">
              <div>
                <textarea class="input w-full" rows="4" v-model="formData.reason" placeholder="Dôvod nahlásenia"></textarea>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalNewReview" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button">Odoslať hlásenie</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>