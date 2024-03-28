<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
import {reactive} from "vue"
import user from "@/plugins/profile"
import SkeletonProfileInformation from "@/components/skeletons/SkeletonProfileInformation.vue";

const state = reactive({
  accountTypeDisplay: {
    'company': 'Firma' as string,
    'worker': 'Majster' as string,
    'normal': 'Meno' as string
  }
})

</script>

<template>

  <panel v-if="!user.data.user_loading" divide="y" class="overflow-hidden">
    <li class="px-5 py-4 w-full flex items-center justify-center gap-2 bg-blue-400/20" v-if="user.data.user?.verify">
      <svg class="w-5 h-5 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1 1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clip-rule="evenodd"/>
      </svg>
      <span class="font-medium text-blue-500 text-sm">Overený profil</span>
    </li>
    <li class="px-5 py-4 w-full flex items-center">
      <div class="w-52">
        {{ state.accountTypeDisplay[user.data.user?.profile.type !== undefined ? user.data.user?.profile.type : 'normal'] }}
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        {{ user.data.user?.profile.name ? user.data.user?.profile.name : user.data.user?.username }}
      </div>
    </li>
    <li v-if="user.data.user?.profile.address" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Adresa</div>
      <div class="w-full">
        {{ user.data.user?.profile.address }}
      </div>
    </li>
    <li class="px-5 py-4 w-full flex items-center">
      <div class="w-52">
        E-mail
      </div>
      <div class="w-full">
        <a :href="'mailto:' + user.data.user?.email" class="link">{{ user.data.user?.email }}</a>
      </div>
    </li>
    <li v-if="user.data.user?.phone" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Tel. číslo</div>
      <div class="w-full">
        <a :href="'tel:' + user.data.user?.phone" class="link tracking-wider">{{ user.data.user?.phone }}</a>
      </div>
    </li>
    <li v-if="user.data.user?.social.facebook?.length || user.data.user?.social.instagram?.length || user.data.user?.social.tiktok?.length || user.data.user?.social.linkedin?.length" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Sociálne siete</div>
      <div class="w-full flex gap-5">
        <a v-tooltip.top="'Facebook'" :href="`${user.data.user.social.facebook}`" target="_blank" class="link" v-if="user.data.user?.social.facebook?.length">
          <i class="fa-xl fa-brands fa-square-facebook"></i>
        </a>
        <a v-tooltip.top="'Instagram'" :href="`${user.data.user.social.instagram}`" target="_blank" class="link" v-if="user.data.user?.social.instagram?.length">
          <i class="fa-xl fa-brands fa-instagram"></i>
        </a>
        <a v-tooltip.top="'TikTok'" :href="`${user.data.user.social.tiktok}`" target="_blank" class="link" v-if="user.data.user?.social.tiktok?.length">
          <i class="fa-xl fa-brands fa-tiktok"></i>
        </a>
        <a v-tooltip.top="'TikTok'" :href="`${user.data.user.social.linkedin}`" target="_blank" class="link" v-if="user.data.user?.social.linkedin?.length">
          <i class="fa-xl fa-brands fa-linkedin"></i>
        </a>
      </div>
    </li>
  </panel>

  <skeleton-profile-information v-else />

</template>