<script setup lang="ts">
import Panel from "@/components/template/Panel.vue"
import Container from "@/components/template/Container.vue"

const images = [
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg',
]
</script>

<template>
  <div class="mb-44">
    <div class="w-full flex items-center justify-center">
      <div class="p-4 bg-green-200 dark:bg-green-900 border-2 border-green-400 dark:border-green-500 text-green-400 dark:text-green-500 rounded-full -mt-8 z-10">
        <svg class="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
        </svg>
      </div>
    </div>
    <div class="mt-14">
      <div class="text-green-500 text-lg font-medium mb-3 md:mb-6 text-center">
        To najlepšie z ponúk
      </div>
      <div class="text-black dark:text-gray-200 text-2xl md:text-4xl font-semibold mb-6 text-center">
        Produkty
      </div>
      <div class="bg-green-500 w-32 h-[1px] mx-auto mb-6"></div>
      <div class="px-5 text-gray-600 dark:text-gray-400 mb-16 text-center">
        Naši overený členovia môžu k svojim ponukám pridať rôzne produkty a prezentovať ich prácu.
      </div>
      <Container class="pt-8 md:pt-16 lg:pt-24">
        <div class="-mx-4 lg:-mx-8">
          <div class="flex gap-x-6 overflow-x-auto hide-scrollbar snap-x pt-24 pb-4 px-6 scroll-px-6">
            <Panel v-for="(product, key) in 8" :key="key" class="group snap-center lg:snap-start lg:scale-100 lg:hover:scale-105 lg:transition">
              <router-link :to="{ name: 'index' }">
                <div class="px-6 pb-4">
                  <div class="-mt-20 aspect-[4/3] w-44 lg:w-56 mb-4">
                    <img :src="images[key]" :alt="String(key)" class="rounded-3xl max-w-full max-h-full lg:scale-100 lg:group-hover:scale-105 lg:transition"/>
                  </div>
                  <div class="mb-4 line-clamp-2">
                    Tailwind CSS Indicators - Flowbite
                  </div>
                  <div class="flex items-end justify-between gap-x-2 text-xs opacity-75 lg:group-hover:opacity-100 lg:transition">
                    <div class="truncate">
                      <i class="fa-regular fa-user"></i> CrACKy Company
                    </div>
                    <div>30€</div>
                  </div>
                </div>
              </router-link>
            </Panel>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>