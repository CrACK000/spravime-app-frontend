<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import {Swiper, SwiperSlide} from 'swiper/vue'
import Container from "@/components/template/Container.vue"
import Panel from "@/components/template/Panel.vue"
import Avatar from "@/components/app/Avatar.vue"
import Nickname from "@/components/app/Nickname.vue"

import 'swiper/scss'
import '@/assets/swiper.scss'
import {Navigation} from "swiper/modules"

const slidesPerView   = ref<number>(4)
const modules = [Navigation]

const images = [
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg',
  'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
]

const updateSlidesPerView = () => {
  if (window.innerWidth <= 375) {           // Mobile S
    slidesPerView.value = 1
  } else if (window.innerWidth <= 425) {    // Mobile L
    slidesPerView.value = 2
  } else if (window.innerWidth <= 768) {    // Tablet
    slidesPerView.value = 3
  } else if (window.innerWidth <= 1024) {   // Laptop
    slidesPerView.value = 3
  } else {                                  // Desktop
    slidesPerView.value = 4
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
  <Container>

    <div class="py-8 md:py-12">
      <div class="max-w-4xl mx-auto text-center text-2xl md:text-4xl font-medium mb-4">
        Flowbite Icons - Free and open-source SVG icons
      </div>
      <div class="flex flex-col md:flex-row justify-center items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700/40">
        <div class="px-4 py-2 flex gap-x-2 items-center text-gray-600 dark:text-gray-500 text-sm">
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path></svg>
          Sekcia asd asd asd asd asd
        </div>
        <div class="px-4 py-2 flex gap-x-2 items-center text-gray-600 dark:text-gray-500 text-sm">
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"/></svg>
          Kategoriaasd a das dad as d
        </div>
      </div>
    </div>

    <div class="grid grid-cols-6 gap-6 md:gap-12 items-start">
      <div class="col-span-6 lg:col-span-3 xl:col-span-4 flex flex-col gap-y-6">
        <div>
          <div class="mb-6 pb-2 text-xl text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700/40">
            Produkty
          </div>
          <div class="-mx-2 xs:-mx-4 md:-mx-8 lg:mx-0">
            <div class="-px-6 xs:-px-2 md:-px-4 lg:-px-4 xl:-px-4">
              <swiper :slidesPerView="slidesPerView" :modules="modules" :navigation="true" center-insufficient-slides>
                <swiper-slide v-for="(product, key) in 5" :key="key" class="px-6 xs:px-2 md:px-4 lg:px-4 xl:px-4">
                  <Panel class="group cursor-pointer overflow-hidden" @click="console.log('asd')">
                    <div class="aspect-[4/3] overflow-hidden">
                      <img :src="images[key]" :alt="String(key)" class="w-full h-full"/>
                    </div>
                    <div class="p-3 text-sm">
                      Flowbite Icons - Free asd asd
                      <div class="float-right opacity-75 font-light text-xs mt-1">
                        30€
                      </div>
                    </div>
                  </Panel>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <Panel class="p-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore<br><br> eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </Panel>
      </div>
      <div class="col-span-6 lg:col-span-3 xl:col-span-2 flex flex-col gap-y-6">
        <router-link to="/" class="group flex flex-col">
          <Panel class="z-30 overflow-hidden">
            <div class="p-3 group-hover:bg-gray-50 dark:group-hover:bg-gray-900/5 transition">
              <div class="flex items-center gap-x-4">
                <Avatar rounded="full" size="sm"/>
                <Nickname nickname="CrACK Company s.r.o" class="lg:text-lg font-medium" :verify="true"/>
              </div>
            </div>
          </Panel>
          <div class="z-20 bg-gray-100 border border-gray-200 dark:border-gray-800 dark:bg-gray-850 shadow-md rounded-b-xl pt-8 -mt-6 mx-1">
            <div class="px-4 py-1 pb-2 text-sm">
              <div class="flex gap-x-3 items-center">
                <div class="text-gray-700 dark:text-gray-500">Recenzie</div>
                <div class="ms-auto flex items-center gap-x-6 sm:gap-x-10">
                  <div class="font-bold text-base text-gray-600 dark:text-gray-400 flex items-center gap-x-2">
                    <i class="fa-solid fa-globe text-sm"></i>
                    123
                  </div>
                  <div class="font-bold text-base text-green-500 dark:text-green-400 flex items-center gap-x-2">
                    <i class="fa-regular fa-thumbs-up text-sm"></i>
                    12
                  </div>
                  <div class="font-bold text-base text-red-500 flex items-center gap-x-2">
                    <i class="fa-regular fa-thumbs-down text-sm"></i>
                    0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
        <button type="button">
          <Panel class="group overflow-hidden">
            <div class="p-4 bg-green-500/75 dark:bg-green-500/20 group-hover:bg-green-500/60 dark:group-hover:bg-green-500/25 transition">
              <div class="flex gap-x-2 justify-center text-white dark:text-green-400 font-medium">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                </svg>
                Mám záujem
              </div>
            </div>
          </Panel>
        </button>
        <Panel divide="y" class="overflow-hidden">
          <div class="py-5 px-6 flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <div class="w-6">
                <i class="fa-regular fa-envelope fa-lg text-red-500 dark:text-green-400"></i>
              </div>
              Poslať mail
            </div>
            <a href="#" class="link text-sm">patrikfejfar@gmail.com</a>
          </div>
          <div class="py-5 px-6 flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <div class="w-6">
                <i class="fa-brands fa-square-facebook fa-lg text-blue-600 dark:text-blue-500"></i>
              </div>
              Facebook
            </div>
            <a href="#" class="link text-sm">cracky4200</a>
          </div>
          <div class="py-5 px-6 flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <div class="w-6">
                <i class="fa-brands fa-instagram fa-lg text-fuchsia-600 dark:text-orange-400"></i>
              </div>
              Instagram
            </div>
            <a href="#" class="link text-sm">patrik.fejfar</a>
          </div>
          <div class="py-5 px-6 flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <div class="w-6">
                <i class="fa-brands fa-tiktok fa-lg text-black dark:text-cyan-100"></i>
              </div>
              TikTok
            </div>
            <a href="#" class="link text-sm">@cracky0000</a>
          </div>
          <div class="py-5 px-6 flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <div class="w-6">
                <i class="fa-brands fa-linkedin fa-lg text-blue-700"></i>
              </div>
              Linkedin
            </div>
            <a href="#" class="link text-sm">patrikfekfar</a>
          </div>
        </Panel>
      </div>
    </div>
  </Container>
</template>