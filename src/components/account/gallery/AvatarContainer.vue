<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import {useMeta} from "vue-meta"
import axios from "axios"
import { useToast } from "primevue/usetoast"
import Panel from "@/components/template/Panel.vue"
import PanelForm from "@/components/template/PanelForm.vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import Avatar from "@/components/app/Avatar.vue"

useMeta({ title: 'Vzhľad profilu' })

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)
const toast = useToast()

const imagePreview = ref<string | undefined>('')
const inputText = ref<string>('')
const changed = ref<boolean>(false)
const loading = ref<boolean>(false)
const success = ref<boolean>(false)
const errors = ref<any>([])

const setData = () => {

  errors.value = []
  changed.value = false
  inputText.value = ''

  if (user.value.avatar) {
    imagePreview.value = `${import.meta.env.VITE_BACKEND}/cloud/${user.value.avatar}`
  } else {
    imagePreview.value = user.value.avatar
  }

}
const createImage = (file: any) => {

  let reader = new FileReader()

  reader.onload = (e:any) => {

    if (e.target && e.target.result) {

      let img = new Image()

      img.onload = () => {
        if (img.width > 800 || img.height > 800) {

          toast.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Obrázok je príliš veľký! Maximálne rozmery sú 800x800px.',
            group: 'br',
            life: 8000
          })

          errors.value.push({ where: 'error', message: 'Obrázok je príliš veľký! Maximálne rozmery sú 800x800px.' })
          changed.value = false
          inputText.value = ''

        } else {
          imagePreview.value = e.target.result
        }
      }

      img.onerror = () => {

        toast.add({
          severity: 'error',
          summary: 'Chyba',
          detail: 'Došlo k chybe pri validácii rozmerov obrázka.',
          group: 'br',
          life: 8000
        })

        errors.value.push({ where: 'error', message: 'Došlo k chybe pri validácii rozmerov obrázka.' })
        changed.value = false
        inputText.value = ''

      }
      if(e.target.result) {
        img.src = e.target.result
      }
    }
  }
  reader.readAsDataURL(file)
  inputText.value = file.name
}
const onFileChange = (e: any) => {

  errors.value = []
  changed.value = true

  let files = e.target.files || e.dataTransfer.files

  if (!files.length) return

  let file = files[0]

  const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif']

  if (!validImageTypes.includes(file.type)) {

    changed.value = false

    toast.add({
      severity: 'warn',
      summary: 'Chyba',
      detail: 'Neplatný typ súboru! Súbor musí byť obrázok typu SVG, PNG, JPG alebo GIF.',
      group: 'br',
      life: 8000
    })

    return errors.value.push({ where: 'error', message: 'Neplatný typ súboru! Súbor musí byť obrázok typu SVG, PNG, JPG alebo GIF.' })

  }

  if (file.size > 10 * 1024 * 1024) {

    changed.value = false

    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Súbor je príliš veľký! Veľkosť súboru musí byť menej ako 10 MB.',
      group: 'br',
      life: 8000
    })

    return errors.value.push({ where: 'error', message: 'Súbor je príliš veľký! Veľkosť súboru musí byť menej ako 10 MB.' })

  }

  createImage(file)

}
const upload = () => {
  loading.value = true

  if (errors.value.length) return false

  const fileInput = document.getElementById('avatar') as HTMLInputElement;

  if (!fileInput || !fileInput.files || !fileInput.files.length){
    return false
  }

  const FileData = new FormData()

  FileData.append('avatar', fileInput.files[0])

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/avatar/update`, FileData, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
        success.value = true
        changed.value = false
        user.value.avatar = response.data.newAvatar
        inputText.value = ''
      } else {
        errors.value = response.data.errors
        errors.value.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 5000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 5000 })
      errors.value.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      loading.value = false
      console.log('finally')
    })
}

onMounted(() => {
  if (user.value.avatar) {
    imagePreview.value = `${import.meta.env.VITE_BACKEND}/cloud/${user.value.avatar}`
  } else {
    imagePreview.value = user.value.avatar
  }
})

</script>

<template>

    <form method="post" enctype="multipart/form-data" @submit.prevent="upload">
      <panel divide="y">
        <panel-form>
          <div class="mb-2 text-sm">Profilový obrázok</div>
          <Avatar class="inline-block" :img="imagePreview" :alt="user.username" :prefix="false" resolution="250x250" size="xxl" rounded="xxl" />
          <div class="mt-6">
            <label for="avatar" class="form-secondary-button cursor-pointer truncate">
              <i class="fa-regular fa-file-image fa-lg me-2 opacity-75"></i>
              <template v-if="inputText.length">{{ inputText }}</template>
              <template v-else>Nahrať nový</template>
            </label>
            <ul class="mt-4 text-sm opacity-75">
              <li>Povolené obrázky SVG, PNG, JPG alebo GIF. (Max 10MB)</li>
              <li>Maximálne rozlíšenie 800x800</li>
            </ul>
            <input type="file" id="avatar" @change="onFileChange" hidden>
          </div>
        </panel-form>
        <panel-form-actions>
          <template #left>
            Profilový obrázok
          </template>
          <template #right>
            <button type="button" class="form-secondary-button" v-if="changed" @click.prevent="setData">
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