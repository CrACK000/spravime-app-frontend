<script setup lang="ts">
defineProps({
  page: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <button type="button" class="py-3 px-5 text-gray-500 hover:text-black disabled:text-gray-400 dark:text-gray-300 dark:hover:text-white dark:disabled:text-gray-400 font-medium">{{ page }}</button>
</template>