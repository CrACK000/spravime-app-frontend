<script setup lang="ts">
import profile from "@/plugins/profile";
</script>

<template>
  <div>
    <div class="text-3xl font-semibold dark:text-gray-200 text-gray-900 px-4 md:px-0">{{ profile.user.data?.name ? profile.user.data?.name : profile.user.data?.username }}</div>
    <div class="text-sm mt-1.5 pt-1.5 px-4 md:px-0 border-t border-gray-300 dark:border-gray-700/50 text-gray-500 dark:text-gray-500" v-if="profile.user.data?.slogan" v-text="profile.user.data?.slogan"></div>
  </div>
</template>