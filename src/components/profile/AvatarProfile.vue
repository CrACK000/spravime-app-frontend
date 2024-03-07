<script setup lang="ts">
import user from "@/plugins/profile"
import SkeletonProfileAvatar from "@/components/skeletons/SkeletonProfileAvatar.vue"
import Avatar from "@/components/app/Avatar.vue"
</script>

<template>

  <div v-if="!user.data.user_loading" class="flex justify-center">
    <div class="relative">
      <Avatar :img="user.data.user?.avatar" :alt="user.data.user?.profile.name ?? user.data.user?.username" size="xxl" rounded="xxl" class="shadow-2xl" />
      <button type="button" disabled v-tooltip.right="'Overený profil'" v-if="Boolean(user.data.user?.verify)" class="absolute top-3 left-3 flex gap-2 items-center justify-center text-blue-500 font-medium">
        <svg class="w-8 h-8 text-blue-500 drop-shadow-xl" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 12 2 2 5-5m4.5 5.3 1-.9a2 2 0 0 0 0-2.8l-1-.9a2 2 0 0 1-.6-1.4V7a2 2 0 0 0-2-2h-1.2a2 2 0 0 1-1.4-.5l-.9-1a2 2 0 0 0-2.8 0l-.9 1a2 2 0 0 1-1.4.6H7a2 2 0 0 0-2 2v1.2c0 .5-.2 1-.5 1.4l-1 .9a2 2 0 0 0 0 2.8l1 .9c.3.4.6.9.6 1.4V17a2 2 0 0 0 2 2h1.2c.5 0 1 .2 1.4.5l.9 1a2 2 0 0 0 2.8 0l.9-1a2 2 0 0 1 1.4-.6H17a2 2 0 0 0 2-2v-1.2c0-.5.2-1 .5-1.4Z"/>
        </svg>
      </button>
    </div>
  </div>

  <skeleton-profile-avatar v-else />

</template>