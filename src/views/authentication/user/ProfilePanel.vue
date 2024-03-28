<script setup lang="ts">
import {useMeta} from "vue-meta"
import PanelGrid from "@/components/template/PanelGrid.vue"
import ProfileLoginData from "@/components/account/profile/ProfileLoginData.vue"
import ProfileAdvancedData from "@/components/account/profile/ProfileAdvancedData.vue"
import ProfileSocialData from "@/components/account/profile/ProfileSocialData.vue"

useMeta({ title: 'Upraviť profil' })
</script>

<template>
  <panel-grid>
    <profile-login-data/>
    <profile-advanced-data/>
    <profile-social-data/>
  </panel-grid>
</template>