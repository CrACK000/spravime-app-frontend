<script setup lang="ts">
import { withDefaults } from 'vue'
import Panel from "@/components/template/Panel.vue"

interface Props {
  submit: () => void,
  keyup: (e: KeyboardEvent) => void
}

withDefaults(defineProps<Props>(), {
  keyup: () => {}
})
</script>

<template>
  <form @submit.prevent="submit" @keyup="keyup">
    <panel class="p-4">
      <slot/>
    </panel>
  </form>
</template>