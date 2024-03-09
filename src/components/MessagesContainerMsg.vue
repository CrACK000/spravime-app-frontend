<script setup lang="ts">
defineProps({
  author: Boolean
})
</script>

<template>
  <div class="text-sm md:px-3" :class="[author ? 'ms-auto' : 'me-auto']">

    <div class="flex items-start gap-x-2 mb-1" :class="[author ? 'justify-end' : 'justify-start']">

      <div class="inline-block p-2 rounded-lg shadow-lg" :class="[author ? 'order-1 bg-blue-600 dark:bg-blue-700/60 text-white dark:text-gray-300' : 'order-2 bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-300']">
        <slot name="message"/>
      </div>

      <slot name="avatar"/>

    </div>

    <div class="text-[10px] opacity-50 mb-2" :class="[author ? 'text-end' : 'text-start']">
      <slot name="date"/>
    </div>

  </div>
</template>