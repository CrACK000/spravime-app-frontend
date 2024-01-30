<script setup lang="ts">
import {inject, ref} from "vue";
import axios from "axios";
import {settings} from "@/plugins/config";
import {useToast} from "primevue/usetoast";

const toggleModal = inject<() => void>('editReviewModal')!
const toast = useToast()
const props = defineProps({
  showModal: Boolean,
  reviewData: Object as any,
})

const loading = ref<boolean>(false)
const errors = ref<any>([])

const formData = ref<any>({
  review_id: props.reviewData.reviewId as number,
  star: props.reviewData.reviewStar as number,
  recommendation: Boolean(props.reviewData.reviewRecommendation) as boolean,
  description: props.reviewData.reviewDescription as string
})

const submitEdit = () => {

  loading.value = true

  checkForm()

  if (errors.value.length) {
    loading.value = false
    return false
  }

  axios.post(`${settings.backend}/api/reviews/edit`, formData.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({severity: 'success', summary: 'Recenzia', detail: 'Vaša recenzia bola aktualizovaná.', group: 'br', life: 3000})
        closeModalNewReview()
      } else {
        toast.add({severity: 'error', summary: 'Recenzia', detail: response.data.message, group: 'br', life: 3000})
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
  if (!formData.value.description) {
    errors.value.push({ where: 'description', message: 'Napíšte recenziu.' })
  } else if (formData.value.description.length < 100) {
    errors.value.push({ where: 'description', message: 'Napíšte recenziu ktorá má aspoň 100 znakov.' })
  }
  if (formData.value.star <= 0) errors.value.push({ where: 'star', message: 'Vyberte hodnotenie.' })
  if (typeof formData.value.recommendation !== 'boolean') errors.value.push({ where: 'recommendation', message: 'Odporúčanie musí byť určené.' })
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
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full md:w-9/12 lg:w-7/12 xl:w-5/12">

          <form @submit.prevent="submitEdit" @change="checkForm" class="divide-y divide-gray-200 dark:divide-gray-700/40">
            <div class="p-4">
              Upraviť recenziu
            </div>

            <div class="py-6 px-6 md:px-10">

              <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-900/50 dark:text-blue-400">
                Majte na pamäti že Vaša recenzia musí byť pravdivá. Všetky recenzie ktoré budú zámerne negatívne budú odstránené. V prípade že systém recenzií bude využívaný na zámerné
                pošpinenie mena firmy alebo živnostníka, Váš účet bude zablokovaný.
              </div>

              <div class="my-5 text-center">
                Hodnotenie
              </div>

              <div class="flex gap-4 justify-center mb-10" :class="[ getError('star') ? 'text-red-500' : '']">
                <div>
                  <div class="text-center">
                    <label for="star1" class="hover:text-blue-600 cursor-pointer" v-tooltip.top="'Veľmi zlý'">
                      <template v-if="formData.star >= 1">
                        <svg class="w-10 h-10 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
                        </svg>
                      </template>
                    </label>
                  </div>
                  <div class="hidden">
                    <input type="radio" id="star1" name="star" :value="1" v-model="formData.star" />
                  </div>
                </div>
                <div>
                  <div class="text-center">
                    <label for="star2" class="hover:text-blue-600 cursor-pointer" v-tooltip.top="'Zlý'">
                      <template v-if="formData.star >= 2">
                        <svg class="w-10 h-10 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
                        </svg>
                      </template>
                    </label>
                  </div>
                  <div class="hidden">
                    <input type="radio" id="star2" name="star" :value="2" v-model="formData.star" />
                  </div>
                </div>
                <div>
                  <div class="text-center">
                    <label for="star3" class="hover:text-blue-600 cursor-pointer" v-tooltip.top="'Ok'">
                      <template v-if="formData.star >= 3">
                        <svg class="w-10 h-10 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
                        </svg>
                      </template>
                    </label>
                  </div>
                  <div class="hidden">
                    <input type="radio" id="star3" name="star" :value="3" v-model="formData.star" />
                  </div>
                </div>
                <div>
                  <div class="text-center">
                    <label for="star4" class="hover:text-blue-600 cursor-pointer" v-tooltip.top="'Dobrý'">
                      <template v-if="formData.star >= 4">
                        <svg class="w-10 h-10 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
                        </svg>
                      </template>
                    </label>
                  </div>
                  <div class="hidden">
                    <input type="radio" id="star4" name="star" :value="4" v-model="formData.star" />
                  </div>
                </div>
                <div>
                  <div class="text-center">
                    <label for="star5" class="hover:text-blue-600 cursor-pointer" v-tooltip.top="'Veľmi dobrý'">
                      <template v-if="formData.star === 5">
                        <svg class="w-10 h-10 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"/>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-width="2" d="M11 5.1a1 1 0 0 1 2 0l1.7 4c.1.4.4.6.8.6l4.5.4a1 1 0 0 1 .5 1.7l-3.3 2.8a1 1 0 0 0-.3 1l1 4a1 1 0 0 1-1.5 1.2l-3.9-2.3a1 1 0 0 0-1 0l-4 2.3a1 1 0 0 1-1.4-1.1l1-4.1c.1-.4 0-.8-.3-1l-3.3-2.8a1 1 0 0 1 .5-1.7l4.5-.4c.4 0 .7-.2.8-.6l1.8-4Z"/>
                        </svg>
                      </template>
                    </label>
                  </div>
                  <div class="hidden">
                    <input type="radio" id="star5" name="star" :value="5" v-model="formData.star" />
                  </div>
                </div>
              </div>

              <div class="mb-10">
                <div class="flex items-center gap-4 justify-between">
                  <div>
                    Chcete odporučiť tento profil ?
                  </div>
                  <div class="flex items-center gap-5" :class="[ getError('recommendation') ? 'text-red-500' : '']">
                    <label for="recommendationYes" class="flex items-center gap-2 hover:bg-gray-200/50 dark:hover:bg-gray-900/20 py-1 px-2 cursor-pointer rounded-full transition">
                      <input type="radio" name="recommendation" id="recommendationYes" class="cursor-pointer" :value="true" v-model="formData.recommendation" />
                      Ano
                    </label>
                    <label for="recommendationNo" class="flex items-center gap-2 hover:bg-gray-200/50 dark:hover:bg-gray-900/20 py-1 px-2 cursor-pointer rounded-full transition">
                      <input type="radio" name="recommendation" id="recommendationNo" class="cursor-pointer" :value="false" v-model="formData.recommendation" />
                      Nie
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <textarea :class="[ getError('description') ? 'input-danger' : 'input', 'w-full']" rows="6" v-model="formData.description" placeholder="Opíšte Vašu skúsenosť s týmto profilom"></textarea>
                <div class="flex items-center justify-between gap-1 mt-1">
                  <div class="text-red-500 text-sm" v-text="getError('description')"></div>
                  <div class="text-xs">{{ formData.description.length }}</div>
                </div>
              </div>

            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalNewReview" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button" :disabled="loading">
                <template v-if="!loading">Uložiť zmeny</template>
                <template v-else>Ukladá sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>