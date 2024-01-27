<script setup lang="ts">
import { useMeta } from "vue-meta"
import Panel from "@/components/Panel.vue"
import axios from "axios";
import { timeSince } from "@/plugins/functions"
import MessagesComponent from "@/views/auth/messages/MessagesComponent.vue"
import {computed, inject, onMounted, ref} from "vue"
import { settings } from "@/plugins/config"
import type {Auth, User} from "@/types/users";

useMeta({ title: 'Správy' })

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)

const accounts = ref<any>({
  users: [] as Array<User>,
  search: '' as string,
  loading: false as boolean,
  selected: 0 as number,
})

const selectActiveAccounts = async () => {

  accounts.value.loading = true

  await axios.get(settings.backend + '/api/messages/accounts', { withCredentials: true })
    .then((response) => {
      accounts.value.users = response.data.users
      if (accounts.value.users.length > 0) {
        accounts.value.selected = [...accounts.value.users][0].id;
        isRead()
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      accounts.value.loading = false;
    })
}

const filteredUsers = computed(() => {
  const searchText = accounts.value.search.toLowerCase();
  return accounts.value.users
    .filter((user: User) => {
      const username = user.username.toLowerCase();
      const name = (user.name || '').toLowerCase();
      return username.includes(searchText) || name.includes(searchText);
    })
    .sort((a: User, b: User) => {
      return new Date(b.last_message?.created_at || '').getTime() - new Date(a.last_message?.created_at || '').getTime();
    });
});

const isRead = () => {

  const data = {
    fromId: accounts.value.selected,
    toId: user.value.id
  }

  axios.post(settings.backend + '/api/messages/read', data, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        console.log(response)
      } else {
        console.log(response)
      }
    })
    .catch((error) => {
      console.log(error)
    })

}

const selectAccount = (userId: number) => {
  accounts.value.selected = userId
  isRead();

  ["accounts", "messages"].forEach(id => {
    const element = document.getElementById(id)
    if (!element) return
    if (id === "accounts") {
      element.classList.add('hidden', 'md:block')
    } else if (id === "messages") {
      element.classList.remove('hidden', 'md:block')
    }
  })
}

const timeForm = timeSince;

onMounted( async () => {
  await selectActiveAccounts()
})
</script>

<template>
  <panel class="relative h-[680px] overflow-hidden">
    <div class="flex items-start w-full h-full">
      <div id="accounts" class="w-full md:w-4/12 h-[680px] bg-gray-300/40 dark:bg-gray-700/20 shadow-xl">
        <div class="p-4">
          <div class="relative z-0">
            <input type="search" id="search" v-model="accounts.search" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label for="search" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Vyhľadať</label>
          </div>
        </div>
        <ul class="flex flex-col gap-2 max-h-full overflow-y-auto overflow-x-hidden w-full p-2">
          <li v-for="account in filteredUsers"
              class="hover:bg-gray-300/70 hover:dark:bg-gray-700/50 flex gap-4 p-2 rounded-md w-full cursor-pointer transition duration-100 relative"
              :class="[accounts.selected === account.id ? 'bg-gray-300/70 dark:bg-gray-700/50' : '']"
              @click="selectAccount(account.id)"
              v-if="!accounts.loading"
          >
            <div v-if="account.last_message.is_read" class="absolute top-0 right-0 m-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"></div>
            <img :src="account.avatar" class="w-12 rounded-full" :alt="account.name ?? account.username">
            <div class="w-full">
              <div class="truncate">{{ account.name ?? account.username }}</div>
              <div class="text-xs opacity-75 w-full flex justify-between">
                <div class="truncate">{{ account.last_message?.message }}</div>
                <div>{{ timeForm(account.last_message?.created_at) }}</div>
              </div>
            </div>
          </li>

          <!-- Loading Panel for Accounts msg -->
          <li v-else v-for="key in 7" class="flex gap-4 items-center p-2 w-full">
            <svg class="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
            <div class="animate-pulse">
              <div class="loading-bar h-2.5 w-20 mb-3"></div>
              <div class="loading-bar h-2 w-32"></div>
            </div>
          </li>

        </ul>
      </div>
      <div id="messages" class="w-full md:w-8/12 h-[680px] overlay-chat md:block hidden">
        <messages-component :key="accounts.selected" :user-id="accounts.selected" :loading-panel="accounts.loading"/>
      </div>
    </div>
  </panel>
</template>