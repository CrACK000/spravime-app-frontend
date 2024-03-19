<script setup lang="ts">
import {ref, inject} from 'vue'
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue"
import {useRouter} from "vue-router"
import Nickname from "@/components/app/Nickname.vue"
import Avatar from "@/components/app/Avatar.vue"
import Sidebar from "primevue/sidebar"
import Button from "primevue/button"
import SidebarList from "@/components/sidebar/SidebarList.vue";
import SidebarListItem from "@/components/sidebar/SidebarListItem.vue";
import SidebarListHead from "@/components/sidebar/SidebarListHead.vue";

const router = useRouter()
const auth = inject<Auth>('auth')

const user = ref(auth?.userData as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const user_links = ref([
  {
    name: { name: 'dashboard' },
    title: 'Dashboard',
    icon: 'fa-solid fa-gauge-high',
  },
  {
    name: { name: 'my-account' },
    title: 'Účet',
    icon: 'fa-regular fa-circle-user'
  },
  {
    name: { name: 'messages' },
    title: 'Správy',
    icon: 'fa-regular fa-message',
  },
  {
    name: { name: 'my-offers' },
    title: 'Moje požiadavky',
    icon: 'fa-solid fa-briefcase'
  },
])
const notifyMsg = ref<number>(auth?.newMsgCount)

const navigateTo = async (routeName: any, close: () => void) => {
  await router.push(routeName)
  close()
}

const visible = ref(false)

</script>

<template>
  <div>
    <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto px-4 md:px-0 py-5 md:pt-14 md:pb-16 flex justify-between items-center">
      <router-link :to="{ name: 'index' }" class="text-2xl md:text-4xl lg:text-5xl select-none cursor-pointer">
        <img src="/logo.png" alt="Spravime Logo"/>
      </router-link>

      <div class="lg:flex items-center gap-6 hidden">

        <router-link :to="{ name: 'offers' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Požiadavky
        </router-link>

        <router-link :to="{ name: 'workers' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Firmy & Živnostníci
        </router-link>

        <router-link v-if="loggedIn" :to="{ name: 'offerAdd' }" class="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition font-medium">
          Pridať požiadavku
        </router-link>

        <div v-if="loggedIn">
          <Menu as="div" class="relative inline-block">
            <MenuButton class="cursor-pointer rounded-full hover:ring-8 hover:ring-white dark:hover:ring-gray-700 relative">
              <Avatar :img="user.avatar" :alt="user.username" rounded="full" size="sm" :notify="Boolean(notifyMsg)"/>
            </MenuButton>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 overflow-hidden text-sm">

                <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <nickname :nickname="user.username" :verify="user.verify" :class="{'text-blue-500 font-semibold': user.verify }"/>
                  <div class="font-medium truncate">{{ user.email }}</div>
                </div>

                <div class="py-1">
                  <MenuItem v-slot="{ close }">
                    <div @click="navigateTo({ name: 'profile' , params: { id: user._id }}, close)" :class="['block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer']">
                      <div class="flex w-full gap-1 items-center justify-between">
                        Profil
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ close }" v-for="ulink in user_links">
                    <div @click="navigateTo(ulink.name, close)" :class="['block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer']">
                      <div class="flex w-full gap-1 items-center justify-between">

                        {{ ulink.title }}

                        <div v-if="ulink.name.name === 'messages' && notifyMsg" class="bg-blue-500 text-xs text-white drop-shadow w-5 h-5 rounded-lg flex justify-center items-center shadow-xl font-bold"
                             v-text="notifyMsg"
                        ></div>

                      </div>
                    </div>
                  </MenuItem>
                </div>

                <div class="py-1">
                  <MenuItem v-slot="{ close }">
                    <div @click="navigateTo({ name: 'logout' }, close)" :class="['block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer']">
                      Odhlásiť sa
                    </div>
                  </MenuItem>
                </div>

              </MenuItems>
            </transition>
          </Menu>
        </div>

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
                    <SidebarListItem @click="closeCallback" :to="{ name: 'offers' }" title="Požiadavky"/>
                    <SidebarListItem @click="closeCallback" :to="{ name: 'workers' }" title="Firmy & Živnostníci"/>
                    <SidebarListItem @click="closeCallback" v-if="loggedIn" :to="{ name: 'offerAdd' }" title="Vytvoriť požiadavku"/>
                    <SidebarListItem @click="closeCallback" v-if="!loggedIn" :to="{ name: 'login' }" title="Prihlásiť sa"/>
                    <SidebarListItem @click="closeCallback" v-if="!loggedIn" :to="{ name: 'register' }" title="Vytvoriť účet"/>
                  </SidebarList>
                </div>

                <ul v-if="loggedIn" class="list-none p-3 m-0">
                  <li>
                    <SidebarListHead title="CrACKy" v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
                      <template #icon>
                        <Avatar size="xs" rounded="full" class="mb-2"/>
                      </template>
                    </SidebarListHead>
                    <SidebarList>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'dashboard' }" title="Centrum" icon="fa-solid fa-gauge"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'my-account' }" title="Upraviť profil" icon="fa-regular fa-pen-to-square"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-gallery' }" title="Galéria" icon="fa-regular fa-images"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-security' }" title="Zabezpečenie" icon="fa-solid fa-lock"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'messages' }" title="Správy" icon="fa-regular fa-comment"/>
                      <div>
                        <SidebarListHead title="Moje požiadavky" v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
                          <template #icon>
                            <i class="fa-solid fa-briefcase"></i>
                          </template>
                        </SidebarListHead>
                        <SidebarList class="hidden">
                          <SidebarListItem @click="closeCallback" :to="{ name: 'offers-all' }" title="Všetky"/>
                          <SidebarListItem @click="closeCallback" :to="{ name: 'offers-waiting' }" title="Čakajú na schválenie"/>
                        </SidebarList>
                      </div>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-plus' }" title="Plus +" icon="fa-regular fa-star"/>
                      <SidebarListItem @click="closeCallback" :to="{ name: 'user-stats' }" title="Štatistika" icon="fa-solid fa-chart-line"/>
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