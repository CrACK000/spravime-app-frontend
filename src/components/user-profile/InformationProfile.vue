<script setup lang="ts">
import profile from "@/plugins/profile";
import Panel from "@/components/Panel.vue";
import {reactive} from "vue";

const state = reactive({
  accountTypeDisplay: {
    'company': 'Firma' as string,
    'worker': 'Majster' as string,
    'normal': 'Meno' as string
  }
})

</script>

<template>
  <panel divide="y" class="overflow-hidden">
    <li class="px-5 py-4 w-full flex items-center justify-center gap-2 bg-blue-400/20" v-if="profile.user.data?.verify">
      <svg class="w-5 h-5 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1 1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clip-rule="evenodd"/>
      </svg>
      <span class="font-medium text-blue-500 text-sm">Overený profil</span>
    </li>
    <li class="px-5 py-4 w-full flex items-center">
      <div class="w-52">
        {{ state.accountTypeDisplay[profile.user.data?.type !== undefined ? profile.user.data.type : 'normal'] }}
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        {{ profile.user.data?.name ? profile.user.data?.name : profile.user.data?.username }}
      </div>
    </li>
    <li v-if="profile.user.data?.address" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Adresa</div>
      <div class="w-full">
        {{ profile.user.data?.address }}
      </div>
    </li>
    <li class="px-5 py-4 w-full flex items-center">
      <div class="w-52">
        E-mail
      </div>
      <div class="w-full">
        <a :href="'mailto:' + profile.user.data?.email" class="link">{{ profile.user.data?.email }}</a>
      </div>
    </li>
    <li v-if="profile.user.data?.mobile" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Tel. číslo</div>
      <div class="w-full">
        <a :href="'tel:' + profile.user.data?.mobile" class="link tracking-wider">{{ profile.user.data?.mobile }}</a>
      </div>
    </li>
    <li v-if="profile.user.data?.facebook?.length || profile.user.data?.instagram?.length || profile.user.data?.tiktok?.length || profile.user.data?.linkedin?.length" class="px-5 py-4 w-full flex items-center">
      <div class="w-52">Sociálne siete</div>
      <div class="w-full flex gap-5">
        <a v-tooltip.top="'Facebook'" :href="profile.user.data?.facebook" target="_blank" class="link" v-if="profile.user.data?.facebook?.length">
          <i class="fa-xl fa-brands fa-square-facebook"></i>
        </a>
        <a v-tooltip.top="'Instagram'" :href="profile.user.data?.instagram" target="_blank" class="link" v-if="profile.user.data?.instagram?.length">
          <i class="fa-xl fa-brands fa-instagram"></i>
        </a>
        <a v-tooltip.top="'TikTok'" :href="profile.user.data?.tiktok" target="_blank" class="link" v-if="profile.user.data?.tiktok?.length">
          <i class="fa-xl fa-brands fa-tiktok"></i>
        </a>
        <a v-tooltip.top="'TikTok'" :href="profile.user.data?.linkedin" target="_blank" class="link" v-if="profile.user.data?.linkedin?.length">
          <i class="fa-xl fa-brands fa-linkedin"></i>
        </a>
      </div>
    </li>
  </panel>
</template>