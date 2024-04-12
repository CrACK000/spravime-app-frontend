<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"

const props = defineProps({
  rows: {
    type: Number,
    default: 10
  }
})
</script>

<template>
  <panel v-for="key in props.rows" :key="key">
    <div class="p-6 flex gap-3 items-end">
      <div class="flex flex-col gap-y-4">
        <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-3.5 max-w-full animate-pulse"></div>
        <div :style="{ 'width': Math.floor(Math.random()*(400-100+1)+100) + 'px' }" class="loading-bar h-2 max-w-full animate-pulse"></div>
      </div>
      <div class="ms-auto loading-bar h-3 w-16 animate-pulse"></div>
    </div>
  </panel>
</template>