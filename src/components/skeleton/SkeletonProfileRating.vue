<script setup lang="ts">
import Panel from "@/components/Panel.vue";
</script>

<template>
  <panel divide="y">
    <div class="flex justify-between items-center py-5 px-5 animate-pulse">
      <div class="w-full">
        <div class="loading-bar h-3 w-28"></div>
      </div>
      <div class="text-xl w-20 font-bold text-center text-red-400">
        <div class="loading-bar h-3 w-32"></div>
      </div>
    </div>
    <div class="flex justify-between items-center py-5 px-5 animate-pulse">
      <div class="w-full">
        <div class="loading-bar h-3 w-32"></div>
      </div>
      <div class="text-xl w-20 font-bold text-center text-red-400">
        <div class="loading-bar h-3 w-14"></div>
      </div>
    </div>
    <div class="flex justify-between items-center py-5 px-5 animate-pulse">
      <div class="w-full">
        <div class="loading-bar h-3 w-28"></div>
      </div>
      <div class="text-xl w-20 font-bold text-center text-red-400">
        <div class="loading-bar h-3 w-14"></div>
      </div>
    </div>
    <div class="flex justify-between items-center py-5 px-5 animate-pulse">
      <div class="w-full">
        <div class="loading-bar h-3 w-24"></div>
      </div>
      <div class="text-xl w-20 font-bold text-center text-red-400">
        <div class="loading-bar h-3 w-14"></div>
      </div>
    </div>
  </panel>
</template>