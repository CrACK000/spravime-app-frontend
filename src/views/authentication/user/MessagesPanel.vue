<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue"
import { useMeta } from "vue-meta"
import msg from "@/plugins/messages"
import {timeSince} from "@/plugins/functions"
import {FwbInput} from "flowbite-vue"
import MessagesBox from "@/components/account/messages/MessagesBox.vue"
import Avatar from "@/components/app/Avatar.vue"
import SkeletonMessagesContainers from "@/components/skeletons/SkeletonMessagesContainers.vue"
import SkeletonMessagesContainer from "@/components/skeletons/SkeletonMessagesContainer.vue"
import ContainerMessages from "@/components/ContainerMessages.vue"
import MessagesSearchContainers from "@/components/MessagesSearchContainers.vue"
import MessagesAccounts from "@/components/MessagesAccounts.vue"
import MessagesAccountsContainer from "@/components/MessagesAccountsContainer.vue"

useMeta({ title: 'Správy' })

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)


const searchContainer = ref<string>('')
const containers = ref<MessagesContainer[]>([])
const selectedContainer = ref<string>('')
const loadContainer = ref<boolean>(false)

async function selectContainer(_id: string) {

  selectedContainer.value = _id
  await msg.selectContainer(_id)


  try {
    await msg.isRead(_id)
  } catch (e) {
    console.error(e)
  }

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

onBeforeMount(async () => {
  if (!containers.value.length){
    await msg.fetchAccounts()
    containers.value = msg.data.containers
    selectedContainer.value = containers.value[0]._id
    loadContainer.value = true
  }
})
</script>

<template>
  <ContainerMessages>
    <template #accounts>
      <MessagesSearchContainers>
        <fwb-input v-model="searchContainer" placeholder="Vyhľadávanie">
          <template #prefix>
            <svg class="w-5 h-5 text-gray-800 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
          </template>
        </fwb-input>
      </MessagesSearchContainers>
      <MessagesAccountsContainer>
        <MessagesAccounts v-if="!msg.data.containers_loading" v-for="(container, key) in containers" :key="key" @click="selectContainer(container._id)" :selected="selectedContainer === container._id">
          <template #avatar>
            <Avatar
              :img="(container.container.from.user_id._id !== user._id) ? container.container.from.user_id.avatar : container.container.to.user_id.avatar"
              :alt="(container.container.from.user_id._id !== user._id) ? (container.container.from.user_id.profile.name ?? container.container.from.user_id.username) : (container.container.to.user_id.profile.name ?? container.container.to.user_id.username)"
              :notify="(container.container.from.user_id._id !== user._id) ? (container.container.from.messages.length ? container.container.from.messages[0].new : false) : (container.container.to.messages.length ? container.container.to.messages[0].new : false)"
              size="sm"
              rounded="full"
            />
          </template>
          <template #username>{{ (container.container.from.user_id._id !== user._id) ? (container.container.from.user_id.profile.name ?? container.container.from.user_id.username) : (container.container.to.user_id.profile.name ?? container.container.to.user_id.username) }}</template>
          <template #lastMsg>{{ container.container.from.messages.length ? container.container.from.messages[0].message : container.container.to.messages[0].message }}</template>
          <template #lastMsgDate>{{ timeSince(container.container.from.messages.length ? container.container.from.messages[0].created_at : container.container.to.messages[0].created_at) }}</template>
        </MessagesAccounts>
        <skeleton-messages-containers v-else/>
      </MessagesAccountsContainer>
    </template>
    <template #messages>
      <MessagesBox v-if="loadContainer" :container-id="selectedContainer"/>
      <skeleton-messages-container v-else/>
    </template>
  </ContainerMessages>
</template>