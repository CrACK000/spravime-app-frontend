<script setup lang="ts">
import {useMeta} from "vue-meta"
import Panel from "@/components/template/Panel.vue"
import {inject, ref} from "vue"

useMeta({ title: 'Dashboard' })

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('sk-SK', { month: 'short' })
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')

  return `${day} ${month} ${year} - ${hour}:${minute}`
}
</script>

<template>
  <div>
    <div class="grid md:grid-cols-3 gap-0.5 md:gap-6 mb-6">
      <panel class="p-4 md:col-span-2">
        Štatistika
      </panel>
      <panel class="p-6 text-end">
        <div class="flex items-center">
          <svg class="w-12 h-12 opacity-25" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
          </svg>
          <div class="ms-auto flex flex-col gap-y-2">
            <div class="text-xl">{{ formatDate(user.last_login) }}</div>
            <div class="opacity-75 text-sm">Posledné prihlásenie</div>
          </div>
        </div>
      </panel>
      <panel class="md:col-span-3">
        <div class="p-4 xs:p-6 md:p-10">
          Dashboard
        </div>
      </panel>
    </div>
  </div>
</template>