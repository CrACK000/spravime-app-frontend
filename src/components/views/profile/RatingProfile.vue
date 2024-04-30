<script setup lang="ts">
import {ref, watch} from "vue"
import user from "@/plugins/profile"
import Panel from "@/components/template/Panel.vue"
import AverageRating from "@/components/app/AverageRating.vue"
import SkeletonProfileRating from "@/components/skeletons/SkeletonProfileRating.vue";
import {useRoute} from "vue-router";

const route = useRoute()
const reviews = ref<Review[]>(user.data.reviews)
const loading = ref<boolean>(user.data.reviews_loading)

watch(() => route.params.userId, async (newId, oldId) => {
  await user.profileReviews(String(newId ?? oldId))
  reviews.value = user.data.reviews
  loading.value = user.data.reviews_loading
}, { immediate: true })
</script>

<template>

  <panel v-if="!loading" divide="y">
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Priemer hodnotenia</div>
      <div class="text-xl w-20 font-bold text-center">
        <average-rating :rating="Number(user.data.user?.reviews.average_rating)"/>
      </div>
    </div>
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Recenzie od užívateľov</div>
      <div class="text-xl w-20 font-bold text-center">
        {{ user.data.user?.reviews.count_reviews }}
      </div>
    </div>
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Odporúčajú</div>
      <div class="text-xl w-20 font-bold text-center text-emerald-500">
        {{ reviews.filter(review => Boolean(review.recommendation)).length }}
      </div>
    </div>
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Neodporúčajú</div>
      <div class="text-xl w-20 font-bold text-center text-red-500">
        {{ reviews.filter(review => !Boolean(review.recommendation)).length }}
      </div>
    </div>
  </panel>

  <skeleton-profile-rating v-else />

</template>