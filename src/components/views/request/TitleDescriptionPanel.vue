<script setup lang="ts">
import {nl2br} from "@/plugins/functions"
import request from "@/plugins/requests"
import Panel from "@/components/template/Panel.vue"
import SkeletonRequestTitleDescription from "@/components/skeletons/SkeletonRequestTitleDescription.vue"
</script>

<template>
  <transition name="fade">

    <div v-if="!request.data.request_loading">
      <div class="py-4 px-6 font-medium uppercase text-2xl">
        <div v-text="request.data.request?.title"></div>
      </div>
      <panel class="p-4 md:p-6">
        <div v-html="nl2br(request.data.request?.description)"></div>
      </panel>
    </div>

    <!-- Loading panel Title&Desc -->
    <skeleton-request-title-description v-else />

  </transition>
</template>