<script setup lang="ts">
import Panel from "@/components/template/Panel.vue";
</script>

<template>
  <panel divide="y">
    <div class="p-4 py-5">
      <div class="loading-bar h-3 w-36 animate-pulse"></div>
    </div>
    <div class="w-full animate-pulse p-4">
      <div class="loading-bar h-3 w-48 max-w-full mb-3"></div>
      <div class="loading-bar h-3 w-32 max-w-full mb-3"></div>
      <div class="loading-bar h-3 w-56 max-w-full"></div>
    </div>
  </panel>
</template>