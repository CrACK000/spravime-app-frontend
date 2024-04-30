<script setup lang="ts">
import {ref} from "vue"
import Container from "@/components/template/Container.vue"
import Panel from "@/components/template/Panel.vue"
import categoriesData from "@/plugins/data/categories.json"

const sections = ref<Sections[]>(categoriesData.sections)

const offers = ref([
  {
    _id: '123asda',
    title: 'Flowbite Icons - Free and open-source SVG icons',
    section: 12,
    products: [],
    top: false
  },
  {
    _id: '123asdb',
    title: 'Flowbite Icons - Free and open-source SVG icons',
    section: 12,
    products: [
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg'
      }
    ] as Product[],
    top: true
  },
  {
    _id: '123asdc',
    title: 'Flowbite Icons - Free and open-source SVG icons',
    section: 22,
    products: [
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg'
      },
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg'
      },
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg'
      },
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg'
      },
      {
        title: 'title product',
        description: 'desc products',
        price: '30',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg'
      }
    ] as Product[],
    top: true
  }
])
</script>

<template>
  <Container>

    <div class="max-w-2xl mx-auto mb-6 md:mb-20">
      <div class="relative">
        <input type="search" class="bg-white dark:bg-gray-800 border-none ring-1 ring-gray-300 dark:ring-gray-700 hover:ring-2 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600 rounded-xl py-4 px-6 w-full transition" placeholder="Hľadáte ?"/>
        <button class="absolute top-1/2 -translate-y-1/2 right-3 bg-blue-600 text-white p-2 rounded-lg">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          </svg>
        </button>
      </div>
      <div class="text-center mt-4">
        <select class="bg-transparent focus:bg-white dark:focus:bg-gray-850 w-full md:w-auto border-none ring-gray-300 dark:ring-gray-700 hover:ring-2 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-600 rounded-xl transition">
          <option :value="0" selected>Vybrať sekciu</option>
          <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
        </select>
      </div>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
      <router-link v-for="offer in offers" :to="{ name: 'offer', params: { offerId: offer._id } }">
        <Panel class="group overflow-hidden lg:scale-100 lg:hover:scale-105 lg:transition">
          <div class="p-4 flex flex-col gap-y-4 hover:bg-white dark:hover:bg-gray-900/5">
            <div class="font-medium text-lg leading-6">
              <svg v-if="offer.top" class="w-5 h-5 text-blue-600 inline -mt-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/>
              </svg>
              {{ offer.title }}
            </div>
            <div class="flex gap-x-1 items-center text-sm opacity-75">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path></svg>
              {{ sections[offer.section].title }}
            </div>
            <div class="flex gap-x-3 lg:gap-x-4 items-center">
              <div v-if="offer.products.length" class="grid grid-cols-4 gap-x-3 lg:gap-x-4">
                <div v-for="product in offer.products.slice(0,4)" class="aspect-[4/3]" v-tooltip.top="product.title">
                  <img :src="product.image" class="rounded-md lg:rounded-xl inset-full lg:scale-100 lg:hover:scale-110 lg:transition" :alt="product.title"/>
                </div>
              </div>
              <div class="ms-auto rounded-md bg-gray-100 dark:bg-gray-850 flex items-center justify-center">
                <div class="text-xs font-semibold text-center px-1 flex items-center py-2 xs:py-2.5 md:py-1.5 lg:py-3" :class="[ offer.top ? 'text-blue-500' : 'dark:text-gray-400' ]">
                  <div class="whitespace-nowrap ps-1.5 hidden md:block">
                    Zobraziť viac
                  </div>
                  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </router-link>
    </div>
  </Container>
</template>