<script setup lang="ts">
import Panel from "@/components/template/Panel.vue";
</script>

<template>
  <panel divide="y">
    <li class="px-5 py-6 w-full flex items-center animate-pulse">
      <div class="w-52">
        <div class="loading-bar h-3 w-24"></div>
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        <div class="loading-bar h-3 w-44"></div>
      </div>
    </li>
    <li class="px-5 py-6 w-full flex items-center animate-pulse">
      <div class="w-52">
        <div class="loading-bar h-3 max-w-full w-20"></div>
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        <div class="loading-bar h-3 max-w-full w-32"></div>
      </div>
    </li>
    <li class="px-5 py-6 w-full flex items-center animate-pulse">
      <div class="w-52">
        <div class="loading-bar h-3 max-w-full w-24"></div>
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        <div class="loading-bar h-3 max-w-full w-36"></div>
      </div>
    </li>
    <li class="px-5 py-6 w-full flex items-center animate-pulse">
      <div class="w-52">
        <div class="loading-bar h-3 max-w-full w-24"></div>
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        <div class="loading-bar h-3 max-w-full w-44"></div>
      </div>
    </li>
    <li class="px-5 py-6 w-full flex items-center animate-pulse">
      <div class="w-52">
        <div class="loading-bar h-3 max-w-full w-20"></div>
      </div>
      <div class="w-full text-lg font-medium text-gray-700 dark:text-gray-400">
        <div class="loading-bar h-3 max-w-full w-32"></div>
      </div>
    </li>
  </panel>
</template>