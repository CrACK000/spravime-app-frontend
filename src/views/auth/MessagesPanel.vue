<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue"
import { useMeta } from "vue-meta"
import axios from "axios"
import {timeSince} from "@/plugins/functions"
import MessagesComponent from "@/views/auth/messages/MessagesComponent.vue"
import Panel from "@/components/Panel.vue"
import Avatar from "@/components/app/Avatar.vue"
import SkeletonMessagesContainers from "@/components/skeletons/SkeletonMessagesContainers.vue"

useMeta({ title: 'Správy' })

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)


const searchContainer = ref<string>('')
const containers = ref<MessagesContainer[]>([])
const selectedContainer = ref<string>('')
const loadingContainers = ref<boolean>(false)
const loadContainer = ref<boolean>(false)

function fetchAccounts() {

  loadingContainers.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/messages/accounts`, {}, { withCredentials: true })
    .then(response => {
      containers.value = response.data
      selectedContainer.value = containers.value[0]._id
      loadContainer.value = true
    })
    .finally(() => {
      loadingContainers.value = false
    })
}

function selectContainer(_id: string) {

  selectedContainer.value = _id
  isRead(_id);

  ["accounts", "messages"].forEach(id => {
    const element = document.getElementById(id)
    if (!element) return
    if (id === "accounts") {
      element.classList.add('hidden', 'md:block')
    } else if (id === "messages") {
      element.classList.remove('hidden', 'md:block')
    }
  })
}

function isRead(container: string) {

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/messages/read`, { container: container }, { withCredentials: true })

}

onBeforeMount(() => {
  fetchAccounts()
})
</script>

<template>
  <panel class="relative h-[680px] overflow-hidden">
    <div class="flex items-start w-full h-full">
      <div id="accounts" class="w-full md:w-4/12 h-[680px] bg-gray-300/40 dark:bg-gray-700/20 shadow-xl">
        <div class="p-4">
          <div class="relative z-0">
            <input type="search" id="search" v-model="searchContainer" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label for="search" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Vyhľadať</label>
          </div>
        </div>
        <ul class="flex flex-col gap-2 max-h-full overflow-y-auto overflow-x-hidden w-full p-2">

          <li v-for="(container, key) in containers"
              class="relative hover:bg-gray-300/70 hover:dark:bg-gray-700/50 flex items-center gap-4 p-2 rounded-md w-full cursor-pointer transition duration-100"
              :class="[selectedContainer === container._id ? 'bg-gray-300/70 dark:bg-gray-700/75 hover:dark:bg-gray-600/75' : '']"
              @click="selectContainer(container._id)"
              v-if="!loadingContainers"
              :key="key"
          >

            <Avatar v-if="container.from._id !== user._id" :img="container.from.avatar" :alt="container.from.profile.name ?? container.from.username" :notify="container.container.from.length ? container.container.from[0].new : false" size="sm" rounded="full"/>
            <Avatar v-else :img="container.to.avatar" :alt="container.to.profile.name ?? container.to.username" :notify="container.container.to.length ? container.container.to[0].new : false" size="sm" rounded="full"/>

            <div class="w-full flex flex-col">

              <div v-if="container.from._id !== user._id" class="truncate">{{ container.from.profile.name ?? container.from.username }}</div>
              <div v-else class="truncate">{{ container.to.profile.name ?? container.to.username }}</div>

              <div class="mt-auto text-xs opacity-75">
                <div class="max-w-full line-clamp-2">{{ container.container.from.length ? container.container.from[0].message : container.container.to[0].message }}</div>
                <div class="w-full text-[11px] text-end text-gray-500 font-semibold">{{ timeSince(container.container.from.length ? container.container.from[0].created_at : container.container.to[0].created_at) }}</div>
              </div>

            </div>

          </li>

          <skeleton-messages-containers v-else/>

        </ul>
      </div>
      <div id="messages" class="w-full md:w-8/12 h-[680px] overlay-chat md:block hidden">
        <messages-component v-if="loadContainer" :container-id="selectedContainer" :loading-panel="loadingContainers"/>
      </div>
    </div>
  </panel>
</template>