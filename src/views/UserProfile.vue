<script setup lang="ts">
import user from "@/plugins/profile"
import {onBeforeMount, ref, watch} from "vue"
import {useRoute} from "vue-router"
import Avatar from "@/components/profile/AvatarProfile.vue"
import Information from "@/components/profile/InformationProfile.vue"
import TitleProfile from "@/components/profile/TitleProfile.vue"
import DescriptionProfile from "@/components/profile/DescriptionProfile.vue"
import GalleryProfile from "@/components/profile/GalleryProfile.vue"

watch(() => user.data.user, (profileTitleValue) => {
  if (profileTitleValue && profileTitleValue.username) {
    let title = profileTitleValue.profile.name ? profileTitleValue.profile.name : profileTitleValue.username
    document.title = `Profil užívateľa ${title}`
  }
}, { immediate: true })

const route = useRoute()
const id = ref<string>(String(route.params.id))

onBeforeMount(() => {
  if (user.data.user?._id !== id.value) {
    user.profile(id.value)
    user.profileReviews(id.value)
  }
})
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="grid grid-cols-12 gap-0 md:gap-10 lg:gap-14">
      <div class="col-span-12 md:col-span-8 order-2 md:order-1">

        <!-- Title Panel (desktop) -->
        <div class="hidden md:block">
          <title-profile/>
        </div>

        <!-- No INFO Panel -->
        <div class="hidden md:block" v-if="!user.data.user_loading && !user.data.user?.profile.description && !user.data.user?.gallery.length && !user.data.reviews.length">
          <div class="my-8 text-2xl font-light text-center">Žiadne informácie</div>
        </div>

        <!-- Description Panel -->
        <div class="mt-0.5 md:mt-8" v-if="user.data.user_loading || user.data.user?.profile.description">
          <description-profile/>
        </div>

        <!-- Gallery Panel -->
        <div class="mt-8" v-if="user.data.user_loading && user.data.user?.gallery.length">
          <gallery-profile/>
        </div>

        <!-- Reviews Panel -->
        <!--<transition name="fade">
          <div class="mt-8" v-if="!user.data.reviews_loading && user.data.reviews.length">
            <reviews-profile/>
          </div>
          <div class="mt-8" v-else-if="user.data.reviews_loading">
            <skeleton-profile-reviews/>
          </div>
        </transition>-->

      </div>
      <div class="col-span-12 md:col-span-4 order-1 md:order-2">

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
        <!--<transition name="fade">
          <div class="mt-0.5 md:mt-10 lg:mt-16" v-if="!user.data.reviews_loading && user.data.reviews.length">
            <rating-profile/>
          </div>
          <div class="mt-0.5 md:mt-10 lg:mt-16" v-else-if="user.data.reviews_loading">
            <skeleton-profile-rating/>
          </div>
        </transition>-->

      </div>
    </div>
  </div>
</template>