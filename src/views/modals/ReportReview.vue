<script setup lang="ts">
import {inject, ref} from "vue";
import axios from "axios";
import {useToast} from "primevue/usetoast";

const toggleModal = inject<() => void>('reportReviewModal')!
const toast = useToast()
const props = defineProps({
  showModal: Boolean,
  reviewId: String
})

const loading = ref<boolean>(false)
const errors = ref<any>([])

const formData = ref<any>({
  review_id: props.reviewId as string,
  reason: '' as string
})

const submitReport = () => {

  loading.value = true

  checkForm()

  if (errors.value.length) {
    loading.value = false
    return false
  }

  axios.post(`${import.meta.env.VITE_BACKEND}/api/reviews/report`, formData.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({severity: 'success', summary: 'Hlásenie', detail: 'Hlásenie bolo odoslané.', group: 'br', life: 3000})
        closeModalNewReview()
      } else {
        toast.add({severity: 'error', summary: 'Hlásenie', detail: response.data.message, group: 'br', life: 3000})
        console.log(response)
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
      console.log('finally')
    })
}

const checkForm = () => {
  errors.value = []
  if (!formData.value.reason) {
    errors.value.push({ where: 'reason', message: 'Napíšte dôvod nahlásenia.' })
  } else if (formData.value.reason.length < 100) {
    errors.value.push({ where: 'reason', message: 'Napíšte dôvod ktorý má aspoň 100 znakov.' })
  }
}

const getError = (search: any) => {
  const emailError = errors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}

const closeModalNewReview = () => {
  toggleModal()
}

</script>

<template>
  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="props.showModal">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
        <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalNewReview"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full sm:w-10/12 md:w-8/12 xl:w-4/12">

          <form @submit.prevent="submitReport" @keyup="checkForm" class="divide-y divide-gray-200 dark:divide-gray-700/40">
            <div class="p-4">
              Nahlásiť recenziu
            </div>

            <div class="p-6 md:p-10">
              <div>
                <textarea :class="[ getError('reason') ? 'input-danger' : 'input', 'w-full']" rows="5" v-model="formData.reason" placeholder="Dôvod nahlásenia"></textarea>
                <div class="flex items-center justify-between gap-1 mt-1">
                  <div class="text-red-500 text-sm" v-text="getError('reason')"></div>
                  <div class="text-xs">{{ formData.reason.length }}</div>
                </div>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalNewReview" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button" :disabled="loading">
                <template v-if="!loading">Odoslať hlásenie</template>
                <template v-else>Odosiela sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>