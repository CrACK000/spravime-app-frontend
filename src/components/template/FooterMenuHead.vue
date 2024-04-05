<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <li>
    <span class="uppercase font-semibold text-sm">
      {{ title }}
    </span>
  </li>
</template>