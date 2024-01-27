<template>
  <div class="p-4 flex justify-between items-center gap-3 bg-gray-100 dark:bg-black/5 rounded-b-md md:rounded-b-lg">
    <div class="text-sm">
      <slot name="left"/>
    </div>
    <div class="flex items-center gap-3">
      <slot name="right"/>
    </div>
  </div>
</template>