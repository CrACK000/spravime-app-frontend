<script setup lang="ts">
import {useMeta} from "vue-meta"
import PanelGrid from "@/components/PanelGrid.vue"
import ProfileLoginData from "@/components/account/ProfileLoginData.vue"
import ProfileAdvancedData from "@/components/account/ProfileAdvancedData.vue"
import ProfileSocialData from "@/components/account/ProfileSocialData.vue"

useMeta({ title: 'Upraviť profil' })
</script>

<template>
  <panel-grid>
    <profile-login-data/>
    <profile-advanced-data/>
    <profile-social-data/>
  </panel-grid>
</template>