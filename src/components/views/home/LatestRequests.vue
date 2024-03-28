<script setup lang="ts">
import {onBeforeMount, ref} from "vue"
import request from "@/plugins/requests"
import {timeSince} from "@/plugins/functions"
import SkeletonRequests from "@/components/skeletons/SkeletonRequests.vue"
import RequestStatus from "@/components/app/RequestStatus.vue"
import Panel from "@/components/template/Panel.vue"

const requests = ref<Request[]>(request.data.requests)

onBeforeMount(async () => {
  if (!requests.value.length) {
    await request.all()
    requests.value = request.data.requests
  }
})
</script>

<template>
  <div class="lg:w-11/12 mx-auto">
    <div class="text-2xl font-medium mb-6 px-4 md:px-0 text-center">Najnovšie požiadavky</div>

    <panel divide="y" class="overflow-hidden text-lg">

      <!-- Loading Panel Requests -->
      <skeleton-requests :rows="6" v-if="request.data.requests_loading" />

      <template v-for="request in  requests.slice(0, 6)">
        <router-link :to="{ name: 'request', params: { requestId: request._id } }" v-if="request.status">
          <div class="panel-item py-4 px-4 flex gap-3 items-center">
            <div>
              <RequestStatus :status="request.status" />
            </div>
            <div>
              {{ request.title }} <i class="fa-solid fa-grip-lines-vertical mx-2 opacity-30"></i> <span class="text-sm">{{ request.address }}</span>
            </div>
            <div class="ms-auto text-sm opacity-50">
              {{ timeSince(request.created_at) }}
            </div>
          </div>
        </router-link>
      </template>

    </panel>

    <div class="font-medium text-sm mt-6 px-4 md:px-0">
      <router-link :to="{ name: 'requests' }" class="link flex items-center gap-1.5 justify-center">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1h3m0 3h6m-3 5h3m-6 0h0m3 4h3m-6 0h0m1-13v4h4V3h-4Z"/>
        </svg>
        Zobraziť všetky
      </router-link>
    </div>

  </div>
</template>