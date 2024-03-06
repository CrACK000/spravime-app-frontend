<script setup lang="ts">
import Panel from "@/components/Panel.vue"
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto mt-auto">
    <panel class="mb-4 p-4">
      <div class="w-full mx-auto md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">2024 Spravime. All Rights Reserved.
      </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <router-link :to="{ name: 'login' }" class="link hover:underline me-4 md:me-6">About</router-link>
          </li>
          <li>
            <a href="#" class="link hover:underline me-4 md:me-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" class="link hover:underline me-4 md:me-6">Licensing</a>
          </li>
          <li>
            <a href="#" class="link hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </panel>
  </div>
</template>