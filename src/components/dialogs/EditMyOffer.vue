<script setup lang="ts">
import {inject, ref} from "vue"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {  getError, validTitle, checkError,
  validSection, validCategory, validAddress,
  validDescription, validStartAt, validEndAt } from "@/plugins/validation"
import categoriesData from "@/plugins/data/categories.json"
import TextareaLabel from "@/components/TextareaLabel.vue"
import SelectLabel from "@/components/SelectLabel.vue"
import InputLabel from "@/components/InputLabel.vue"
import InputContainer from "@/components/InputContainer.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import PanelForm from "@/components/PanelForm.vue"

type DialogRefType = {
  data: any,
  close: (callbackData?: any) => void
}

const toast   = useToast()
const loading = ref<boolean>(false)
const errors  = ref<any>([])

const sections    = ref<Sections[]>(categoriesData.sections)
const categories  = ref<Categories[]>(categoriesData.categories)

const showModalAddress      = ref<boolean>(false)
const showButtonSetAddress  = ref<boolean>(true)
const addressErrors         = ref<any>([])
const address_mode          = ref<string>('address')
const location              = ref<string>('')
const location_from         = ref<string>('')
const location_to           = ref<string>('')

const dialogRef = inject('dialogRef') as { value: DialogRefType }
const offerData = dialogRef.value.data.reviewData as Offer

const form = ref<any>({
  offer_id: offerData._id as string,
  title: offerData.title as string,
  section: offerData.section as number,
  category: offerData.category as number,
  address: offerData.address as string,
  time_range: offerData.time_range as boolean | null,
  start_at: offerData.time_range?.start_at as string,
  end_at: offerData.time_range?.end_at as string,
  description: offerData.description as string,
})

const closeDialog = (callback: any) => {

  dialogRef.value.close(callback)

}
const submitEditOffer = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${process.env.VITE_BACKEND}/auth/offers/edit`, form.value, { withCredentials: true })
    .then(response => {

      if (response.data.success) {

        toast.add({
          severity: 'success',
          summary: 'Požiadavka',
          detail: response.data.message,
          group: 'br',
          life: 4000
        })

        closeDialog(response.data.offer)

      } else {

        errors.value = response.data.errors
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
        life: 8000
      })
    })
    .finally(() => {

      loading.value = false

    })
}
const checkForm = () => {

  errors.value = []

  checkError(errors.value, validTitle(form.value.title))
  checkError(errors.value, validSection(form.value.section))
  checkError(errors.value, validCategory(form.value.category))
  checkError(errors.value, validAddress(form.value.address))
  checkError(errors.value, validDescription(form.value.description))

  if (form.value.time_range) {
    checkError(errors.value, validStartAt(form.value.start_at))
    checkError(errors.value, validEndAt(form.value.end_at))
  }

  return !errors.value.length

}
const addressMode = (input: string) => {
  address_mode.value = input
  location.value = ''
  location_from.value = ''
  location_to.value = ''
}
const setAddress = () => {

  checkAddress()

  if (addressErrors.value.length) {
    return false
  }

  if (address_mode.value === 'address') {
    form.value.address = location.value
  } else if (address_mode.value === 'route'){
    form.value.address = `${location_from.value} - ${location_to.value}`
  } else {
    form.value.address = ''
  }

  clearError('address')
  showButtonSetAddress.value = false
  closeModalAddress()
}
const checkAddress = () => {

  addressErrors.value = []

  if (address_mode.value === 'address') {
    if (!location.value.length) addressErrors.value.push({ where: 'location', message: 'Adresa musí byť vyplnená.' })
  }

  if (address_mode.value === 'route'){
    if (!location_from.value.length) addressErrors.value.push({ where: 'location_from', message: 'Adresa musí byť vyplnená.' })
    if (!location_to.value.length) addressErrors.value.push({ where: 'location_to', message: 'Adresa musí byť vyplnená.' })
  }

}
const getAddressError = (search: any) => {
  const emailError = addressErrors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const closeTimeRange = () => {

  form.value.start_at = null
  form.value.end_at = null
  form.value.time_range = false

}
const closeModalAddress = () => {
  showModalAddress.value = false
}
const clearError = (where: string) => {
  return errors.value = errors.value.filter((error: any) => error.where !== where)
}

</script>

<template>
  <div>
    <form @submit.prevent="submitEditOffer" class="divide-y divide-gray-200 dark:divide-gray-700/40">

      <panel-form width="full">
        <InputContainer>

          <InputLabel
            type="text"
            label="Stručný názov požiadavky"
            label-key="title"
            placeholder="Požiadavka na..."
            v-model="form.title"
            @change="clearError('title')"
            :error="getError(errors, 'title')"
            info="Príklad „Požiadavka na výstavbu štvorizbového bungalovu na kľúč”"
          />

          <SelectLabel
            label="Sekcia"
            label-key="section"
            v-model="form.section"
            @change="clearError('section')"
            :error="getError(errors, 'section')"
            class-text="w-full"
          >
            <template #data>
              <option :value="0" class="text-gray-500">Vyberte sekciu</option>
              <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
            </template>
          </SelectLabel>

          <SelectLabel
            label="Kategórie"
            label-key="category"
            v-model="form.category"
            @change="clearError('category')"
            :error="getError(errors, 'category')"
            class-text="w-full"
            info="Výber kategórie pod ktorú spadá požiadavka."
          >
            <template #data>
              <option :value="0" class="text-gray-500">Vyberte kategóriu</option>
              <template v-for="category in categories">
                <option v-if="Number(form.section) === category.section_id" :value="category.id">{{ category.title }}</option>
              </template>
            </template>
          </SelectLabel>

        </InputContainer>
      </panel-form>

      <panel-form width="full">
        <div class="mb-5" v-if="showButtonSetAddress">
          <button type="button" @click="showModalAddress = !showModalAddress" class="form-secondary-button flex gap-2 items-center">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 14h0a7 7 0 1 0-11.5 0h0l.1.3.3.3L12 21l5.1-6.2.6-.7.1-.2Z"/>
            </svg>
            Nastaviť adresu
          </button>
        </div>
        <div>
          <div class="mb-1">Adresa</div>
          <div :class="[ getError(errors, 'address') ? 'border-red-200 dark:border-red-700/40' : 'border-gray-200 dark:border-gray-700/40', 'p-3 border rounded-md']">
            <div v-if="form.address.length">
              <span v-text="form.address" class="font-semibold"></span> - <button type="button" @click="showModalAddress = !showModalAddress" class="link text-sm">zmeniť</button>
            </div>
            <div v-else>
              Je potrebné nastaviť adresu
            </div>
          </div>
          <div class="text-red-500 text-sm mt-1.5" v-if="getError(errors, 'address')" v-text="getError(errors, 'address')"></div>
        </div>
      </panel-form>

      <panel-form width="full">
        <div v-if="!form.time_range">
          <div class="mb-1">Dátum prác</div>
          <button type="button" @click="form.time_range = true" class="form-secondary-button">
            <i class="fa-regular fa-calendar me-1"></i> Zadať časový rozsah
          </button>
          <div class="mt-2 text-sm opacity-75">
            Ak je potrebné požiadavku vykonať v určitom čase.
          </div>
        </div>
        <div v-if="form.time_range">
          <InputContainer>

            <InputLabel
              type="datetime-local"
              label="Začiatok prác"
              label-key="start_at"
              v-model="form.start_at"
              @change="clearError('start_at')"
              :error="getError(errors, 'start_at')"
            />

            <InputLabel
              type="datetime-local"
              label="Ukončenie prác"
              label-key="end_at"
              v-model="form.end_at"
              @change="clearError('end_at')"
              :error="getError(errors, 'end_at')"
            />

            <div class="text-sm text-end">
              <button type="button" class="link" @click="closeTimeRange">zrušiť</button>
            </div>

          </InputContainer>
        </div>
      </panel-form>

      <panel-form width="full">

        <TextareaLabel
          label="Informácie k požiadavke"
          label-key="description"
          :rows="8"
          counter
          :max-count="1000"
          v-model="form.description"
          @change="clearError('description')"
          :error="getError(errors, 'description')"
        />

      </panel-form>

      <panel-form-actions class="-mx-6 -mb-6">
        <template #left>
          <button type="reset" @click="closeDialog" class="form-secondary-button-sm">
            <i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť
          </button>
        </template>
        <template #right>
          <button type="submit" class="form-button" :disabled="loading">
            <template v-if="!loading">Uložiť zmeny</template>
            <template v-else>Ukladá sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
          </button>
        </template>
      </panel-form-actions>

    </form>

    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-address" role="dialog" aria-modal="true" v-if="showModalAddress">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
        <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalAddress"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full sm:w-10/12 md:w-8/12 xl:w-4/12">

          <form @submit.prevent="setAddress" class="divide-y divide-gray-200 dark:divide-gray-700/40">

            <div class="grid grid-cols-2 bg-gradient-to-t from-gray-200 dark:from-gray-800 to-75% to-transparent -mx-4 xs:-mx-6 sm:-mx-0">
              <button type="button" @click="addressMode('address')" class="px-3 py-4" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'address'}">
                Miesto práce
              </button>
              <button type="button" @click="addressMode('route')" class="px-3 py-4" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'route'}">
                Trasa
              </button>
            </div>

            <div class="p-6 md:p-10">
              <div v-if="address_mode === 'address'" class="p-1">

                <InputLabel
                  label="Miesto práce"
                  label-key="location"
                  v-model="location"
                  placeholder="Mesto alebo PSČ"
                  :error="getAddressError('location')"
                />

              </div>
              <div v-if="address_mode === 'route'" class="p-1">
                <div class="grid grid-cols-2 gap-4">

                  <InputLabel
                    label="Odkiaľ"
                    label-key="location_from"
                    v-model="location_from"
                    placeholder="Bratislava"
                    :error="getAddressError('location_from')"
                  />

                  <InputLabel
                    label="Kam"
                    label-key="location_to"
                    v-model="location_to"
                    placeholder="Košice"
                    :error="getAddressError('location_to')"
                  />

                </div>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between p-3">
              <button type="reset" @click="closeModalAddress" class="form-secondary-button"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <button type="submit" class="form-button">Nastaviť adresu</button>
            </div>

          </form>

        </div>
      </div>
    </div>
  </div>
</template>