<script setup lang="ts">

import PanelForm from "@/components/PanelForm.vue";
import PanelFormActions from "@/components/PanelFormActions.vue";
import Panel from "@/components/Panel.vue";
import {useToast} from "primevue/usetoast";
import {inject, onMounted, ref} from "vue";
import type {Auth, User} from "@/types/users";
import axios from "axios";
import {settings} from "@/plugins/config";

const toast = useToast()

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)

const socialData = ref({
  facebook: '' as string,
  instagram: '' as string,
  tiktok: '' as string,
  linkedin: '' as string,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})

const setSocialData = () => {
  socialData.value.errors = []
  socialData.value.changed = false
  socialData.value.facebook = <string>user.value.facebook
  socialData.value.instagram = <string>user.value.instagram
  socialData.value.tiktok = <string>user.value.tiktok
  socialData.value.linkedin = <string>user.value.linkedin
}
const checkSocialData = () => {
  socialData.value.errors = []
  socialData.value.changed = !(socialData.value.facebook === user.value.facebook && socialData.value.instagram === user.value.instagram && socialData.value.tiktok === user.value.tiktok && socialData.value.linkedin === user.value.linkedin)

  if (socialData.value.facebook.length) validURL(socialData.value.facebook, 'facebook')
  if (socialData.value.instagram.length) validURL(socialData.value.instagram, 'instagram')
  if (socialData.value.tiktok.length) validURL(socialData.value.tiktok, 'tiktok')
  if (socialData.value.linkedin.length) validURL(socialData.value.linkedin, 'linkedin')
}
const updateSocialData = () => {
  socialData.value.loading = true

  if (socialData.value.errors.length) return false

  const SocialData = ref({
    facebook: socialData.value.facebook,
    instagram: socialData.value.instagram,
    tiktok: socialData.value.tiktok,
    linkedin: socialData.value.linkedin,
  })

  axios.post(`${settings.backend}/api/profile/update/social-data`, SocialData.value, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: 'Sociálne siete boli aktualizované.', group: 'br', life: 5000 })
        socialData.value.success = true
        socialData.value.changed = false
        user.value.facebook = socialData.value.facebook
        user.value.instagram = socialData.value.instagram
        user.value.tiktok = socialData.value.tiktok
        user.value.linkedin = socialData.value.linkedin
      } else {
        socialData.value.errors = response.data.errors
        socialData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      socialData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      socialData.value.loading = false
      console.log('finally')
    })
}
const getErrorSocialData = (search: any) => {
  const emailError = socialData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const validURL = (url: string, where: string) => {
  const urlRegex = /^(https?:\/\/)?(www\.)?[\w\.-]+\.[\w\.-]+\/[\w\@:%_\+.~#?&\/\/=\\-]+\/?$/
  if (urlRegex.test(url)) {
    return true
  } else {
    socialData.value.errors.push({where: where, message: 'Nesprávny formát URL.'})
  }
}

onMounted(() => {
  setSocialData()
})

</script>

<template>
  <form @submit.prevent="updateSocialData" @keyup="checkSocialData">
    <panel divide="y">
      <panel-form>
        <div class="flex flex-col gap-6">
          <div>
            <label class="mb-1 block" for="facebook">Facebook</label>
            <input type="text" :class="[ getErrorSocialData('facebook') ? 'input-danger' : 'input', 'w-full']" id="facebook" v-model="socialData.facebook" placeholder="facebook.com/vasa-firma">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('facebook')" v-text="getErrorSocialData('facebook')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="instagram">Instagram</label>
            <input type="text" :class="[ getErrorSocialData('instagram') ? 'input-danger' : 'input', 'w-full']" id="instagram" v-model="socialData.instagram" placeholder="instagram.com/vasa-firma">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('instagram')" v-text="getErrorSocialData('instagram')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="tiktok">TikTok</label>
            <input type="text" :class="[ getErrorSocialData('tiktok') ? 'input-danger' : 'input', 'w-full']" id="tiktok" v-model="socialData.tiktok" placeholder="tiktok.com/@vasa-firma">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('tiktok')" v-text="getErrorSocialData('tiktok')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="linkedin">Linkedin</label>
            <input type="text" :class="[ getErrorSocialData('linkedin') ? 'input-danger' : 'input', 'w-full']" id="linkedin" v-model="socialData.linkedin" placeholder="linkedin.com/in/vasa-firma">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('linkedin')" v-text="getErrorSocialData('linkedin')"></div>
          </div>
        </div>
      </panel-form>
      <panel-form-actions>
        <template #left>Sociálne siete</template>
        <template #right>
          <button type="submit" class="form-secondary-button" v-if="socialData.changed" @click.prevent="setSocialData">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="!socialData.changed || socialData.loading || socialData.errors.length">
            <template v-if="socialData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
            <template v-else>Uložiť</template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>

<style scoped>

</style>