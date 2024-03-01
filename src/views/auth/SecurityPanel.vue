<template>
  <panel-grid>

    <security-change-password/>

    <security-remove-account/>

  </panel-grid>
</template>

<script setup lang="ts">
import {useMeta} from "vue-meta";
import PanelGrid from "@/components/PanelGrid.vue";
import SecurityRemoveAccount from "@/components/account/SecurityRemoveAccount.vue";
import SecurityChangePassword from "@/components/account/SecurityChangePassword.vue";

useMeta({ title: 'Zabezpečenie' })
</script>