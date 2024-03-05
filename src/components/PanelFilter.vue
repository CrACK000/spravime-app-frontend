<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import Panel from "@/components/Panel.vue"

interface Props {
  submit: () => void,
  keyup: (e: KeyboardEvent) => void
}

const props = withDefaults(defineProps<Props>(), {
  keyup: () => {}
})
</script>

<template>
  <form @submit.prevent="submit" @keyup="keyup">
    <panel divide="y">
      <div class="px-6 py-4 font-medium uppercase">
        Filter
      </div>
      <div class="p-6 flex flex-col gap-6">
        <slot/>
      </div>
    </panel>
  </form>
</template>