<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="group flex items-center gap-x-3 cursor-pointer p-3 rounded-md dark:hover:bg-gray-700/75 hover:bg-gray-200 transition">
    <div v-if="$slots.icon" class="w-8 flex items-center justify-center scale-100 group-hover:scale-110 group-hover:text-blue-600 transition">
      <slot name="icon"/>
    </div>
    <span class="font-medium">{{ title }}</span>
    <div class="ms-auto">
      <i class="fa-solid fa-chevron-down"></i>
    </div>
  </div>
</template>