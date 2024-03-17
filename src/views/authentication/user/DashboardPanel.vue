<script setup lang="ts">
import {useMeta} from "vue-meta"
import Panel from "@/components/Panel.vue"

useMeta({ title: 'Dashboard' })
</script>

<template>
  <div>
    <div class="grid md:grid-cols-3 gap-0.5 md:gap-6 mb-6">
      <panel class="p-4 md:col-span-2">
        Štatistika
      </panel>
      <panel class="p-4">
        Posledné prihlásenie
      </panel>
      <panel class="md:col-span-3">
        <div class="p-4 xs:p-6 md:p-10">
          Dashboard
        </div>
      </panel>
    </div>
  </div>
</template>