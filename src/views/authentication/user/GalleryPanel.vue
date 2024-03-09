<script setup lang="ts">
import {useMeta} from "vue-meta"
import PanelGrid from "@/components/PanelGrid.vue"
import AvatarContainer from "@/components/account/gallery/AvatarContainer.vue"
import GalleryContainer from "@/components/account/gallery/GalleryContainer.vue"

useMeta({ title: 'Galéria' })
</script>

<template>
  <panel-grid>
    <AvatarContainer/>
    <GalleryContainer/>
  </panel-grid>
</template>