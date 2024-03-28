<script setup lang="ts">
import { nl2br } from "@/plugins/functions"
import {computed, ref} from "vue"
import user from "@/plugins/profile"
import Panel from "@/components/template/Panel.vue"
import SkeletonProfileDescription from "@/components/skeletons/SkeletonProfileDescription.vue"

const showFullText = ref(false);

const description = computed(() => (user.data.user?.profile.description || ""));

const truncatedDescription = computed(() => description.value.length > 500 ? description.value.slice(0, 500) + "..." : description.value);

const isDescriptionLong = computed(() => description.value.length > 500);

</script>

<template>

  <panel v-if="!user.data.user_loading" class="p-6">
    <div>
      <span v-html="showFullText ? nl2br(description) : nl2br(truncatedDescription)"></span>
      <button
        v-if="isDescriptionLong"
        @click="showFullText = !showFullText"
        type="button"
        class="link text-xs ms-2"
      >{{ showFullText ? 'Zobraziť menej' : 'Zobraziť všetko' }}</button>
    </div>
  </panel>

  <skeleton-profile-description v-else />

</template>