<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import {nl2br, timeSince} from "@/plugins/functions";
import {inject, provide, ref} from "vue";
import type {Reviews} from "@/types/reviews";
import type {Auth, User} from "@/types/users";
import DeleteReview from "@/views/modals/DeleteReview.vue";
import ReportReview from "@/views/modals/ReportReview.vue";
import EditReview from "@/views/modals/EditReview.vue";
import WriteReview from "@/views/modals/WriteReview.vue";
import profile from "@/plugins/profile";
import Nickname from "@/components/app/Nickname.vue";

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)
const loggedIn = ref(auth?.loggedIn as boolean)

const reviews = ref<Reviews[]>(Object());

const showModalNewReview = ref<boolean>(false);
const showModalEditReview = ref<boolean>(false);
const showModalReportReview = ref<boolean>(false);
const showModalDeleteReview = ref<boolean>(false);

const checkAlreadyReview = () => {
  return reviews.value.some(review => review.author_id === user.value.id)
}
const writeReviewModal = () => {
  showModalNewReview.value = !showModalNewReview.value
}
const editReviewModal = () => {
  showModalEditReview.value = !showModalEditReview.value
}
const reportReviewModal = () => {
  showModalReportReview.value = !showModalReportReview.value
}
const deleteReviewModal = () => {
  showModalDeleteReview.value = !showModalDeleteReview.value
}
const openModalEditReview = () => {
  showModalEditReview.value = true;
}
const openModalReportReview = () => {
  showModalReportReview.value = true;
}
const openModalNewReview = () => {
  showModalNewReview.value = true;
}
const openModalDeleteReview = () => {
  showModalDeleteReview.value = true;
}

provide('writeReviewModal', writeReviewModal)
provide('editReviewModal', editReviewModal)
provide('reportReviewModal', reportReviewModal)
provide('deleteReviewModal', deleteReviewModal)

</script>

<template>
  <div class="flex justify-between items-end gap-3 px-4 md:px-0 mb-4">
    <div class="text-xl font-light">Recenzie</div>
    <button type="button" class="form-button-sm" v-if="loggedIn && !(user.id === Number(profile.user.data?.id)) && !checkAlreadyReview()" @click="openModalNewReview"><i class="fa-solid fa-pencil me-1"></i> Napísať recenziu</button>
  </div>
  <panel divide="y" v-if="loggedIn">
    <div v-for="review in reviews" v-if="reviews.length" class="p-4 review">
      <div class="flex items-center gap-4">
        <img :src="review.author_avatar" class="w-10 h-10 xs:w-14 xs:h-14 rounded-full shadow-lg" :alt="review.author_name ?? review.author_username">
        <div class="flex flex-col md:flex-row justify-between items-start">
          <div>
            <router-link :to="{ name: 'profile', params: { id: review.author_id } }" class="font-medium hover:text-gray-900 dark:hover:text-gray-300 transition">
              <nickname :nickname="review.author_name?.length ? review.author_name : review.author_username" :verify="review.author_verify" icon-width="4" />
            </router-link>
            <div class="flex flex-col md:flex-row gap-1 md:gap-5 md:items-center text-xs mt-0.5">
              <div>{{ timeSince(review.created_at) }}</div>
              <div>
                Hodnotenie
                <span class="text-blue-500">
                          <i v-for="x in 5" class="fa-star" :class="[ review.rating >= x ? 'fa-solid' : 'fa-regular' ]"></i>
                        </span>
              </div>
              <div v-if="review.recommendation" class="text-emerald-500 font-semibold">
                <i class="fa-regular fa-thumbs-up"></i> Odporúčam
              </div>
              <div v-else class="text-red-400 font-semibold">
                <i class="fa-regular fa-thumbs-down"></i> Neodporúčam
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-1 review_buttons ms-auto" v-if="user && ((user.id === Number(profile.user.data?.id) && !(user.id === review.author_id)) || (user.id === review.author_id))">
          <button v-tooltip.top="'Nahlásiť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalReportReview" v-if="user.id === Number(profile.user.data?.id) && !(user.id === review.author_id)">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </button>
          <button v-tooltip.top="'Upraviť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalEditReview" v-if="user.id === review.author_id">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button v-tooltip.top="'Odstrániť'" class="text-gray-600 hover:text-gray-500 transition px-2 py-1" @click="openModalDeleteReview" v-if="user.id === review.author_id">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div class="p-5 text-sm" v-html="nl2br(review.description)"></div>

      <!-- Modálne okno Upraviť recenziu -->
      <edit-review :show-modal="showModalEditReview" :key="review.id" :review-data="{ reviewId: review.id, reviewStar: review.rating, reviewRecommendation: review.recommendation, reviewDescription: review.description }" v-if="user.id === review.author_id"/>

      <!-- Modálne okno Nahlásiť recenziu -->
      <report-review :show-modal="showModalReportReview" :key="review.id" :review-id="review.id" v-if="user.id === Number(profile.user.data?.id) && !(user.id === review.author_id)"/>

      <!-- Modálne confirm okno Odstrániť recenziu -->
      <delete-review :show-modal="showModalDeleteReview" :key="review.id" :review-id="review.id" v-if="user.id === review.author_id"/>

    </div>

    <div v-else class="p-5">
      Na tento profil ešte nikto nenapísal recenziu.
    </div>

    <!-- Modálne okno Napísať recenziu -->
    <write-review :show-modal="showModalNewReview" :profile-id="Number(profile.user.data?.id)" v-if="loggedIn && !(user.id === Number(profile.user.data?.id)) && !checkAlreadyReview()"/>

  </panel>
  <panel v-else class="p-5">
    Recenzie profilu môžete vidieť až po prihlásení. <router-link :to="{ name: 'login' }" class="link">Prihlásiť sa</router-link>
  </panel>
</template>