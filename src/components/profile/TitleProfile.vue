<script setup lang="ts">
import user from "@/plugins/profile"
import SkeletonProfileTitle from "@/components/skeletons/SkeletonProfileTitle.vue"
</script>

<template>

  <div v-if="!user.data.user_loading">
    <div class="text-3xl font-semibold dark:text-gray-200 text-gray-900 px-4 md:px-0">
      {{ user.data.user?.profile.name ? user.data.user?.profile.name : user.data.user?.username }}
    </div>
    <div class="text-sm mt-1.5 pt-1.5 px-4 md:px-0 border-t border-gray-300 dark:border-gray-700/50 text-gray-500 dark:text-gray-500"
         v-if="user.data.user?.profile.slogan"
         v-text="user.data.user?.profile.slogan"
    ></div>
  </div>

  <skeleton-profile-title v-else />

</template>