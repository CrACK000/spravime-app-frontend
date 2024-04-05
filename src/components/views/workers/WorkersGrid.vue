<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
import Nickname from "@/components/app/Nickname.vue"
import Avatar from "@/components/app/Avatar.vue"
import AverageRating from "@/components/app/AverageRating.vue"

defineProps({
  workers: {
    type: Array as () => User[],
    required: true
  }
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-4 md:gap-6">
    <Panel v-for="user in workers" class="overflow-hidden">
      <router-link :to="{ name: 'profile', params: { userId: user._id } }">
        <div class="p-4 group flex flex-col h-52 sm:h-72 transition" :class="[ user.verify ? 'bg-blue-500/20 dark:bg-blue-500/10 hover:bg-blue-500/25 dark:hover:bg-blue-600/10' : 'hover:bg-white dark:hover:bg-gray-900/5' ]">
          <div class="text-center mb-5 sm:mb-3">
            <Avatar :img="user.avatar" :alt="user.profile.name ?? user.username" class="hidden sm:inline-block" size="xl" rounded="xl" />
            <Avatar :img="user.avatar" :alt="user.profile.name ?? user.username" class="sm:hidden inline-block" size="lg" rounded="xl" />
          </div>
          <div class="mb-2">
            <nickname :nickname="user.profile.name ?? user.username" :verify="user.verify" class="font-medium text-xs xs:text-sm sm:text-base" />
          </div>
          <div class="hidden sm:inline-block">
            <div class="text-xs line-clamp-2" :class="{ 'opacity-75': !user.verify }">
              {{ user.profile.slogan }}
            </div>
          </div>
          <div class="flex items-end justify-between mt-auto">
            <div class="font-bold text-gray-600 dark:text-gray-400 hidden sm:block">
              <span class="text-xs font-normal">Recenzie</span> {{ user.reviews.count_reviews }}
            </div>
            <average-rating :rating="Number(user.reviews.average_rating)" class="ms-auto font-bold md:text-lg"/>
          </div>
        </div>
      </router-link>
    </Panel>
  </div>
</template>