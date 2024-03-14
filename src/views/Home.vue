<script setup lang="ts">
import {useMeta} from 'vue-meta'
import Container from "@/components/Container.vue"
import Banner from "@/components/home/Banner.vue"
import Stats from "@/components/home/Stats.vue"
import LatestOffers from "@/components/home/LatestOffers.vue"
import TopProfiles from "@/components/home/TopProfiles.vue"
import Rating from "@/components/home/Rating.vue"

useMeta({ title: 'Nestrácajte čas s hľadaním' })
</script>

<template>
  <Container>
    <div class="grid grid-cols-11 items-center md:gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12 lg:gap-y-20 xl:gap-y-44 my-10">
      <div class="col-span-11">
        <Banner/>
      </div>
      <div class="col-span-11">
        <Stats/>
      </div>
      <div class="col-span-11 md:col-span-7">
        <Rating/>
      </div>
      <div class="col-span-11 md:col-span-4">
        <TopProfiles/>
      </div>
      <div class="col-span-11">
        <LatestOffers/>
      </div>
    </div>
  </Container>
</template>