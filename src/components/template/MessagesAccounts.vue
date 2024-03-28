<script setup lang="ts">
defineProps({
  selected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <li class="relative hover:bg-gray-300/25 hover:dark:bg-gray-700/25 flex items-center gap-4 p-2 rounded-md w-full cursor-pointer transition duration-100"
      :class="[selected ? 'bg-gray-300/50 hover:bg-gray-300/75 dark:bg-gray-700/50 hover:dark:bg-gray-700/75' : '']"
  >

    <slot name="avatar"/>

    <div class="w-full flex flex-col">

      <div class="truncate">
        <slot name="username"/>
      </div>

      <div class="mt-auto text-xs opacity-75">
        <div class="max-w-full line-clamp-2">
          <slot name="lastMsg"/>
        </div>
        <div class="w-full text-[11px] text-end text-gray-500 font-semibold">
          <slot name="lastMsgDate"/>
        </div>
      </div>

    </div>

  </li>
</template>