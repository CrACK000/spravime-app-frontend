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
    <router-link :to="to" :class="[$route.name === to.name || (to.name === 'user-requests' ? ($route.name === 'create-request') : false) || (to.name === 'user-offers' ? ($route.name === 'create-offer') : false) ? 'tab-active' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300']" class="flex items-center gap-2 cursor-pointer w-full hover:bg-white/80 dark:hover:bg-gray-800/50 transition px-4 py-2.5 rounded-md font-medium">
      <div class="menu-icon">
        <i :class="icon"></i>
      </div>

      <div class="flex w-full gap-1 items-center justify-between">
        {{ title }}
        <div v-if="badge" class="bg-blue-500 text-xs text-white drop-shadow w-5 h-5 rounded-lg flex justify-center items-center shadow-xl font-bold" v-text="badge"></div>
      </div>
    </router-link>
  </li>
</template>