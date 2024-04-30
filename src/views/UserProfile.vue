<script setup lang="ts">
import user from "@/plugins/profile"
import {onMounted, watch} from "vue"
import {useRoute} from "vue-router"
import counter from "@/plugins/counter"
import Avatar from "@/components/views/profile/AvatarProfile.vue"
import Information from "@/components/views/profile/InformationProfile.vue"
import TitleProfile from "@/components/views/profile/TitleProfile.vue"
import DescriptionProfile from "@/components/views/profile/DescriptionProfile.vue"
import GalleryProfile from "@/components/views/profile/GalleryProfile.vue"
import RatingProfile from "@/components/views/profile/RatingProfile.vue"
import ReviewsProfile from "@/components/views/profile/ReviewsProfile.vue"
import Container from "@/components/template/Container.vue"

const route = useRoute()

onMounted(() => {
  watch(() => route.params.userId, async (newId, oldId) => {
    if (!newId) return

    await user.profile(String(newId ?? oldId))
    await counter.add('users', String(newId ?? oldId))

    const title = user.data.user?.profile.name ? user.data.user?.profile.name : user.data.user?.username
    document.title = `Profil užívateľa ${title}`

  }, { immediate: true })
})
</script>

<template>
  <Container>
    <div class="grid grid-cols-12 gap-0 md:gap-10 lg:gap-14">
      <div class="col-span-12 lg:col-span-8 order-2 md:order-1">

        <!-- Title Panel (desktop) -->
        <div class="hidden md:block">
          <title-profile/>
        </div>

        <!-- No INFO Panel -->
        <div class="hidden md:block" v-if="!user.data.user_loading && !user.data.user?.profile.description && !user.data.user?.gallery.length && !user.data.reviews.length">
          <div class="my-20 text-2xl font-light text-center">Žiadne ďaľšie informácie</div>
        </div>

        <!-- Description Panel -->
        <div class="mt-4 md:mt-8" v-if="!user.data.user_loading && user.data.user?.profile.description">
          <description-profile/>
        </div>

        <!-- Gallery Panel -->
        <div class="mt-8" v-if="!user.data.user_loading && user.data.user?.gallery.length">
          <gallery-profile/>
        </div>

        <!-- Reviews Panel -->
        <div class="mt-8">
          <reviews-profile/>
        </div>

      </div>
      <div class="col-span-12 lg:col-span-4 order-1 md:order-2">

        <!-- Title Panel (mobile) -->
        <div class="md:hidden mt-5 mb-10">
          <title-profile/>
        </div>

        <!-- Avatar Panel -->
        <avatar/>

        <!-- Information Panel -->
        <div class="mt-16">
          <information/>
        </div>

        <!-- Rating Panel -->
        <div class="mt-4 md:mt-10 lg:mt-16">
          <rating-profile/>
        </div>

      </div>
    </div>
  </Container>
</template>