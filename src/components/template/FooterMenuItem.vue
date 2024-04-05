<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  to: {
    type: Object,
    required: true
  },
})
</script>

<template>
  <li>
    <router-link :to="to" class="link hover:underline">
      {{ title }}
    </router-link>
  </li>
</template>