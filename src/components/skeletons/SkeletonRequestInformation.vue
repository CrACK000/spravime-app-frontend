<script setup lang="ts">
import Panel from "@/components/template/Panel.vue";
</script>

<template>
  <panel divide="y">
    <div class="w-full animate-pulse">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700/40">
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-20 max-w-full"></div>
          <div class="loading-bar h-3 w-32 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-16 max-w-full"></div>
          <div class="loading-bar h-3 w-44 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-20 max-w-full"></div>
          <div class="loading-bar h-3 w-48 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-20 max-w-full"></div>
          <div class="loading-bar h-3 w-36 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-32 max-w-full"></div>
          <div class="loading-bar h-3 w-24 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-28 max-w-full"></div>
          <div class="loading-bar h-3 w-28 max-w-full"></div>
        </li>
        <li class="flex justify-between px-4 py-4 md:px-6 md:py-5">
          <div class="loading-bar h-3 w-24 max-w-full"></div>
          <div class="loading-bar h-3 w-20 max-w-full"></div>
        </li>
      </ul>
    </div>
  </panel>
</template>