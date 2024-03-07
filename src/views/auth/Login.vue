<script setup lang="ts">
import {useMeta} from "vue-meta"
import axios from 'axios'
import {inject, ref} from "vue"
import router from "@/router"
import Panel from "@/components/Panel.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import {useToast} from "primevue/usetoast"

useMeta({ title: 'Prihlásiť sa' })

const auth = inject<Auth>('auth')

const toast = useToast()

const errors = ref<any>([])
const loading = ref<boolean>(false)
const changed = ref<boolean>(false)

const loginData = ref<any>({
  username: '',
  password: '',
})

const login = () => {
  errors.value = []
  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/login`, loginData.value, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {
        if (auth) {
          auth.userData.value = response.data.user
          auth.loggedIn.value = response.data.loggedIn
        }
        toast.add({severity: 'info', summary: 'Účet', detail: 'Si prihlásený !', group: 'br', life: 3000})
        router.back()
      } else {
        errors.value = response.data.errors
      }
    })
    .catch((error) => {
      errors.value.push({ where: 'error', message: 'Nesprávne meno alebo heslo.' })
    })
    .finally(() => {
      loading.value = false
    })
}

</script>

<template>

  <div class="w-full md:w-11/12 lg:w-6/12 xl:w-5/12 2xl:w-3/12 mx-auto">
    <form method="post" @submit.prevent="login" @change="changed = true">
      <panel divide="y">
        <div class="py-4 px-6 font-medium uppercase">Prihlásiť sa</div>
        <div class="p-8 md:p-14">

          <ul v-if="errors.length" class="text-red-500 -mt-8">
            <li v-for="error in errors" class="flex items-center mb-3">
              <i class="gg-danger"></i> {{ error.message }}
            </li>
          </ul>

          <div class="flex flex-col gap-y-6">
            <input type="text" v-model="loginData.username" class="input w-full" placeholder="Používateľské meno alebo email">
            <input type="password" v-model="loginData.password" class="input w-full" placeholder="Heslo">
          </div>

        </div>
        <panel-form-actions>
          <template #left>
            <router-link :to="{ name: 'register' }" class="text-gray-500 hover:text-blue-500 font-medium transition">
              <i class="fa-solid fa-user-plus mx-2"></i> Vytvoriť nový účet
            </router-link>
          </template>
          <template #right>
            <button type="submit" class="form-button" :disabled="loading">
              <template v-if="!loading">Prihlásiť sa <i class="fa-solid fa-arrow-right-to-bracket ms-2 fa-lg"></i></template>
              <template v-else>Overovanie <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
            </button>
          </template>
        </panel-form-actions>
      </panel>
    </form>
  </div>
</template>