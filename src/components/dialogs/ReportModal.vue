<script setup lang="ts">
import {inject, reactive, ref} from "vue"
import axios from "axios"
import {useToast} from "primevue/usetoast"
import {FwbRadio} from "flowbite-vue"

type DialogRefType = {
  data: ReportData,
  close: (callbackData?: any) => void
}

const toast = useToast()
const loading = ref<boolean>(false)
const errors = ref<any>([])
const dialogRef = inject('dialogRef') as { value: DialogRefType }
const form = reactive({
  type: dialogRef.value.data.type,
  key: dialogRef.value.data.key,
  author: dialogRef.value.data.author,
  reason: undefined as string | undefined
})
const reasons = reactive([
  'Násilie alebo škodlivé správanie',
  'Šikanovanie alebo obťažovanie',
  'Nenávistné prejavy alebo symboly',
  'Nesprávne kategorizovaný obsah',
  'Spam, podvod, phishing alebo odcudzenie identity',
  'Porušenie duševného vlastníctva'
])

const closeDialog = () => {

  dialogRef.value.close()

}
const checkForm = () => {

  errors.value = []

  if (form.reason === undefined) {
    errors.value.push({ where: 'reason', message: 'Vyberte alebo napíšte dôvod nahlásenia.' })
  }

  return !errors.value.length

}
const submitReport = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/report`, form, { withCredentials: true })
    .then(response => {

      if (response.data.success) {

        toast.add({
          severity: 'success',
          summary: 'Úspech',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

        closeDialog()

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
</script>

<template>
  <form @submit.prevent="submitReport" @change="checkForm" class="divide-y divide-gray-200 dark:divide-gray-700/40">

    <div class="md:px-6">

      <div class="flex flex-col gap-y-1.5">
        <fwb-radio
          v-for="value in reasons"
          v-model="form.reason"
          :value="value"
          :label="value"
          :class="`cursor-pointer hover:bg-gray-900/25 px-2 transition rounded-xl ${form.reason === value && 'bg-gray-900/25'}`"
        />
      </div>

      <div v-if="errors.length" class="text-red-500 text-sm mt-2">{{ errors[0].message }}</div>

    </div>

    <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-end gap-x-2 p-3 -mx-6 -mb-6 mt-6">
      <button type="reset" @click="closeDialog" class="form-secondary-button-sm">
        <i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť
      </button>
      <button type="submit" class="form-button" :disabled="loading">
        <template v-if="!loading"><i class="fa-solid fa-triangle-exclamation me-1"></i> Nahlásiť</template>
        <template v-else>Overovanie <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
      </button>
    </div>

  </form>
</template>