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

        <button id="theme-toggle" type="button" class="text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 focus:outline-none rounded-xl text-sm p-2.5 transition">
          <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>

        <div v-if="loggedIn">
          <Menu as="div" class="relative inline-block">
            <div>
              <MenuButton class="w-10 h-10 ms-3 cursor-pointer rounded-full hover:ring-8 hover:ring-white dark:hover:ring-gray-700 relative">
                <div v-if="notifyMsg" class="absolute top-1/2 right-1/2 translate-x-[50%] translate-y-[-50%] -z-30 w-12 h-12 rounded-full bg-blue-500/50 animate-pulse"></div>
                <img class="w-10 h-10 z-50 rounded-full" alt="User dropdown" :src="user.avatar">
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 overflow-hidden text-sm">

                <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <nickname :nickname="user.username" :verify="user.verify" :class="{'text-blue-500 font-semibold': user.verify }"/>
                  <div class="font-medium truncate">{{ user.email }}</div>
                </div>

                <div class="py-1">
                  <MenuItem v-slot="{ close }">
                    <div @click="navigateTo({ name: 'profile' , params: { id: user.id }}, close)" :class="['block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer']">
                      <div class="flex w-full gap-1 items-center justify-between">
                        Profil
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem v-slot="{ close }" v-for="ulink in user_links">
                    <div @click="navigateTo(ulink.name, close)" :class="['block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer']">
                      <div class="flex w-full gap-1 items-center justify-between">
                        {{ ulink.title }}
                        <div v-if="notifyMsg" class="bg-blue-500/60 text-xs text-white w-5 h-5 rounded-md flex justify-center items-center shadow font-medium" v-text="notifyMsg"></div>
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
        <button class="lg:hidden inline-block bg-gradient-to-l from-gray-800/50 hover:from-gray-700/50 to-gray-700/50 hover:to-gray-600/50 text-white dark:text-gray-100/50 hover:text-gray-100/80 p-2 rounded-md shadow-xl" type="button">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, inject} from 'vue';
import type {Auth, User} from "@/types/users";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {useRouter} from "vue-router";
import Nickname from "@/components/app/Nickname.vue";

const router = useRouter();
const auth = inject<Auth>('auth');
const user = ref(auth?.user as User);
const loggedIn = ref(auth?.loggedIn as boolean);

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
]);
const notifyMsg = ref(0);

const navigateTo = async (routeName: any, close: () => void) => {
  await router.push(routeName);
  close();
};

</script>