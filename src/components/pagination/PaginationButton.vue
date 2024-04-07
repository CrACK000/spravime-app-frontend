<script setup lang="ts">
defineProps({
  page: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <button type="button" class="py-3 px-5 text-gray-300 hover:text-white disabled:text-gray-400 font-medium">{{ page }}</button>
</template>