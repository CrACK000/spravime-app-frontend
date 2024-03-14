<script setup lang="ts">
import {useToast} from "primevue/usetoast"
import {ref} from "vue"
import axios from "axios"
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"

const toast = useToast()

const dataPassword = ref<any>({
  currentPass: '',
  newPass: '',
  reNewPass: '',
  showNewPass: false,
  showNewPassText: 'Zobraziť heslo',
  newPassSuccess: false,
  fieldInput: false,
  fieldProgress: '0%',
  fieldText: 'Zadajte heslo',
})

const errors = ref<any>([])
const cancelShow = ref<boolean>(false)
const changed = ref<boolean>(false)
const loading = ref<boolean>(false)
const success = ref<boolean>(false)

const getError = (search: any) => {
  const emailError = errors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const showNewPass = () => {
  let element = document.getElementById('newPass') as HTMLInputElement;

  dataPassword.value.showNewPass = !dataPassword.value.showNewPass
  dataPassword.value.showNewPassText = dataPassword.value.showNewPass ? 'Skryť heslo' : 'Zobraziť heslo'

  element.type = dataPassword.value.showNewPass ? 'text' : 'password';
}
const validNewPassword = () => {
  let password = dataPassword.value.newPass
  let minEightChars = /.{8,}/
  let uppercaseChar = /[A-Z]/
  let numericChar = /[0-9]/
  let specialChar = /[*@!#%&()^~{}\-_]+/

  dataPassword.value.newPassSuccess = minEightChars.test(password) && uppercaseChar.test(password) && numericChar.test(password) && specialChar.test(password);

  if (!minEightChars.test(password)) {
    errors.value.push({ where: 'field', message: 'Minimálne 8 znakov' })
  }
  if (!uppercaseChar.test(password)) {
    errors.value.push({ where: 'field', message: 'Jedno veľké písmeno' })
  }
  if (!numericChar.test(password)) {
    errors.value.push({ where: 'field', message: 'Jedna číslica' })
  }
  if (!specialChar.test(password)) {
    errors.value.push({ where: 'field', message: 'Jeden špeciálny znak, napr.<span class="whitespace-nowrap">(*@!#%&()^~{}\\-_)</span>' })
  }

  let fieldErrors = errors.value.filter((error: any) => error.where === 'field');

  if (fieldErrors.length === 4) {
    dataPassword.value.fieldProgress = '0%'
  } else if (fieldErrors.length === 3) {
    dataPassword.value.fieldProgress = '25%'
  } else if (fieldErrors.length === 2) {
    dataPassword.value.fieldProgress = '50%'
  } else if (fieldErrors.length === 1) {
    dataPassword.value.fieldProgress = '75%'
  } else if (fieldErrors.length === 0) {
    dataPassword.value.fieldProgress = '100%'
  }

}
const validReNewPassword = () => {
  if (dataPassword.value.reNewPass !== dataPassword.value.newPass) {
    errors.value.push({where: 'reNewPass', message: 'Nové heslo sa nezhoduje.'})
  }
}
const checkForm = () => {
  errors.value = []
  if (dataPassword.value.newPass) validNewPassword()
  if (dataPassword.value.reNewPass) validReNewPassword()

  cancelShow.value = !!(dataPassword.value.currentPass || dataPassword.value.newPass || dataPassword.value.reNewPass)

  if (!errors.value.length) {
    if (dataPassword.value.currentPass && dataPassword.value.newPass && dataPassword.value.reNewPass){
      changed.value = true
      return true
    }
  } else {
    changed.value = false
    return false
  }
}
const cancel = () => {
  cancelShow.value = false
  dataPassword.value.currentPass = ''
  dataPassword.value.newPass = ''
  dataPassword.value.reNewPass = ''
}
const changePass = () => {

  if (!checkForm()) return false

  loading.value = true

  const data = {
    currentPass: dataPassword.value.currentPass,
    newPass: dataPassword.value.newPass,
  }

  axios.post(`${process.env.VITE_BACKEND}/auth/security/password`, data, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {

        dataPassword.value.currentPass = ''
        dataPassword.value.newPass = ''
        dataPassword.value.reNewPass = ''

        success.value = true
        changed.value = false
        cancelShow.value = false

        toast.add({
          severity: 'success',
          summary: 'Úspech',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

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
    .catch((error) => {
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
  <form method="post" @keyup="checkForm" @submit.prevent="changePass">
    <panel divide="y">
      <panel-form>
        <div class="flex flex-col gap-6">
          <div>
            <label class="mb-1 block" for="currentPass">Súčasné heslo</label>
            <input type="password" class="input w-full" id="currentPass" v-model="dataPassword.currentPass">
          </div>
          <div>
            <label class="mb-1 block" for="newPass">Nové heslo</label>
            <div class="relative">
              <input type="password" class="pe-10" :class="[ getError('field') ? 'input-danger' : 'input', 'w-full']" id="newPass" v-model="dataPassword.newPass" @focus="dataPassword.fieldInput = true" @blur="dataPassword.fieldInput = false">
              <div class="absolute inset-y-0 end-0 flex items-center pe-3.5">
                <button type="button" v-tooltip.top="dataPassword.showNewPassText" @click="showNewPass">
                  <svg v-if="!dataPassword.showNewPass" class="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                    <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                      <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
                    </g>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </button>
              </div>
              <div class="input-field" v-show="dataPassword.fieldInput">
                <div class="py-2.5">
                  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="h-2.5 rounded-full" :class="[dataPassword.newPassSuccess ? 'bg-emerald-500' : 'bg-amber-600']" :style="{ 'width': dataPassword.fieldProgress }"></div>
                  </div>
                </div>
                <div class="mb-1.5">
                  <span v-if="getError('field')" class="text-amber-600 font-bold">Slabé heslo</span>
                  <span v-else-if="!dataPassword.newPassSuccess" v-text="dataPassword.fieldText"></span>
                  <span v-else class="text-emerald-500 font-bold flex items-center justify-center mt-1">Heslo je silné <i class="fa-regular fa-thumbs-up ms-2 fa-lg"></i></span>
                </div>
                <ul class="text-xs">
                  <template v-for="err in errors">
                    <li v-if="err.where === 'field'" v-html="err.message"></li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <label class="mb-1 block" for="reNewPass">Zopakujte nové heslo</label>
            <input type="password" :class="[ getError('reNewPass') ? 'input-danger' : 'input', 'w-full']" id="reNewPass" v-model="dataPassword.reNewPass">
            <div class="text-red-500 text-sm mt-2" v-if="getError('reNewPass')" v-text="getError('reNewPass')"></div>
          </div>
        </div>
      </panel-form>
      <panel-form-actions>
        <template #left>Zadajte silné heslo kvôli bezpečnosti.</template>
        <template #right>
          <button type="button" class="form-secondary-button" v-if="cancelShow" @click.prevent="cancel">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="errors.length || !changed || loading">
            <template v-if="!loading">Zmeniť heslo</template>
            <template v-else>Prebieha zmena <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>