<script setup lang="ts">
import type {PropType} from "vue"

defineProps({
  label: String,
  labelKey: { type: String, required: true },
  error: String,
  modelValue: { type: [String, Number] },
  placeholder: String,
  placeholderValue: { type: [String, Number] as PropType<String | Number> },
  data: Array as () => Array<{ value: string | number; name: string }>,
  info: String,
  classText: String
})
</script>

<template>
  <div>

    <label class="mb-1 block" :for="labelKey">{{ label }}</label>

    <select
      :class="[ error ? 'input-danger' : 'input', classText]"
      :id="labelKey"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">

      <option v-if="placeholder" :value="placeholderValue" disabled>{{ placeholder }}</option>
      <option v-if="data" v-for="item in data" :value="item.value">{{ item.name }}</option>

      <slot v-if="!data" name="data"/>

    </select>

    <div v-if="info?.length" class="text-sm mt-2 flex items-center gap-1.5">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.6-8.5h0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
      </svg>
      {{ info }}
    </div>

    <div class="text-red-500 text-sm mt-2" v-if="error" v-text="error"></div>

  </div>
</template>