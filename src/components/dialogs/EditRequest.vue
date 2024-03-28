<script setup lang="ts">
import {inject, ref} from "vue"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {useDialog} from "primevue/usedialog"
import {  getError, validTitle, checkError,
  validSection, validCategory, validAddress,
  validDescription, validStartAt, validEndAt } from "@/plugins/validation"
import categoriesData from "@/plugins/data/categories.json"
import TextareaLabel from "@/components/template/TextareaLabel.vue"
import SelectLabel from "@/components/template/SelectLabel.vue"
import InputLabel from "@/components/template/InputLabel.vue"
import InputContainer from "@/components/template/InputContainer.vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import PanelForm from "@/components/template/PanelForm.vue"
import SetAddress from "@/components/dialogs/SetAddress.vue"

type DialogRefType = {
  data: any,
  close: (callbackData?: any) => void
}

const toast   = useToast()
const dialog  = useDialog()
const loading = ref<boolean>(false)
const errors  = ref<any>([])

const sections    = ref<Sections[]>(categoriesData.sections)
const categories  = ref<Categories[]>(categoriesData.categories)

const dialogRef = inject('dialogRef') as { value: DialogRefType }
const requestData = dialogRef.value.data.reviewData as Request

const form = ref<any>({
  request_id: requestData._id as string,
  title: requestData.title as string,
  section: requestData.section as number,
  category: requestData.category as number,
  address: requestData.address as string,
  time_range: requestData.time_range as boolean | null,
  start_at: requestData.time_range?.start_at as string,
  end_at: requestData.time_range?.end_at as string,
  description: requestData.description as string,
})

const closeDialog = (callback: any) => {
  dialogRef.value.close(callback)
}
const submitEditRequest = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/requests/edit`, form.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({
          severity: 'success',
          summary: 'Požiadavka',
          detail: response.data.message,
          group: 'br',
          life: 4000
        })
        closeDialog(response.data.request)
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
      console.error('[EditRequestError]',error)
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
const closeTimeRange = () => {

  form.value.start_at = null
  form.value.end_at = null
  form.value.time_range = false

}
const clearError = (where: string) => {
  return errors.value = errors.value.filter((error: any) => error.where !== where)
}

const openAddressDialog = () => {
  dialog.open(SetAddress, {
    props: {
      header: 'Nastaviť adresu',
      contentClass: 'p-0 md:p-6',
      modal: true,
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          form.value.address = opt.data
        }
      }
    }
  })
}
</script>

<template>
  <div>
    <form @submit.prevent="submitEditRequest" class="divide-y divide-gray-200 dark:divide-gray-700/40 w-full md:w-[700px] xl:w-[1000px]">

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

      <panel-form>
        <div class="mb-5">
          <button type="button" @click="openAddressDialog" class="form-secondary-button flex gap-2 items-center">
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
              <span v-text="form.address" class="font-semibold"></span> - <button type="button" @click="openAddressDialog" class="link text-sm">zmeniť</button>
            </div>
            <div v-else>
              Je potrebné nastaviť adresu
            </div>
          </div>
          <div class="text-red-500 text-sm mt-1.5" v-if="getError(errors, 'address')" v-text="getError(errors, 'address')"></div>
        </div>
      </panel-form>

      <panel-form>
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

      <panel-form-actions class="md:-mx-6 md:-mb-6">
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
  </div>
</template>