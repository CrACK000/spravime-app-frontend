<script setup lang="ts">
import Panel from "./Panel.vue"
</script>

<template>
  <panel class="relative h-[680px] overflow-hidden">
    <div class="flex items-start w-full h-full">

      <div id="accounts" class="w-full md:w-4/12 h-[680px] bg-gray-300/40 dark:bg-gray-700/20 shadow-xl">
        <slot name="accounts"/>
      </div>

      <div id="messages" class="w-full md:w-8/12 h-[680px] overlay-chat md:block hidden">
        <slot name="messages"/>
      </div>

    </div>
  </panel>
</template>