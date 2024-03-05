<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import SkeletonOfferComments from "@/components/skeletons/SkeletonOfferComments.vue";
</script>

<template>
  <transition name="fade">

    <panel divide="y" class="rework-element overflow-hidden" v-if="true">
      <div class="py-4 px-6 font-medium uppercase">
        Komentáre k požiadavke
      </div>
      <div class="p-6">
        Komentáre
      </div>
    </panel>

    <!-- Loading panel Comments -->
    <skeleton-offer-comments v-else />

  </transition>
</template>

<style scoped>

</style>