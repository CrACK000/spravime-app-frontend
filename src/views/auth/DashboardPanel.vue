<template>

  <div class="grid grid-cols-3 gap-6 mb-6">
    <panel class="p-4 col-span-2">
      Neviem
    </panel>
    <panel class="p-4">
      Posledné prihlásenie
    </panel>
  </div>

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