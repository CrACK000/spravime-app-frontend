<script setup lang="ts">
import Panel from "@/components/template/Panel.vue";
</script>

<template>
  <panel divide="y">
    <div class="p-4 py-5 flex items-center justify-between gap-3">
      <div class="loading-bar h-3 w-80 animate-pulse"></div>
    </div>
    <div class="w-full p-5 animate-pulse">
      <div class="loading-bar h-3 w-96 mb-4"></div>
      <div class="loading-bar h-3 w-[420px] mb-4"></div>
      <div class="loading-bar h-3 w-[500px] mb-4"></div>
      <div class="loading-bar h-3 w-[400px] mb-4"></div>
      <div class="loading-bar h-3 w-[380px] mb-4"></div>
      <div class="loading-bar h-3 w-[560px]"></div>
    </div>
  </panel>
</template>