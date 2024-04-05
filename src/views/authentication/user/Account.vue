<script setup lang="ts">
import {inject, ref} from 'vue'
import AccountMenu from "@/components/template/AccountMenu.vue"
import AccountMenuItem from "@/components/template/AccountMenuItem.vue"

const auth = inject<Auth>('auth')
const loggedIn = ref(auth?.loggedIn as boolean)
const newMsg = ref<number>(auth?.newMsgCount)
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="flex flex-col lg:flex-row gap-10 relative" v-if="auth && loggedIn">

      <div class="lg:w-3/12 hidden lg:block">
        <AccountMenu>
          <AccountMenuItem :to="{ name: 'dashboard' }" title="Centrum" icon="fa-solid fa-gauge-high"/>
          <AccountMenuItem :to="{ name: 'user-account' }" title="Upraviť účet" icon="fa-regular fa-circle-user"/>
          <AccountMenuItem :to="{ name: 'user-gallery' }" title="Galéria" icon="fa-regular fa-images"/>
          <AccountMenuItem :to="{ name: 'messages' }" title="Správy" icon="fa-regular fa-message" :badge="newMsg"/>
          <AccountMenuItem :to="{ name: 'user-requests' }" title="Moje požiadavky" icon="fa-solid fa-briefcase"/>
          <AccountMenuItem :to="{ name: 'user-offers' }" title="Moje ponuky" icon="fa-regular fa-handshake"/>
          <AccountMenuItem :to="{ name: 'user-stats' }" title="Štatistika" icon="fa-solid fa-chart-line"/>
          <AccountMenuItem :to="{ name: 'user-plus' }" title="Plus +" icon="fa-regular fa-circle-check"/>
          <AccountMenuItem :to="{ name: 'user-security' }" title="Zabezpečenie" icon="fa-solid fa-lock"/>
          <AccountMenuItem :to="{ name: 'logout' }" title="Odhlásiť sa" icon="fa-solid fa-arrow-right-from-bracket"/>
        </AccountMenu>
      </div>

      <div class="lg:w-9/12 mt-4 px-2 xs:px-4">
        <router-view v-slot="{ Component, route }">
          <transition
            enter-active-class="animate__animated animate__fadeIn"
            leave-active-class="animate__animated animate__fadeOut"
            mode="out-in"
          >
            <component :is="Component" :key="route.path"/>
          </transition>
        </router-view>
      </div>

    </div>
  </div>
</template>
