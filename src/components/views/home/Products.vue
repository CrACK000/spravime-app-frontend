<script setup lang="ts">
import { onMounted, onUnmounted, ref} from "vue"
import { Swiper, SwiperSlide } from 'swiper/vue'
import {Navigation} from 'swiper/modules'
import Panel from "@/components/template/Panel.vue"
import Container from "@/components/template/Container.vue"
import Avatar from "@/components/app/Avatar.vue"
import 'swiper/scss'
import '@/assets/swiper.scss'

const slidesPerView   = ref<number>(5)
const modules         = [Navigation]

const images = [
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg',
]

const updateSlidesPerView = () => {
  if (window.innerWidth <= 375) {           // Mobile S
    slidesPerView.value = 1
  } else if (window.innerWidth <= 425) {    // Mobile L
    slidesPerView.value = 2
  } else if (window.innerWidth <= 768) {    // Tablet
    slidesPerView.value = 3
  } else if (window.innerWidth <= 1024) {   // Laptop
    slidesPerView.value = 4
  } else {                                  // Desktop
    slidesPerView.value = 5
  }
}

onMounted(() => {
  window.addEventListener('resize', updateSlidesPerView)
  updateSlidesPerView()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})
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
      <div class="max-w-7xl mx-auto">
        <swiper :slidesPerView="slidesPerView" :modules="modules" :navigation="true">
          <swiper-slide v-for="(product, key) in 8" :key="key" class="px-4">
            <Panel class="group overflow-hidden">
              <router-link :to="{ name: 'index' }">
                <div class="aspect-[4/3]">
                  <img :src="images[key]" :alt="String(key)" class="w-full h-full"/>
                </div>
                <div class="p-4">
                  <div class="mb-4 line-clamp-2">
                    Tailwind CSS Indicators - Flowbite
                  </div>
                  <div class="flex items-end justify-between gap-x-2 text-xs opacity-75 lg:group-hover:opacity-100 lg:transition">
                    <div class="truncate flex items-center gap-x-1.5">
                      <Avatar size="xxs" rounded="full"/> CrACKy Company
                    </div>
                    <div>30€</div>
                  </div>
                </div>
              </router-link>
            </Panel>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>