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
  icon: String
})
</script>

<template>
  <li>
    <router-link :to="to" class="group flex items-center gap-x-3 cursor-pointer p-3 rounded-md dark:hover:bg-gray-700/75 hover:bg-gray-200 transition">
      <div v-if="icon" class="w-8 flex items-center justify-center scale-100 group-hover:scale-110 group-hover:text-blue-600 transition">
        <i :class="`${icon} fa-lg`"></i>
      </div>
      <span class="font-medium">{{ title }}</span>
    </router-link>
  </li>
</template>