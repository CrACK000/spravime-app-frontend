<script setup lang="ts">
import profile from "@/plugins/profile";
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import Avatar from "@/components/user-profile/AvatarProfile.vue";
import Information from "@/components/user-profile/InformationProfile.vue";
import TitleProfile from "@/components/user-profile/TitleProfile.vue";
import DescriptionProfile from "@/components/user-profile/DescriptionProfile.vue";
import GalleryProfile from "@/components/user-profile/GalleryProfile.vue";
import RatingProfile from "@/components/user-profile/RatingProfile.vue";
import ReviewsProfile from "@/components/user-profile/ReviewsProfile.vue";
import checkAndIncrementCounter from "@/plugins/counter-views";
import SkeletonProfileTitle from "@/components/skeleton/SkeletonProfileTitle.vue";
import SkeletonProfileDescription from "@/components/skeleton/SkeletonProfileDescription.vue";
import SkeletonProfileGallery from "@/components/skeleton/SkeletonProfileGallery.vue";
import SkeletonProfileReviews from "@/components/skeleton/SkeletonProfileReviews.vue";
import SkeletonProfileAvatar from "@/components/skeleton/SkeletonProfileAvatar.vue";
import SkeletonProfileInformation from "@/components/skeleton/SkeletonProfileInformation.vue";
import SkeletonProfileRating from "@/components/skeleton/SkeletonProfileRating.vue";

watch(() => profile.user.data, (profileTitleValue) => {
  if (profileTitleValue && profileTitleValue.username) {
    let title = profileTitleValue.name ? profileTitleValue.name : profileTitleValue.username
    document.title = `Profil užívateľa ${title}`
  }
}, { immediate: true })

const route = useRoute()
const id = ref<number>(Number(route.params.id))

onMounted(() => {
  profile.useUser(id.value)
  profile.useUserGallery(id.value)
  profile.useUserReviews(id.value)
  checkAndIncrementCounter('profile', id.value)
})
</script>

<template>
  <div class="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-9/12 mx-auto">
    <div class="grid grid-cols-12 gap-0 md:gap-10 lg:gap-14">
      <div class="col-span-12 md:col-span-8 order-2 md:order-1">

        <!-- Title Panel (desktop) -->
        <transition name="fade">
          <div class="hidden md:block" v-if="!profile.user.loading">
            <title-profile/>
          </div>
          <div class="hidden md:block" v-else-if="profile.user.loading">
            <skeleton-profile-title/>
          </div>
        </transition>

        <!-- No INFO Panel -->
        <div class="hidden md:block" v-if="!profile.user.loading && !profile.user.data?.description && !profile.user.gallery.length && !profile.user.reviews.length">
          <div class="my-8 text-2xl font-light text-center">Žiadne informácie</div>
        </div>

        <!-- Description Panel -->
        <transition name="fade">
          <div class="mt-0.5 md:mt-8" v-if="!profile.user.loading && profile.user.data?.description">
            <description-profile/>
          </div>
          <div class="mt-0.5 md:mt-8" v-else-if="profile.user.loading">
            <skeleton-profile-description/>
          </div>
        </transition>

        <!-- Gallery Panel -->
        <transition name="fade">
          <div class="mt-8" v-if="!profile.user.loading_gallery && profile.user.gallery.length">
            <gallery-profile/>
          </div>
          <div class="mt-8" v-else-if="profile.user.loading_gallery">
            <skeleton-profile-gallery/>
          </div>
        </transition>

        <!-- Reviews Panel -->
        <transition name="fade">
          <div class="mt-8" v-if="!profile.user.loading_reviews && profile.user.reviews.length">
            <reviews-profile/>
          </div>
          <div class="mt-8" v-else-if="profile.user.loading_reviews">
            <skeleton-profile-reviews/>
          </div>
        </transition>

      </div>
      <div class="col-span-12 md:col-span-4 order-1 md:order-2">

        <!-- Title Panel (mobile) -->
        <transition name="fade">
          <div class="md:hidden mt-5 mb-10" v-if="!profile.user.loading">
            <title-profile/>
          </div>
          <div class="md:hidden mt-5 mb-10" v-else-if="profile.user.loading">
            <skeleton-profile-title/>
          </div>
        </transition>

        <!-- Avatar Panel -->
        <transition name="fade">
          <div v-if="!profile.user.loading">
            <avatar/>
          </div>
          <div v-else-if="profile.user.loading">
            <skeleton-profile-avatar/>
          </div>
        </transition>

        <!-- Information Panel -->
        <transition name="fade">
          <div class="mt-16" v-if="!profile.user.loading">
            <information/>
          </div>
          <div class="mt-16" v-else-if="profile.user.loading">
            <skeleton-profile-information/>
          </div>
        </transition>

        <!-- Rating Panel -->
        <transition name="fade">
          <div class="mt-0.5 md:mt-10 lg:mt-16" v-if="!profile.user.loading_reviews && profile.user.reviews.length">
            <rating-profile/>
          </div>
          <div class="mt-0.5 md:mt-10 lg:mt-16" v-else-if="profile.user.loading_reviews">
            <skeleton-profile-rating/>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>