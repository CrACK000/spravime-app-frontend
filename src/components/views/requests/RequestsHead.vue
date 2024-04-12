<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="p-4 flex justify-between items-center">
    <div class="font-medium uppercase">
      Výsledky vyhľadávania
    </div>
    <div class="text-sm">
      <small>Počet: </small>
      <span class="font-medium" v-text="count"></span>
    </div>
  </div>
</template>