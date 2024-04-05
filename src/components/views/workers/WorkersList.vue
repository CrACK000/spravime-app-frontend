<script setup lang="ts">
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
  <router-link v-for="user in workers" :to="{ name: 'profile', params: { userId: user._id } }" class="group first:md:rounded-t-2xl last:md:rounded-b-2xl transition" :class="[ user.verify ? 'bg-blue-500/20 dark:bg-blue-500/10 hover:bg-blue-500/25 dark:hover:bg-blue-600/10' : 'hover:bg-white dark:hover:bg-gray-900/5' ]">
    <div class="p-2 xs:p-4 flex gap-2.5 xs:gap-3.5 md:gap-4 lg:gap-5 xl:gap-6 items-center">
      <div class="text-center scale-100 group-hover:scale-110 transition h-12 md:h-16">
        <Avatar :img="user.avatar" :alt="user.profile.name ?? user.username" class="mx-auto hidden md:block" size="md" rounded="xxl" />
        <Avatar :img="user.avatar" :alt="user.profile.name ?? user.username" class="mx-auto md:hidden block" size="sm" rounded="xxl" />
      </div>
      <div class="w-full">
        <nickname :nickname="user.profile.name ?? user.username" :verify="user.verify" class="font-medium text-sm md:text-base" />
        <div class="max-w-3xl mt-0.5 hidden sm:block" :class="{ 'opacity-75': !user.verify }">
          <div class="text-xs sm:text-sm line-clamp-2">
            {{ user.profile.slogan }}
          </div>
        </div>
      </div>
      <div class="ms-auto flex items-center" v-if="user.reviews.count_reviews">
        <div class="w-20 sm:w-28">
          <div class="text-lg md:text-xl font-bold">
            <average-rating :rating="Number(user.reviews.average_rating)" class="justify-end sm:justify-center"/>
          </div>
        </div>
        <div class="w-24 hidden sm:block">
          <div class="text-xl font-bold text-center">
            {{ user.reviews.count_reviews }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>