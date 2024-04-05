<script setup lang="ts">
import {useMeta} from 'vue-meta'
import Container from "@/components/template/Container.vue"
import Banner from "@/components/views/home/Banner.vue"
import Stats from "@/components/views/home/Stats.vue"
import Requests from "@/components/views/home/Requests.vue"
import Products from "@/components/views/home/Products.vue"
import AdPlus from "@/components/views/home/AdPlus.vue"
import AdRating from "@/components/views/home/AdRating.vue"
import AdOffers from "@/components/views/home/AdOffers.vue"

useMeta({ title: 'Nestrácajte čas s hľadaním' })
</script>

<template>
  <div class="sp-bg">
    <Banner/>
    <Requests/>
    <Products/>
    <Stats/>

    <Container>
      <div class="grid xl:grid-cols-3 gap-10 mt-32">
        <AdRating/>
        <AdPlus/>
        <AdOffers/>
      </div>
    </Container>
  </div>
</template>