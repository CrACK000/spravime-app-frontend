<script setup lang="ts">

</script>

<template>
  <div>
    <div class="px-4 pb-2 flex gap-3.5 md:gap-4 lg:gap-5 xl:gap-6 items-center">
      <div class="w-12 md:w-16"></div>
      <div class="text-gray-400 dark:text-gray-600 text-xs md:text-sm">Meno & Slogan</div>
      <div class="ms-auto flex items-center">
        <div class="w-20 sm:w-28">
          <div class="text-gray-400 dark:text-gray-600 text-xs md:text-sm text-end sm:text-center">Hodnotenie</div>
        </div>
        <div class="w-24 hidden sm:block">
          <div class="text-gray-400 dark:text-gray-600 text-xs md:text-sm text-center">Recenzie</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-y-3">
      <slot/>
    </div>
  </div>
</template>