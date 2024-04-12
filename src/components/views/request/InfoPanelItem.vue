<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <li class="flex flex-col md:flex-row md:items-center justify-between px-2 py-2.5 pt-3">
    <span class="text-xs opacity-50 md:opacity-90 md:text-base">{{ title }}</span>
    <div class="md:text-end mt-1 md:mt-0">
      <slot/>
    </div>
  </li>
</template>