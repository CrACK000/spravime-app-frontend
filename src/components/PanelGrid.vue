<template>
  <div class="grid gap-2 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8" :class="[grid ? 'grid-cols-' + grid : 'grid-cols-1']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  grid: String
})
</script>