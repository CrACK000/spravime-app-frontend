<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10 relative" v-if="auth && loggedIn">
      <div class="lg:w-3/12 hidden lg:block">
        <div class="sticky top-0 p-4">
          <ul class="flex flex-col gap-2">
            <li v-for="tab in user_links">
              <router-link :to="{ name: tab.name }"
                           :class="[$route.name === tab.name || (tab.subs && findSelectTab(tab.subs)) ? 'tab-active' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300']"
                           class="flex items-center gap-2 cursor-pointer w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition duration-100 px-4 py-2.5 rounded-md font-medium"
                           @click="scrollTop"
              ><div class="menu-icon"><i :class="tab.icon"></i></div>
                <div class="flex w-full gap-1 items-center justify-between">
                  {{ tab.title }}
                  <div v-if="tab.name === 'messages' && notifyMsg" class="bg-blue-500/60 text-xs text-white w-5 h-5 rounded-md flex justify-center items-center shadow font-medium" v-text="notifyMsg"></div>
                </div>
              </router-link>
              <div v-if="tab.subs" class="flex flex-col gap-2 border-l border-gray-300 dark:border-gray-800 ms-1 p-1.5">
                <div v-for="sub in tab.subs">
                  <router-link :to="{ name: sub.name }"
                               v-text="sub.title"
                               @click="scrollTop"
                               class="cursor-pointer block w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition duration-100 px-3 py-2 -ms-[1px] rounded-md text-sm font-medium"
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
      <div class="lg:w-9/12">
        <router-view name="userPanel"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import router from "@/router";
import type {Auth, User} from "@/types/users";
import {checkNewMessages} from "@/plugins/checkNewMessages";
import {useRoute} from "vue-router";

const route = useRoute();
const auth = inject<Auth>('auth');
const user = ref(auth?.user as User);
const loggedIn = ref(auth?.loggedIn as boolean);

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
]);
const notifyMsg = ref(0);

const findSelectTab = (tabs: TabType[]) => {
  return tabs && tabs.some(tab => tab.name === route.name);
}
const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const fetchNewMessagesCount = async (id: number) => {
  notifyMsg.value = <number> await checkNewMessages(id);
}

onMounted(async () => {
  await fetchNewMessagesCount(user.value.id);
})
</script>
