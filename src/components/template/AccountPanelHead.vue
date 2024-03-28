<script setup lang="ts">

</script>

<template>
  <div class="pb-3 mb-3 px-4 border-b border-gray-300 dark:border-gray-700/75 flex items-center justify-between">
    <div class="font-medium text-xl md:text-2xl text-gray-600 dark:text-gray-500">
      <slot/>
    </div>
    <div v-if="$slots.right">
      <slot name="right"/>
    </div>
  </div>
</template>