<script setup lang="ts">
import {inject, ref} from "vue";
import axios from "axios";
import {settings} from "@/plugins/config";

const props = defineProps({
  showModal: Boolean,
  reviewId: Number
})

const toggleModal = inject<() => void>('editReviewModal')!

const formData = ref<any>({
  star: 3 as number,
  recommendation: true as Boolean,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a facilisis nulla. Vestibulum faucibus molestie justo. Curabitur erat sem, finibus eu tristique non, euismod id leo. Duis eu scelerisque tortor. Donec ut augue et quam varius finibus. Donec efficitur orci ac fringilla hendrerit. Aliquam ullamcorper sapien nec eros sagittis, ut ullamcorper libero vestibulum. Aliquam sed semper metus, sit amet gravida orci. Quisque ligula nulla, dignissim quis mi a, sollicitudin faucibus neque.' as string
})

const closeModalNewReview = () => {
  toggleModal()
}

const submitEdit = () => {
  axios.post(`${settings.backend}/api/reviews/edit`, formData.value, { withCredentials: true })
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
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full md:w-9/12 lg:w-7/12 xl:w-5/12">

          <form @submit.prevent="submitEdit" class="divide-y divide-gray-200 dark:divide-gray-700/40">
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

              <div class="flex gap-4 justify-center mb-10">
                <div>
                  <div class="text-center">
                    <label for="star1" class="hover:text-blue-600 cursor-pointer">
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
                    <label for="star2" class="hover:text-blue-600 cursor-pointer">
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
                    <label for="star3" class="hover:text-blue-600 cursor-pointer">
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
                    <label for="star4" class="hover:text-blue-600 cursor-pointer">
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
                    <label for="star5" class="hover:text-blue-600 cursor-pointer">
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
                  <div class="flex items-center gap-5">
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
                <textarea class="input w-full" rows="6" v-model="formData.description" placeholder="Opíšte Vašu skúsenosť s týmto profilom"></textarea>
              </div>

            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalNewReview" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button">Uložiť zmeny</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>