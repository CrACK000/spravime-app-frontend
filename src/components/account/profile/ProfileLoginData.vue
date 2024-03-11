<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import {checkError, getError, validEmail, validPhone, validUsername} from "@/plugins/validation"
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"
import InputContainer from "@/components/InputContainer.vue"
import InputLabel from "@/components/InputLabel.vue"


const toast = useToast()
const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

const loginData = ref({ email: '', username: '', phone: '' })

const errors = ref<any>([])
const changed = ref<boolean>(false)
const loading = ref<boolean>(false)

const useDefault = () => {

  errors.value = []
  changed.value = false
  loginData.value.email = user.value.email
  loginData.value.username = user.value.username
  loginData.value.phone = user.value.phone ?? ''

}
const checkForm = () => {

  errors.value = []
  changed.value = !(loginData.value.email === user.value.email && loginData.value.username === user.value.username && loginData.value.phone === user.value.phone)

  checkError(errors.value, validEmail(loginData.value.email))
  checkError(errors.value, validUsername(loginData.value.username))
  checkError(errors.value, validPhone(loginData.value.phone))

  return !errors.value.length

}
const updateLoginData = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/profile/update/login-data`, loginData.value, { withCredentials: true })
    .then((response) => {

      if (response.data.success) {

        user.value.email    = loginData.value.email
        user.value.username = loginData.value.username
        user.value.phone    = loginData.value.phone

        changed.value       = false

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

onMounted(() => {
  useDefault()
})

</script>

<template>
  <form @submit.prevent="updateLoginData" @keyup="checkForm">
    <panel divide="y">
      <panel-form>
        <InputContainer>

          <InputLabel
            type="email"
            label='Prihlasovací email'
            label-key="email"
            placeholder="@"
            v-model="loginData.email"
            :error="getError(errors ,'email')"
          />

          <InputLabel
            type="text"
            label='Prihlasovací meno'
            label-key="username"
            v-model="loginData.username"
            :error="getError(errors ,'username')"
          />

          <InputLabel
            type="tel"
            label='Telefónne číslo'
            label-key="phone"
            placeholder="+421"
            v-model="loginData.phone"
            :error="getError(errors ,'phone')"
          />

        </InputContainer>
      </panel-form>
      <panel-form-actions>
        <template #left>
          Prihlasovacie údaje
        </template>
        <template #right>
          <button type="submit" class="form-secondary-button" v-if="changed" @click.prevent="useDefault">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="!changed || loading || errors.length">
            <template v-if="loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
            <template v-else>Uložiť</template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>