<script setup lang="ts">
import {useMeta} from "vue-meta"
import AccountPanelHead from "@/components/template/AccountPanelHead.vue"
import Panel from "@/components/template/Panel.vue"
import {FwbDropdown} from "flowbite-vue";

useMeta({ title: 'Moje ponuky' })
</script>

<template>
  <div>

    <AccountPanelHead>
      Moje ponuky
      <template #right>
        <router-link :to="{ name: 'create-offer' }" class="form-button-sm">
          Vytvoriť novú
        </router-link>
      </template>
    </AccountPanelHead>

    <div class="grid grid-cols-3 gap-6">
      <Panel>
        <div class="p-4 hover:bg-white dark:hover:bg-gray-900/5 md:rounded-2xl">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="font-medium text-gray-900 dark:text-gray-300">Flowbite Icons - Free and open-source SVG icons</div>
            <div>
              <fwb-dropdown placement="left">
                <template #trigger>
                  <button type="button" class="bg-white dark:bg-gray-800 dark:hover:bg-gray-700/50 hover:bg-gray-100 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400 rounded-lg p-2">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                    </svg>
                  </button>
                </template>
                <div class="z-10 bg-white divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow dark:bg-gray-700 overflow-hidden">
                  <ul class="text-gray-700 dark:text-gray-200">
                    <li>
                      <button type="button" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Upraviť
                      </button>
                    </li>
                    <li>
                      <button type="button" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        Topovať
                      </button>
                    </li>
                    <li>
                      <button type="button" class="block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500">
                        Odstrániť
                      </button>
                    </li>
                  </ul>
                </div>
              </fwb-dropdown>
            </div>
          </div>
          <div class="flex items-center gap-x-2 text-sm opacity-75 font-medium mb-1">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
            </svg>
            Sekcia
          </div>
          <div class="flex items-center gap-x-2 text-sm opacity-75 font-medium mb-4">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"/>
            </svg>
            Kategória
          </div>
          <div class="grid grid-cols-6 gap-x-2">
            <div v-for="product in 6" class="aspect-[4/3]">
              <img src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="Produkt #1" class="rounded-md"/>
            </div>
          </div>
        </div>
      </Panel>
    </div>

  </div>
</template>