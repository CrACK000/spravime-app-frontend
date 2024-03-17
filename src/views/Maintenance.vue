<script setup lang="ts">
import {useMeta} from "vue-meta"
import {inject, ref} from "vue"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import router from "@/router"
import {FwbSpinner} from "flowbite-vue"

useMeta({ title: 'Údržba' })

const auth = inject<Auth>('auth')
const toast = useToast()

const errors = ref<any>([])
const loading = ref<boolean>(false)

const loginData = ref<any>({ username: '', password: '' })

const login = () => {
  errors.value = []
  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/login`, loginData.value, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {

        console.log(response.data)

        if (auth) {
          auth.userData.value = response.data.user
          auth.loggedIn.value = response.data.loggedIn
        }

        toast.add({
          severity: 'info',
          summary: 'Účet',
          detail: response.data.message,
          group: 'br',
          life: 3000
        })

        router.push({ name: 'index' })

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
      loginData.value.password = ''

    })
}
</script>

<template>
  <div class="fixed top-0 w-full h-full bg-gradient-to-bl from-blue-600 to-indigo-500 to-75% text-white flex flex-col items-center justify-center">
    <div class="flex items-center gap-x-4 mb-6">
      <svg class="fill-white w-10 h-10" xmlns="http://www.w3.org/2000/svg" width="56.000000pt" height="54.000000pt" viewBox="0 0 56.000000 54.000000" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,54.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M26 511 c-18 -20 -18 -25 -5 -69 14 -45 17 -47 54 -50 32 -3 50 -13 87 -50 l48 -46 -90 -92 c-100 -101 -109 -126 -65 -169 41 -42 68 -33 151 47 l74 71 74 -71 c83 -80 110 -89 151 -47 37 36 32 68 -20 124 -25 26 -45 51 -45 54 0 3 16 14 35 26 19 11 44 35 55 53 24 39 27 115 6 144 -14 18 -16 17 -60 -25 -39 -38 -47 -42 -61 -31 -14 12 -12 18 25 55 46 47 51 71 14 85 -97 37 -204 -27 -221 -132 l-6 -39 -38 37 c-32 31 -39 45 -39 76 0 33 -4 40 -27 49 -57 21 -78 21 -97 0z m384 -29 c0 -5 -11 -19 -25 -32 -35 -33 -33 -72 6 -104 38 -32 40 -32 79 0 38 32 46 27 27 -18 -20 -47 -56 -68 -119 -68 l-52 0 -107 -105 c-73 -72 -111 -103 -122 -99 -39 15 -27 37 78 143 104 106 105 108 105 155 0 60 23 104 63 121 36 16 67 19 67 7z m-316 -8 c23 -9 20 -44 -3 -44 -10 0 -22 7 -25 16 -13 33 -5 41 28 28z m334 -318 c61 -64 70 -87 35 -100 -10 -4 -39 17 -84 61 -65 63 -68 67 -52 85 9 10 21 18 28 18 6 0 40 -29 73 -64z"/></g>
      </svg>
      <div class="text-3xl font-medium">Údržba</div>
    </div>
    <form @submit.prevent="login" class="mb-0 flex flex-col gap-y-3">
      <input type="text" placeholder="Username" v-model="loginData.username" class="w-full bg-white py-3 px-4 rounded-xl text-blue-900 placeholder-gray-400">
      <input type="password" placeholder="Password" v-model="loginData.password" class="w-full bg-white py-3 px-4 rounded-xl text-blue-900 placeholder-gray-400">
      <div>
        <button type="submit" class="py-2 px-3 hover:bg-white bg-white/90 text-blue-900 rounded-xl text-xs flex items-center gap-x-2 mx-auto">
          <fwb-spinner v-if="loading"/>
          Prihlásiť sa
        </button>
      </div>
      <div class="text-center text-white/40 text-sm mt-4">
        www.spravi.me
      </div>
    </form>
  </div>
</template>