<script setup lang="ts">
import {ref} from "vue"
import categoriesData from "@/plugins/data/categories.json"
import Panel from "@/components/template/Panel.vue"
import Status from "@/components/app/RequestStatus.vue"
import Avatar from "@/components/app/Avatar.vue"

defineProps({
  requests: {
    type: Array as () => Request[],
    required: true
  }
})

const sections = ref<Sections[]>(categoriesData.sections)
</script>

<template>
  <panel class="overflow-hidden lg:scale-100 lg:hover:scale-105 lg:transition" v-for="request in requests">
    <router-link :to="{ name: 'request', params: { requestId: request._id } }">
      <div class="p-5 transition group" :class="[ request.top ? 'bg-blue-500/20 dark:bg-blue-500/10 hover:bg-blue-500/25 dark:hover:bg-blue-600/10' : 'hover:bg-white dark:hover:bg-gray-900/5' ]">
        <div class="flex flex-wrap gap-3 items-center mb-2">
          <div class="md:text-lg font-medium" :class="{ 'line-through': !request.status }">
            {{ request.title }} <Status :status="Boolean(request.status)" class="inline-block align-middle ms-1.5"/>
          </div>
        </div>
        <div class="opacity-75 group-hover:opacity-100 flex flex-wrap items-center gap-x-6 gap-y-2 transition">
          <div class="flex items-center gap-x-1.5 text-xs font-medium w-36">
            <Avatar :img="request.author.avatar" size="xxs" rounded="full"/>
            <div class="truncate">
              {{ request.author.profile.name ?? request.author.username }}
            </div>
          </div>
          <div class="flex items-center gap-x-1 text-xs font-medium">
            <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11H4m15.5 5a.5.5 0 0 0 .5-.5V8a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44l-1.436-2.12a1 1 0 0 0-.828-.44H8a1 1 0 0 0-1 1M4 9v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44L9.985 8.44A1 1 0 0 0 9.157 8H5a1 1 0 0 0-1 1Z"/></svg>
            {{ sections[request.section].title }}
          </div>
          <div class="lg:ms-auto flex items-center gap-x-1 text-sm">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 14h0a7 7 0 1 0-11.5 0h0l.1.3.3.3L12 21l5.1-6.2.6-.7.1-.2Z"/>
            </svg>
            {{ request.address }}
          </div>
        </div>
      </div>
    </router-link>
  </panel>
</template>