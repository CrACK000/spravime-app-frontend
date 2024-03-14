<script setup lang="ts">
import { useMeta } from "vue-meta";
import axios from 'axios';
import {ref} from "vue";
import router from "@/router";
import Panel from "@/components/Panel.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import {useToast} from "primevue/usetoast";
import PanelForm from "@/components/PanelForm.vue";

useMeta({ title: 'Vytvoriť účet' })

const toast = useToast()

const errors = ref<any>([])
const changed = ref<boolean>(false)
const loading = ref<boolean>(false)
const registerData = ref<any>({
  username: '' as string,
  email: '' as string,
  password: '' as string,
  rePassword: '' as string,
  rules: false as boolean,
})
const dataPassword = ref<any>({
  showNewPass: false,
  showNewPassText: 'Zobraziť heslo',
  newPassSuccess: false,

  fieldInput: false,
  fieldProgress: '0%',
  fieldText: 'Zadajte heslo',
})

const register = () => {
  loading.value = true
  errors.value = []

  if (!registerValid()) return false

  axios.post(`${process.env.VITE_BACKEND}/auth/create-account`, registerData.value, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        toast.add({severity: 'success', summary: 'Účet', detail: 'Tvoj účet bol úspešne vytvorený !', group: 'br', life: 3000})
        toast.add({severity: 'info', summary: 'Účet', detail: 'Teraz sa môžeš prihlásiť !', group: 'br', life: 4000})
        registerData.value = { username: '', email: '', password: '', rePassword: ''}
        router.push({ name: 'login' })
      } else {
        registerData.value.password = ''
        registerData.value.rePassword = ''
        errors.value.push({ where: res.data.where, message: res.data.message })
      }
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}
const showNewPass = () => {
  let element = document.getElementById('newPass') as HTMLInputElement;

  dataPassword.value.showNewPass = !dataPassword.value.showNewPass
  dataPassword.value.showNewPassText = dataPassword.value.showNewPass ? 'Skryť heslo' : 'Zobraziť heslo'

  element.type = dataPassword.value.showNewPass ? 'text' : 'password';
}
const getError = (search: any) => {
  const emailError = errors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const validRules = () => {
  errors.value = errors.value.filter((error: any) => error.where !== 'rules')
  if (registerData.value.rules === false) errors.value.push({ where: 'rules', message: 'Musíte označiť že súhlasíte s podmienkami registrácie.' })
}
const registerValid = () => {

  errors.value = []

  if (registerData.value.username) validUsername(registerData.value.username)
  if (registerData.value.email) validEmail(registerData.value.email)
  if (registerData.value.password) validPassword()
  if (registerData.value.rePassword) validRePassword()
  if (registerData.value.rules === false) validRules()

  if (!errors.value.length) {
    if (registerData.value.password && registerData.value.rePassword){
      changed.value = true
      return true
    }
  } else {
    changed.value = false
    return false
  }
}
const validEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  if (emailRegex.test(email)) {
    return true
  } else {
    errors.value.push({ where: 'email', message: 'Nesprávny formát emailu.' })
  }
}
const validUsername = (username: string) =>  {
  if (username.length >= 3){
    if (username.length < 60) {
      if (username.includes(' ')) {
        errors.value.push({ where: 'username', message: 'Používateľské meno nemôže obsahovať medzeru.' })
      } else {
        return true;
      }
    } else {
      errors.value.push({ where: 'username', message: 'Používateľské meno môže obsahovať maximálne 60 znakov.' })
    }
  } else {
    errors.value.push({ where: 'username', message: 'Používateľské meno musí obsahovať 3 a viac znakov.' })
  }
}
const validPassword = () => {
  let password = registerData.value.password
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

  const fieldErrors = errors.value.filter((error: any) => error.where === 'field');

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
const validRePassword = () => {
  if (registerData.value.rePassword !== registerData.value.password) {
    errors.value.push({ where: 'password', message: 'Heslá sa nezhodujú.' })
  }
}

</script>

<template>
  <div class="w-full md:w-11/12 lg:w-6/12 xl:w-5/12 2xl:w-5/12 mx-auto">
    <form method="post" @keyup="registerValid" @change="registerValid" @submit.prevent="register">
      <panel divide="y">
        <div class="py-4 px-6 font-medium uppercase">Nový účet</div>
        <panel-form width="full">

          <div class="flex flex-col gap-6 max-w-md">
            <div>
              <label class="mb-1 block" for="username">Používateľské meno</label>
              <input type="text" :class="[ getError('username') ? 'input-danger' : 'input', 'w-full']" id="username" v-model="registerData.username">
              <div class="text-red-500 text-sm mt-2" v-if="getError('username')" v-text="getError('username')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="email">Prihlasovací email</label>
              <input type="email" :class="[ getError('email') ? 'input-danger' : 'input', 'w-full']" id="email" v-model="registerData.email">
              <div class="text-red-500 text-sm mt-2" v-if="getError('email')" v-text="getError('email')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="password">Heslo</label>
              <div class="relative">
                <input type="password" :class="[ getError('field') ? 'input-danger' : 'input', 'w-full']" id="password" v-model="registerData.password" @focus="dataPassword.fieldInput = true" @blur="dataPassword.fieldInput = false">
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
              <label class="mb-1 block" for="password">Zopakujte heslo</label>
              <input type="password" :class="[ getError('password') ? 'input-danger' : 'input', 'w-full']" id="password" v-model="registerData.rePassword">
              <div class="text-red-500 text-sm mt-2" v-if="getError('password')" v-text="getError('password')"></div>
            </div>
            <div class="flex gap-3 items-center">
              <input type="checkbox" id="rules" v-model="registerData.rules" class="input-checkbox"/>
              <label for="rules" :class="[ getError('rules') ? 'text-red-500' : '' ]">Súhlasím s podmienkami registrácie.</label>
            </div>
          </div>

        </panel-form>
        <panel-form-actions>
          <template #left>
            <router-link :to="{ name: 'login' }" class="text-gray-500 hover:text-blue-500 font-medium transition">
              <i class="fa-solid fa-arrow-right-to-bracket mx-2"></i> Prihlásiť sa
            </router-link>
          </template>
          <template #right>
            <button type="submit" class="form-button" :disabled="!changed || loading">
              <template v-if="!loading">Vytvoriť účet <i class="fa-solid fa-user-plus ms-2"></i></template>
              <template v-else>Overovanie <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
            </button>
          </template>
        </panel-form-actions>
      </panel>
    </form>
  </div>
</template>