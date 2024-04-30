<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue"
import user from "@/plugins/profile"
import {Swiper, SwiperSlide} from 'swiper/vue'
import SkeletonProfileGallery from "@/components/skeletons/SkeletonProfileGallery.vue"
import Panel from "@/components/template/Panel.vue"

import 'swiper/scss'
import '@/assets/swiper.scss'
import {Navigation} from "swiper/modules"

const slidesPerView   = ref<number>(4)
const modules = [Navigation]

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

const gallery = ref<Gallery[]>(Object(user.data.user?.gallery))
const activeIndex = ref<any>(0)
const showModal = ref<boolean>(false)
const backend = import.meta.env.VITE_BACKEND
const activeImage = computed(() => gallery.value[activeIndex.value])

const openModalGallery = (index?: any) => {
  activeIndex.value = index
  showModal.value = true
}
const closeModalGallery = () => {
  showModal.value = false
}
const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % gallery.value.length
}
const prevImage = () => {
  activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length
}
</script>

<template>

  <template v-if="!user.data.user_loading">
    <div class="text-xl font-light mb-4 px-4 md:px-0">
      {{ user.data.user?.profile.type === 'company' ? 'Naša práca' : 'Moja práca' }}
    </div>
    <div class="-mx-2 xs:-mx-4 md:-mx-8 lg:mx-0">
      <div class="py-6 xs:py-2 md:py-4 lg:py-4 xl:py-4 lg:px-1 overflow-hidden">
        <swiper :slidesPerView="slidesPerView" :modules="modules" :navigation="true">
          <swiper-slide v-for="(image, index) in gallery" :key="index" class="px-6 xs:px-2 md:px-4 lg:px-4 xl:px-3">
            <div class="group aspect-[4/3] rounded-xl relative overflow-hidden cursor-pointer" @click="console.log('asd')">
              <img :src="`${backend}/cloud/${image.path}`" :alt="image.description ?? ''" class="w-full h-full"/>
              <div @click="openModalGallery(index)" class="absolute top-0 w-full h-full flex items-center justify-center bg-white/25 dark:bg-black/25 backdrop-blur-sm opacity-0 group-hover:opacity-100 rounded-2xl transition">
                <div class="text-center text-black dark:text-white">
                  <svg class="w-8 h-8 mb-2 mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <!-- Modálne okno galérie -->
    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <div class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="showModal">

        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">

          <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalGallery"></div>

          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full md:w-11/12 lg:w-9/12">
            <div class="p-4">
              <img :src="`${backend}/cloud/${activeImage.path}`" :alt="activeImage.description ?? ''" class="w-full object-cover">
            </div>

            <div class="bg-gray-100 dark:bg-gray-900/40 flex items-center justify-between py-2 px-3">
              <button @click="closeModalGallery" class="form-secondary-button-sm"><i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť</button>
              <div class="flex gap-2">
                <button @click="prevImage" class="form-secondary-button-sm"><i class="fa-solid fa-arrow-left"></i></button>
                <button @click="nextImage" class="form-secondary-button-sm"><i class="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>

  <skeleton-profile-gallery v-else/>

</template>