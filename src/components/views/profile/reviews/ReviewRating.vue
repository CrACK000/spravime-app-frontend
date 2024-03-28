<script setup lang="ts">
defineProps({
  rating: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div>
    Hodnotenie
    <span class="text-blue-500"><i v-for="x in 5" class="fa-star" :class="[ rating >= x ? 'fa-solid' : 'fa-regular' ]"></i></span>
  </div>
</template>