<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true
  },
  blank: {
    type: Boolean
  }
})
</script>

<template>
  <li>
    <a :href="href" :target="blank ? '_blank' : ''" class="link hover:underline">
      {{ title }}
    </a>
  </li>
</template>