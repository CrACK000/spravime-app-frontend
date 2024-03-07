<script setup lang="ts">
import {inject, ref} from 'vue'
import router from "@/router"
import {useRoute} from "vue-router"

const route = useRoute()
const auth = inject<Auth>('auth')
const loggedIn = ref(auth?.loggedIn as boolean)

if (!loggedIn.value){
  router.push({ name: 'index' })
}

type TabType = {
  name?: string,
  title?: string,
  badge?: boolean,
  icon?: string,
  subs?: TabType[]
}

const user_links = ref([
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: 'fa-solid fa-gauge-high',
  },
  {
    name: 'my-account',
    title: 'Účet',
    icon: 'fa-regular fa-circle-user',
    subs: [
      { name: 'edit-design', title: 'Vzhľad' },
      { name: 'user-gallery', title: 'Galéria' },
      { name: 'user-security', title: 'Zabezpečenie' },
      { name: 'user-stats', title: 'Štatistika' },
      { name: 'user-plus', title: 'Plus +' },
    ]
  },
  {
    name: 'messages',
    title: 'Správy',
    icon: 'fa-regular fa-message',
  },
  {
    name: 'my-offers',
    title: 'Moje požiadavky',
    icon: 'fa-solid fa-briefcase',
    subs: [
      { name: 'offers-all', title: 'Všetky' },
      { name: 'offers-waiting', title: 'Čakajúce na schválenie' },
    ]
  },
])
const newMsg = ref<number>(auth?.newMsgCount)

const findSelectTab = (tabs: TabType[]) => {
  return tabs && tabs.some(tab => tab.name === route.name)
}
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10 relative" v-if="auth && loggedIn">
      <div class="lg:w-3/12 hidden lg:block">
        <div class="sticky top-0 p-4">
          <ul class="flex flex-col gap-2">

            <!-- Create Offer -->
            <li class="mb-4">
              <router-link :to="{ name: 'offerAdd' }" class="flex items-center divide-x divide-white/30 py-3 bg-gradient-to-bl from-blue-600 to-indigo-500 rounded-xl shadow-xl text-lg text-blue-100 hover:text-white transition">
                <div class="ps-4 pe-3">
                  <svg class="w-6 h-6" :class="[$route.name === 'offerAdd' ? 'text-white' : 'opacity-75']" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M8 7V2.2a2 2 0 0 0-.5.4l-4 3.9a2 2 0 0 0-.3.5H8Zm2 0V2h7a2 2 0 0 1 2 2v.1a5 5 0 0 0-4.7 1.4l-6.7 6.6a3 3 0 0 0-.8 1.6l-.7 3.7a3 3 0 0 0 3.5 3.5l3.7-.7a3 3 0 0 0 1.5-.9l4.2-4.2V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M17.4 8a1 1 0 0 1 1.2.3 1 1 0 0 1 0 1.6l-.3.3-1.6-1.5.4-.4.3-.2Zm-2.1 2.1-4.6 4.7-.4 1.9 1.9-.4 4.6-4.7-1.5-1.5ZM17.9 6a3 3 0 0 0-2.2 1L9 13.5a1 1 0 0 0-.2.5L8 17.8a1 1 0 0 0 1.2 1.1l3.7-.7c.2 0 .4-.1.5-.3l6.6-6.6A3 3 0 0 0 18 6Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ps-4" :class="{'text-white': $route.name === 'offerAdd'}">
                  Vytvoriť požiadavku
                </div>
              </router-link>
            </li>

            <li v-for="tab in user_links">
              <router-link :to="{ name: tab.name }"
                           :class="[$route.name === tab.name || (tab.subs && findSelectTab(tab.subs)) ? 'tab-active' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300']"
                           class="flex items-center gap-2 cursor-pointer w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition px-4 py-2.5 rounded-md font-medium"
              ><div class="menu-icon"><i :class="tab.icon"></i></div>
                <div class="flex w-full gap-1 items-center justify-between">

                  {{ tab.title }}

                  <div v-if="tab.name === 'messages' && newMsg" class="bg-blue-500 text-xs text-white drop-shadow w-5 h-5 rounded-lg flex justify-center items-center shadow-xl font-bold"
                       v-text="newMsg"
                  ></div>

                </div>
              </router-link>
              <div v-if="tab.subs" class="flex flex-col gap-2 border-l border-gray-300 dark:border-gray-800 ms-1 p-1.5">
                <div v-for="sub in tab.subs">
                  <router-link :to="{ name: sub.name }"
                               v-text="sub.title"
                               class="cursor-pointer block w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition px-3 py-2 -ms-[1px] rounded-md text-sm font-medium"
                               :class="[$route.name === sub.name ? 'tab-active' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300']"
                  ></router-link>
                </div>
              </div>
            </li>
            <li>
              <router-link :to="{ name: 'logout' }" class="flex items-center gap-2 cursor-pointer w-full hover:bg-white/80 dark:hover:bg-gray-800/50 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition duration-100 px-4 py-2.5 rounded-md">
                <div class="menu-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></div> Odhlásiť sa
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="lg:w-9/12 p-4">
        <router-view v-slot="{ Component, route }">
          <transition :name="String(route.meta.transition)">
            <KeepAlive>
              <component :is="Component" :key="route.path"/>
            </KeepAlive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
