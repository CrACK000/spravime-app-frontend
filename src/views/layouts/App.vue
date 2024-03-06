<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/views/layouts/Navbar.vue";
import Toast from 'primevue/toast';
import Footer from "@/views/layouts/Footer.vue";
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} - spravi.me</template>
  </metainfo>
  <Navbar />
  <RouterView class="mb-20" v-slot="{ Component, route }">
    <transition :name="String(route.meta.transition)">
      <component :is="Component"/>
    </transition>
  </RouterView>
  <Toast position="bottom-right" group="br" />
  <Footer/>
</template>
