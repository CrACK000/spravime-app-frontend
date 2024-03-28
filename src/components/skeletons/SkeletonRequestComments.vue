<script setup lang="ts">
import Panel from "@/components/template/Panel.vue";
</script>

<template>
  <panel divide="y">
    <div class="p-4 py-5 flex items-center justify-between gap-3">
      <div class="loading-bar h-3 w-80 animate-pulse"></div>
    </div>
    <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/40">
      <div class="w-full p-5 animate-pulse grid grid-cols-11">
        <div class="col-span-1">
          <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
          </svg>
        </div>
        <div class="col-span-10 px-5">
          <div class="loading-bar h-3 w-32 mb-6"></div>
          <div class="loading-bar h-2.5 w-96 mb-3"></div>
          <div class="loading-bar h-2.5 w-[420px] mb-3"></div>
          <div class="loading-bar h-2.5 w-[500px] mb-3"></div>
          <div class="loading-bar h-2.5 w-[400px]"></div>
        </div>
      </div>
      <div class="w-full p-5 animate-pulse grid grid-cols-11">
        <div class="col-span-1">
          <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
          </svg>
        </div>
        <div class="col-span-10 px-5">
          <div class="loading-bar h-3 w-32 mb-6"></div>
          <div class="loading-bar h-2.5 w-[500px] mb-3"></div>
          <div class="loading-bar h-2.5 w-80 mb-3"></div>
          <div class="loading-bar h-2.5 w-[400px]"></div>
        </div>
      </div>
      <div class="w-full p-5 animate-pulse grid grid-cols-11">
        <div class="col-span-1">
          <svg class="w-14 h-14 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
          </svg>
        </div>
        <div class="col-span-10 px-5">
          <div class="loading-bar h-3 w-32 mb-6"></div>
          <div class="loading-bar h-2.5 w-96 mb-3"></div>
          <div class="loading-bar h-2.5 w-[400px] mb-3"></div>
          <div class="loading-bar h-2.5 w-[450px] mb-3"></div>
          <div class="loading-bar h-2.5 w-[380px]"></div>
        </div>
      </div>
    </div>
  </panel>
</template>