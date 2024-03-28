<script setup lang="ts">
import {onMounted, watch} from "vue"
import { useRoute } from 'vue-router'
import request from "@/plugins/requests"
import counter from "@/plugins/counter"
import TitleDescriptionPanel from "@/components/views/request/TitleDescriptionPanel.vue"
import CommentsPanel from "@/components/views/request/CommentsPanel.vue"
import InformationPanel from "@/components/views/request/InformationPanel.vue"
import SendMessagePanel from "@/components/views/request/SendMessagePanel.vue"
import Container from "@/components/template/Container.vue"

const route = useRoute()

onMounted(() => {
  watch(() => route.params.requestId, async (newId, oldId) => {
    if (!newId) return

    await request.view(String(newId ?? oldId))
    await counter.add('requests', String(newId ?? oldId))

    const title = request.data.request?.title
    document.title = `${title}`

  }, { immediate: true })
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