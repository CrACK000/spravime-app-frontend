<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/views/layouts/Navbar.vue"
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import DynamicDialog from "primevue/dynamicdialog"
import Footer from "@/views/layouts/Footer.vue"
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content }} - spravi.me</template>
  </metainfo>
  <Navbar />
  <RouterView class="mb-20" v-slot="{ Component }">
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      mode="out-in"
    >
      <KeepAlive include="WorkersList, RequestsList">
        <component :is="Component"/>
      </KeepAlive>
    </transition>
  </RouterView>
  <DynamicDialog />
  <ConfirmDialog></ConfirmDialog>
  <Toast position="bottom-right" class="w-full md:w-[380px] -me-[20px] md:-me-0" group="br" />
  <Footer/>
</template>
