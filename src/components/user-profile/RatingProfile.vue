<script setup lang="ts">
import profile from "@/plugins/profile";
import Panel from "@/components/Panel.vue";
import {ref} from "vue";
import type {Reviews} from "@/types/reviews";
import AverageRating from "@/components/AverageRating.vue";

const reviews = ref<Reviews[]>(Object(profile.user.reviews));

</script>

<template>
  <panel divide="y">
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Priemer hodnotenia</div>
      <div class="text-xl w-20 font-bold text-center">
        <average-rating :rating="Number(profile.user.data?.average_rating)"/>
      </div>
    </div>
    <div class="flex justify-between items-center py-3.5 px-5">
      <div class="w-full">Recenzie od užívateľov</div>
      <div class="text-xl w-20 font-bold text-center">
        {{ profile.user.data?.count_reviews }}
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
      <div class="text-xl w-20 font-bold text-center text-red-400">
        {{ reviews.filter(review => !Boolean(review.recommendation)).length }}
      </div>
    </div>
  </panel>
</template>