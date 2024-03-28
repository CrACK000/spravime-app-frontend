<script setup lang="ts">
import {ref, inject} from 'vue'
import Nickname from "@/components/app/Nickname.vue"
import Avatar from "@/components/app/Avatar.vue"
import Sidebar from "primevue/sidebar"
import Button from "primevue/button"
import SidebarList from "@/components/sidebar/SidebarList.vue"
import SidebarListItem from "@/components/sidebar/SidebarListItem.vue"
import SidebarListHead from "@/components/sidebar/SidebarListHead.vue"
import {FwbDropdown} from "flowbite-vue"

const auth = inject<Auth>('auth')

const user = ref(auth?.userData as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const newMsg = ref<number>(auth?.newMsgCount)

const visible = ref(false)

</script>

<template>
  <div>
    <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto px-4 md:px-0 py-5 md:pt-14 md:pb-16 flex justify-between items-center">
      <router-link :to="{ name: 'index' }" class="text-2xl md:text-4xl lg:text-5xl select-none cursor-pointer">
        <img src="/logo.png" alt="Spravime Logo"/>
      </router-link>

      <div class="lg:flex items-center gap-6 hidden">

        <router-link :to="{ name: 'requests' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Požiadavky
        </router-link>

        <router-link :to="{ name: 'workers' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Firmy & Živnostníci
        </router-link>

        <router-link v-if="loggedIn" :to="{ name: 'create-request' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Pridať požiadavku
        </router-link>

        <fwb-dropdown v-if="loggedIn" placement="left">
          <template #trigger>
            <div class="cursor-pointer rounded-full hover:ring-8 hover:ring-white dark:hover:ring-gray-700 relative">
              <Avatar :img="user.avatar" :alt="user.username" rounded="full" size="sm" :notify="Boolean(newMsg)"/>
            </div>
          </template>
          <div class="z-10 bg-white divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow dark:bg-gray-700">
            <div class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <router-link :to="{ name: 'profile', params: { userId: user._id } }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <nickname :nickname="user.profile.name ?? user.username" :verify="user.verify" :class="[ user.verify ? 'text-blue-500 font-semibold': 'font-medium' ]"/>
                <div class="italic truncate text-xs mt-1">{{ user.email }}</div>
              </router-link>
            </div>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <router-link :to="{ name: 'dashboard' }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Centrum
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'user-account' }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Upraviť profil
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'messages' }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Správy
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'user-requests' }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Moje požiadavky
                </router-link>
              </li>
            </ul>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <router-link :to="{ name: 'logout' }" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  Odhlásiť sa
                </router-link>
              </li>
            </ul>
          </div>
        </fwb-dropdown>

        <router-link v-else :to="{ name: 'login' }" class="bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-500 hover:to-indigo-400 text-white/80 hover:text-white px-4 py-2 rounded-lg shadow-xl">
          <i class="fa-regular fa-user me-2"></i>
          Prihlásiť sa
        </router-link>

      </div>

      <div class="flex items-center gap-3 lg:hidden">

        <Sidebar v-model:visible="visible">
          <template #container="{ closeCallback }">
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between px-4 py-3 flex-shrink-0">
                <span class="inline-flex items-center gap-2">
                  <img src="/logo.png" alt="Spravime Logo" class="max-w-full w-32"/>
                </span>
                <span>
                  <Button type="button" @click="closeCallback" icon="fa-solid fa-xmark fa-lg" rounded outlined class="h-8 w-8"></Button>
                </span>
              </div>
              <div class="overflow-y-auto">

                <div class="p-3 m-0">
                  <SidebarList>
                    <SidebarListItem @click="closeCallback" :to="{ name: 'index' }" title="Domov"/>
                    <SidebarListItem @click="closeCallback" :to="{ name: 'requests' }" title="Požiadavky"/>
                    <SidebarListItem @click="closeCallback" :to="{ name: 'workers' }" title="Firmy & Živnostníci"/>
                    <SidebarListItem @click="closeCallback" v-if="loggedIn" :to="{ name: 'create-request' }" title="Vytvoriť požiadavku"/>
                    <SidebarListItem @click="closeCallback" v-if="!loggedIn" :to="{ name: 'login' }" title="Prihlásiť sa"/>
                    <SidebarListItem @click="closeCallback" v-if="!loggedIn" :to="{ name: 'register' }" title="Vytvoriť účet"/>
                  </SidebarList>
                </div>

                <ul v-if="loggedIn" class="list-none p-3 m-0">
                  <li>
                    <SidebarListHead :title="user.profile.name ?? user.username" v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
                      <template #icon>
                        <Avatar :img="user.avatar" size="xs" rounded="full" class="mb-2"/>
                      </template>
                    </SidebarListHead>
                    <SidebarList>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'dashboard' }" title="Centrum" icon="fa-solid fa-gauge-high"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-account' }" title="Upraviť účet" icon="fa-regular fa-circle-user"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-gallery' }" title="Galéria" icon="fa-regular fa-images"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'messages' }" title="Správy" icon="fa-regular fa-message" :badge="newMsg"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-requests' }" title="Moje požiadavky" icon="fa-solid fa-briefcase"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-stats' }" title="Štatistika" icon="fa-solid fa-chart-line"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-plus' }" title="Plus +" icon="fa-regular fa-circle-check"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-security' }" title="Zabezpečenie" icon="fa-solid fa-lock"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'logout' }" title="Odhlásiť sa" icon="fa-solid fa-arrow-right-from-bracket"/>
                    </SidebarList>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </Sidebar>

        <button @click="visible = true" type="button" class="p-3 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-xl shadow-md">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

      </div>

    </div>
  </div>
</template>