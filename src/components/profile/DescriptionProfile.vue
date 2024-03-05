<script setup lang="ts">
import Panel from "@/components/Panel.vue";
import { nl2br } from "@/plugins/functions";
import profile from "@/plugins/profile";
import {computed, ref} from "vue";

const showFullText = ref(false);

const description = computed(() => (profile.user.data?.description || ""));

const truncatedDescription = computed(() => description.value.length > 500 ? description.value.slice(0, 500) + "..." : description.value);

const isDescriptionLong = computed(() => description.value.length > 500);

</script>

<template>
  <panel class="p-6">
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
</template>