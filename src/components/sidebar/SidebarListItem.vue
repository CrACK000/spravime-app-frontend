<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: Object,
    required: true
  },
  icon: String,
  badge: Number
})
</script>

<template>
  <li>
    <router-link :to="to" :class="[ $route.name === to.name ? 'text-black dark:text-white dark:bg-gray-700/75 bg-gray-200' : '']" class="group flex items-center gap-x-3 cursor-pointer p-3 rounded-md dark:hover:bg-gray-700/75 hover:bg-gray-200 transition">
      <div v-if="icon" class="w-8 flex items-center justify-center transition">
        <i :class="`${icon} fa-lg`"></i>
      </div>
      <div class="flex w-full gap-1 items-center justify-between">
        <span class="font-medium" v-text="title"></span>
        <div v-if="badge" class="bg-blue-500 text-xs text-white drop-shadow w-5 h-5 rounded-lg flex justify-center items-center shadow-xl font-bold" v-text="badge"></div>
      </div>
    </router-link>
  </li>
</template>