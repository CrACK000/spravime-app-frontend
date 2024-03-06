<script setup lang="ts">
import {onBeforeMount, ref, watch} from "vue"
import { useRoute } from 'vue-router'
import offer from "@/plugins/offers"
import TitleDescriptionPanel from "@/components/offer/TitleDescriptionPanel.vue"
import CommentsPanel from "@/components/offer/CommentsPanel.vue"
import InformationPanel from "@/components/offer/InformationPanel.vue"
import SendMessagePanel from "@/components/offer/SendMessagePanel.vue"
import Container from "@/components/Container.vue"

watch(() => offer.data.offer, (newOfferValue) => {
  if (newOfferValue && newOfferValue.title) {
    document.title = newOfferValue.title
  }
}, { immediate: true })

const route = useRoute()
const id = ref<string>(String(route.params.id))

onBeforeMount(() => {
  if (offer.data.offer?._id !== id.value) {
    offer.view(id.value)
  }
})
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