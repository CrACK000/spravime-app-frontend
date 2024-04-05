<script setup lang="ts">
defineProps({
  small: Boolean
})
</script>

<template>
  <div class="w-full px-2 xs:px-4 md:px-0 md:w-11/12 lg:w-10/12 mx-auto" :class="[ small ? 'xl:w-6/12' : 'xl:w-9/12 2xl:w-9/12' ]">
    <slot/>
  </div>
</template>