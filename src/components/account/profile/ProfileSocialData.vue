<script setup lang="ts">
import {useToast} from "primevue/usetoast"
import {inject, onMounted, ref} from "vue"
import {checkError, getError, validURL} from "@/plugins/validation"
import axios from "axios"
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"
import InputContainer from "@/components/InputContainer.vue"
import InputLabel from "@/components/InputLabel.vue"

const toast = useToast()

const auth = inject<Auth>('auth');
const user = ref(auth?.userData as User)

const socialData = ref({ facebook: '', instagram: '', tiktok: '', linkedin: '' })

const changed = ref<boolean>(false)
const loading = ref<boolean>(false)
const errors = ref<any>([])

const useDefault = () => {

  errors.value = []
  changed.value = false
  socialData.value.facebook = <string>user.value.social.facebook
  socialData.value.instagram = <string>user.value.social.instagram
  socialData.value.tiktok = <string>user.value.social.tiktok
  socialData.value.linkedin = <string>user.value.social.linkedin

}
const checkForm = () => {

  errors.value = []
  changed.value = !(socialData.value.facebook === user.value.social.facebook && socialData.value.instagram === user.value.social.instagram && socialData.value.tiktok === user.value.social.tiktok && socialData.value.linkedin === user.value.social.linkedin)

  checkError(errors.value, validURL(socialData.value.facebook, 'facebook'))
  checkError(errors.value, validURL(socialData.value.instagram, 'instagram'))
  checkError(errors.value, validURL(socialData.value.tiktok, 'tiktok'))
  checkError(errors.value, validURL(socialData.value.linkedin, 'linkedin'))

  return !errors.value.length

}
const updateSocialData = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${process.env.VITE_BACKEND}/auth/profile/update/social-data`, socialData.value, { withCredentials: true })
    .then((response) => {

      if (response.data.success) {

        user.value.social.facebook    = socialData.value.facebook
        user.value.social.instagram   = socialData.value.instagram
        user.value.social.tiktok      = socialData.value.tiktok
        user.value.social.linkedin    = socialData.value.linkedin

        changed.value = false

        toast.add({
          severity: 'success',
          summary: 'Úspech',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

      } else {

        errors.value = response.data.errors
        toast.add({
          severity: 'error',
          summary: 'Chyba',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

      }

    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Server',
        detail: "Vyskytla sa systémová chyba. Skúste to neskôr.",
        group: 'br',
        life: 8000
      })
    })
    .finally(() => {

      loading.value = false

    })
}

onMounted(() => {
  useDefault()
})

</script>

<template>
  <form @submit.prevent="updateSocialData" @keyup="checkForm">
    <panel divide="y">
      <panel-form>
        <InputContainer>

          <InputLabel
            type="text"
            label='Facebook'
            label-key="facebook"
            placeholder="facebook.com/vasa-firma"
            v-model="socialData.facebook"
            :error="getError(errors ,'facebook')"
          />

          <InputLabel
            type="text"
            label='Instagram'
            label-key="instagram"
            placeholder="instagram.com/vasa-firma"
            v-model="socialData.instagram"
            :error="getError(errors ,'instagram')"
          />

          <InputLabel
            type="text"
            label='TikTok'
            label-key="tiktok"
            placeholder="tiktok.com/@vasa-firma"
            v-model="socialData.tiktok"
            :error="getError(errors ,'tiktok')"
          />

          <InputLabel
            type="text"
            label='Linkedin'
            label-key="linkedin"
            placeholder="linkedin.com/in/vasa-firma"
            v-model="socialData.linkedin"
            :error="getError(errors ,'linkedin')"
          />

        </InputContainer>
      </panel-form>
      <panel-form-actions>
        <template #left>Sociálne siete</template>
        <template #right>
          <button type="submit" class="form-secondary-button" v-if="changed" @click.prevent="useDefault">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="!changed || loading || errors.length">
            <template v-if="loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
            <template v-else>Uložiť</template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>