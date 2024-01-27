<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} - spravi.me</template>
  </metainfo>
  <Navbar />
  <RouterView class="mb-20" />
  <Toast position="bottom-right" group="br" />
  <Footer/>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/views/layouts/Navbar.vue";
import Toast from 'primevue/toast';
import Footer from "@/views/layouts/Footer.vue";
</script>
