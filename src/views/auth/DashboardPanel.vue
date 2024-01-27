<template>
  <panel>
    <div class="p-4 xs:p-6 md:p-10">
      Dashboard
    </div>
  </panel>
</template>

<script setup lang="ts">
import {useMeta} from "vue-meta";
import Panel from "@/components/Panel.vue";

useMeta({ title: 'Dashboard' })
</script>