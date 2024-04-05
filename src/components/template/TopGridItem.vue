<script setup lang="ts">
import {computed} from "vue"

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

const priceMinus25WithComma = computed(() => {
  const priceMinus25 = props.price - (props.price * 0.25)
  return priceMinus25.toFixed(2).replace('.', ',')
})

const priceWithComma = computed(() => {
  return props.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })
})

</script>

<template>
  <div class="grid grid-cols-12 items-center gap-x-1 md:gap-x-4 px-2 py-3.5 md:px-4 md:py-4 text-sm md:text-base">
    <div class="col-span-5 md:col-span-6">
      {{ title }}
    </div>
    <div class="col-span-2 text-center text-blue-500 font-medium">
      {{ priceMinus25WithComma }}€
    </div>
    <div class="col-span-2 text-center">
      {{ priceWithComma }}€
    </div>
    <div class="col-span-3 md:col-span-2 text-center">
      <slot/>
    </div>
  </div>
</template>