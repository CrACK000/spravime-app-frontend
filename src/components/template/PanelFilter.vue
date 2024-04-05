<script setup lang="ts">
import { withDefaults } from 'vue'
import Panel from "@/components/template/Panel.vue"

interface Props {
  submit: () => void,
}

withDefaults(defineProps<Props>(), {})
</script>

<template>
  <form @submit.prevent="submit">
    <panel class="p-2 md:p-4">
      <slot/>
    </panel>
  </form>
</template>