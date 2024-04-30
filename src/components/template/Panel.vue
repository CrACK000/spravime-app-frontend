<script setup lang="ts">
const props = defineProps({
  divide: String,
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-md shadow-blue-700/5 dark:shadow-black/10 rounded-xl md:rounded-2xl">
    <div :class="{'divide-y': props.divide === 'y', 'divide-x': props.divide === 'x', 'flex flex-col divide-gray-200 dark:divide-gray-700/40': props.divide}">
      <slot></slot>
    </div>
  </div>
</template>