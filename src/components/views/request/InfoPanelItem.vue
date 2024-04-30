<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <li class="flex flex-col md:flex-row md:items-center justify-between px-4 py-2.5 md:px-6 md:py-4">
    <span class="text-xs opacity-50 md:opacity-60 md:text-sm">{{ title }}</span>
    <div class="md:text-end mt-1 md:mt-0">
      <slot/>
    </div>
  </li>
</template>