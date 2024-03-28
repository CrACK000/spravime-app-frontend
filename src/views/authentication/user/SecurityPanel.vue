<script setup lang="ts">
import {useMeta} from "vue-meta";
import PanelGrid from "@/components/template/PanelGrid.vue";
import SecurityRemoveAccount from "@/components/account/security/SecurityRemoveAccount.vue";
import SecurityChangePassword from "@/components/account/security/SecurityChangePassword.vue";

useMeta({ title: 'Zabezpečenie' })
</script>

<template>
  <panel-grid>

    <security-change-password/>

    <security-remove-account/>

  </panel-grid>
</template>