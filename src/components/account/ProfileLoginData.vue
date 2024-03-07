<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"


const toast = useToast()

const auth = inject<Auth>('auth');
const user = ref(auth?.userData as User)

const loginData = ref({
  email: '' as string,
  username: '' as string,
  mobile: '' as any,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})

const setLoginData = () => {
  loginData.value.errors = []
  loginData.value.changed = false
  loginData.value.email = user.value.email
  loginData.value.username = user.value.username
  loginData.value.mobile = user.value.phone
}
const checkLoginData = () => {
  loginData.value.errors = []
  loginData.value.changed = !(loginData.value.email === user.value.email && loginData.value.username === user.value.username && loginData.value.mobile === user.value.phone)

  validEmail(loginData.value.email)
  validUsername(loginData.value.username)
  validMobile(loginData.value.mobile)
}
const updateLoginData = () => {
  loginData.value.loading = true

  if (loginData.value.errors.length) return false

  const LoginData = loginData.value

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/profile/update/login-data`, LoginData, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
        loginData.value.success = true
        loginData.value.changed = false
        user.value.email = loginData.value.email
        user.value.username = loginData.value.username
        user.value.phone = loginData.value.mobile
      } else {
        loginData.value.errors = response.data.errors
        loginData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      loginData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      loginData.value.loading = false
      console.log('finally')
    })
}
const getErrorLoginData = (search: any) => {
  const emailError = loginData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const validEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  if (emailRegex.test(email)) {
    return true
  } else {
    loginData.value.errors.push({where: 'email', message: 'Nesprávny formát emailu.'})
  }
}
const validUsername = (username: string) =>  {
  if (username.length >= 3){
    if (username.length < 60) {
      return true
    } else {
      loginData.value.errors.push({where: 'username', message: 'Používateľské meno môže obsahovať maximálne 60 znakov.'})
    }
  } else {
    loginData.value.errors.push({where: 'username', message: 'Používateľské meno musí obsahovať 3 a viac znakov.'})
  }
}
const validMobile = (mobile: string) => {
  if (mobile) {
    const mobileRegex = /^[+]\+?[1-9][0-9]{11,15}$/
    if (mobileRegex.test(mobile)) {
      return true
    } else {
      loginData.value.errors.push({where: 'mobile', message: 'Nesprávny formát tel. čísla.'})
    }
  } else {
    return true
  }
}

onMounted(() => {
  setLoginData()
})

</script>

<template>
  <form method="post" @submit.prevent="updateLoginData" @keyup="checkLoginData">
    <panel divide="y">
      <panel-form>
        <div class="flex flex-col gap-6">
          <div>
            <label class="mb-1 block" for="email">Prihlasovací email</label>
            <input type="email" :class="[ getErrorLoginData('email') ? 'input-danger' : 'input', 'w-full']" id="email" v-model="loginData.email" placeholder="@" required>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('email')" v-text="getErrorLoginData('email')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="username">Prihlasovací meno</label>
            <input type="text" :class="[ getErrorLoginData('username') ? 'input-danger' : 'input', 'w-full']" id="username" v-model="loginData.username" required>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('username')" v-text="getErrorLoginData('username')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="mobile">Telefónne číslo</label>
            <input type="tel" class="input w-full" id="mobile" v-model="loginData.mobile" placeholder="+421 9xx xxx xxx">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('mobile')" v-text="getErrorLoginData('mobile')"></div>
          </div>
        </div>
      </panel-form>
      <panel-form-actions>
        <template #left>
          Prihlasovacie údaje
        </template>
        <template #right>
          <button type="submit" class="form-secondary-button" v-if="loginData.changed" @click.prevent="setLoginData">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="!loginData.changed || loginData.loading || loginData.errors.length">
            <template v-if="loginData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
            <template v-else>Uložiť</template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>

<style scoped>

</style>