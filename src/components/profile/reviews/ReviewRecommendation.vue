<script setup lang="ts">
defineProps({
  recommendation: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div v-if="recommendation" class="text-emerald-500 font-semibold">
    <i class="fa-regular fa-thumbs-up"></i> Odporúčam
  </div>
  <div v-else class="text-red-500 font-semibold">
    <i class="fa-regular fa-thumbs-down"></i> Neodporúčam
  </div>
</template>