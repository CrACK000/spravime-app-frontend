<script setup lang="ts">
import {watch} from "vue"
import { useRoute } from 'vue-router'
import offer from "@/plugins/offers"
import counter from "@/plugins/counter"
import TitleDescriptionPanel from "@/components/offer/TitleDescriptionPanel.vue"
import CommentsPanel from "@/components/offer/CommentsPanel.vue"
import InformationPanel from "@/components/offer/InformationPanel.vue"
import SendMessagePanel from "@/components/offer/SendMessagePanel.vue"
import Container from "@/components/Container.vue"

const route = useRoute()

watch(() => route.params.id, async (newId, oldId) => {
  await offer.view(String(newId ?? oldId))
  await counter.add('offers', String(newId ?? oldId))

  const title = offer.data.offer?.title
  document.title = `${title}`

}, { immediate: true })
</script>

<template>
  <Container>
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
      <div class="lg:w-8/12 flex flex-col gap-6 lg:gap-10">
        <title-description-panel />
        <comments-panel />
      </div>
      <div class="lg:w-4/12 flex flex-col gap-6 lg:gap-10">
        <information-panel />
        <send-message-panel />
      </div>
    </div>
  </Container>
</template>