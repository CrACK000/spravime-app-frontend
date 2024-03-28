<script setup lang="ts">
import {computed, ref} from "vue"
import user from "@/plugins/profile"
import SkeletonProfileGallery from "@/components/skeletons/SkeletonProfileGallery.vue";

const gallery = ref<Gallery[]>(Object(user.data.user?.gallery))
const activeIndex = ref<any>(0)
const showModal = ref<boolean>(false)
const backend = import.meta.env.VITE_BACKEND

const showRight = ref<boolean>(true)
const showLeft = ref<boolean>(false)
const overlayLeft = ref<any>(0)
const overlayRight = ref<any>(0)
const scrollable = ref<null | HTMLDivElement>(null)
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
const checkScroll = (event?: any) => {
  const { scrollWidth, scrollLeft, clientWidth } = event.target

  showLeft.value = scrollLeft > 0
  showRight.value = scrollLeft + clientWidth < scrollWidth
  overlayLeft.value = scrollLeft
  overlayRight.value = scrollWidth - (scrollLeft + clientWidth)
}
const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (scrollable.value) {
    scrollable.value.scrollLeft += e.deltaY / 3
  }
}

</script>

<template>

  <template v-if="!user.data.user_loading">
    <div class="text-xl font-light mb-4 px-4 md:px-0">
      {{ user.data.user?.profile.type === 'company' ? 'Naša práca' : 'Moja práca' }}
    </div>
    <div class="relative flex flex-row flex-nowrap gap-4 overflow-x-auto hide-scrollbar p-3 md:rounded-lg bg-black/10" ref="scrollable" @scroll="checkScroll" @wheel="onWheel">
      <div v-for="(image, index) in gallery" :key="index" @click="openModalGallery(index)" class="w-[200px] cursor-pointer opacity-75 hover:opacity-100 transition duration-200">
        <div class="w-[200px] h-32 overflow-hidden rounded">
          <img :src="`${backend}/cloud/galleries/${image.path}`" :alt="image.description ?? ''" class="w-full">
        </div>
      </div>
      <!-- Overlays -->
      <div :style="{ left: `${overlayLeft}px`, right: `${overlayRight}px`}" class="absolute flex justify-between top-0 bottom-0 w-full pointer-events-none">
        <!-- Left edge overlay -->
        <div :class="{ 'opacity-0': !showLeft }"
             class="w-32 bg-gradient-to-r from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
        <!-- Right edge overlay -->
        <div :class="{ 'opacity-0': !showRight }"
             class="w-32 bg-gradient-to-l from-gray-300 dark:from-gray-900/75 via-transparent transition-opacity duration-300">
        </div>
      </div>
    </div>
    <!-- Modálne okno galérie -->
    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-gallery" role="dialog" aria-modal="true" v-if="showModal">

        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">

          <div class="fixed inset-0 bg-white/20 dark:bg-black/30 backdrop-blur transition-opacity" @click="closeModalGallery"></div>

          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle w-full md:w-11/12 lg:w-9/12">
            <div class="p-4">
              <img :src="`${backend}/cloud/galleries/${activeImage.path}`" :alt="activeImage.description ?? ''" class="w-full object-cover">
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