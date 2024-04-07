<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
</script>

<template>
  <Panel class="inline-block mx-auto">
    <div class="flex items-center justify-between">
      <slot/>
    </div>
  </Panel>
</template>