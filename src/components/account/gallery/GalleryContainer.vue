<script setup lang="ts">
import {inject, onBeforeMount, ref} from "vue"
import {useMeta} from "vue-meta"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue"
import Panel from "@/components/Panel.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"

useMeta({ title: 'Galéria' })

const toast = useToast()
const auth = inject<Auth>('auth')
const backend = import.meta.env.VITE_BACKEND

const loading = ref<boolean>(false)
const gallery = ref<Gallery[]>(auth?.userData.value.gallery)
const previews = ref([] as any)
const selectedImg = ref([] as any)
const filesData = ref(null as (FormData | null))

const upload = ref<any>({
  loading: false as boolean,
  errors: [] as any
})
const remove = ref<any>({
  loading: false as boolean,
  errors: [] as any
})

const checkImg = (imgId: string) => {
  if (selectedImg.value.includes(imgId)){
    selectedImg.value = selectedImg.value.filter((item: any) => item !== imgId)
  } else {
    selectedImg.value.push(imgId)
  }
}
const onUpload = () => {

  upload.value.loading = true

  if (filesData.value === null) {
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Nie sú vybraté žiadne súbory.',
      group: 'br',
      life: 8000
    })
    upload.value.errors.push({ where: 'error', message: 'Nie sú vybraté žiadne súbory.' })
    return false
  }

  const formData = new FormData()

  filesData.value.forEach(file => {
    formData.append('files', file)
  })

  if (upload.value.errors.length) return false

  axios.post(`${backend}/auth/gallery/upload`, formData, { withCredentials: true })
    .then((response) => {

      if (response.data.success === true) {

        gallery.value     = response.data.images
        filesData.value   = null

        clearPreviews()

        toast.add({
          severity: 'success',
          summary: 'Úspech',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

      } else {

        upload.value.errors = response.data.errors
        toast.add({
          severity: 'error',
          summary: 'Chyba',
          detail: response.data.message,
          group: 'br',
          life: 5000
        })

      }
    })
    .catch(error =>{
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      upload.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      //createGallery()
      upload.value.loading = false
    })

}
const previewImages = (e: any) => {
  const files = e.target.files

  if (files.length > 10) {
    toast.add({ severity: 'error', summary: 'Chyba', detail: 'Môžete vybrať len 10 obrázkov.', group: 'br', life: 8000 })
    upload.value.errors.push({ where: 'error', message: 'Môžete vybrať len 10 obrázkov.' })
    return
  }

  const filesDataForm = new FormData();
  let allImagesValid = true;

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > 15 * 1024 * 1024) {
      toast.add({ severity: 'error', summary: 'Chyba', detail: 'Každý súbor musí byť menší ako 15 MB.', group: 'br', life: 8000 })
      upload.value.errors.push({ where: 'error', message: 'Každý súbor musí byť menší ako 15 MB.' })
      return
    }

    if (!files[i].type.startsWith('image/')) {
      toast.add({ severity: 'error', summary: 'Chyba', detail: 'Všetky súbory musia byť obrázky.', group: 'br', life: 8000 })
      upload.value.errors.push({ where: 'error', message: 'Všetky súbory musia byť obrázky.' })
      return
    }

    filesDataForm.append('images', files[i])
    previews.value.push(window.URL.createObjectURL(files[i]))
  }

  if(allImagesValid) {
    filesData.value = filesDataForm
  } else {
    return
  }
}
const clearPreviews = (index?: number) => {
  if (index !== undefined) {
    URL.revokeObjectURL(previews.value[index])
    previews.value.splice(index, 1)

    if (filesData.value != null) {
      let filesArray = []
      for(let pair of filesData.value.entries()) {
        filesArray.push(pair[1])
      }

      filesArray.splice(index, 1)

      let newFilesData = new FormData()
      for (let i = 0; i < filesArray.length; i++) {
        newFilesData.append('images', filesArray[i])
      }
      filesData.value = newFilesData
    }
  } else {
    previews.value.forEach(URL.revokeObjectURL)
    filesData.value = null
    previews.value = []
  }
}
const removeImg = (imageIds: any) => {

  if (!imageIds) return false

  remove.value.loading = true

  axios.post(`${backend}/auth/gallery/remove`, { imageIds }, { withCredentials: true })
    .then((response) => {

      if (response.data.success === true) {

        gallery.value         = response.data.images
        remove.value.success  = true
        selectedImg.value     = []

        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })

      } else {

        remove.value.errors = response.data.errors
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

      remove.value.loading = false

    })
}


onBeforeMount(() => {
  if (!gallery.value) {
    gallery.value = auth?.userData.value.gallery
  }
})
</script>

<template>
  <panel divide="y">
    <div class="p-2 xxs:p-2.5 xs:p-3 sm:p-4 md:p-5">
      <div class="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xxs:gap-2.5 xs:gap-3 sm:gap-4 md:gap-5">

        <div v-if="!loading" v-for="img in gallery" class="text-center relative h-36">
          <img :src="`${backend}/cloud/${img.path}`" class="rounded-lg w-full h-full object-cover" :class="{'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800': selectedImg.includes(img._id)}" alt="img" />
          <div class="absolute top-0 bottom-0 w-full flex items-start justify-between p-1" :class="{'bg-blue-500/30': selectedImg.includes(img._id)}">
            <Menu as="div" class="relative inline-block ms-auto">
              <div class="flex items-center gap-2">
                <button @click="checkImg(img._id)"
                        class="inline-flex items-center p-2 text-sm font-medium text-center rounded-lg focus:outline-none backdrop-blur shadow-lg"
                        :class="[selectedImg.includes(img._id) ? 'text-blue-50 dark:text-blue-300 bg-blue-500/75 hover:bg-blue-500 dark:bg-blue-500/40 dark:hover:bg-blue-500/60' : 'text-gray-800 dark:text-gray-400 bg-white/50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700']">
                  <i class="fa-regular fa-circle-check text-base"></i>
                </button>
                <MenuButton class="inline-flex items-center p-2 shadow-lg text-sm font-medium text-center text-gray-900 bg-white/50 rounded-lg hover:bg-gray-100 focus:outline-none dark:text-white dark:bg-gray-800/50 dark:hover:bg-gray-700 backdrop-blur">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                  </svg>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow w-32 bg-gray-700 overflow-hidden text-sm">
                  <MenuItem>
                    <button class="block px-4 py-2 text-gray-200 hover:bg-gray-600 hover:text-white w-full">Zobraziť</button>
                  </MenuItem>
                  <MenuItem>
                    <button type="button" @click="removeImg(img._id)" class="block px-4 py-2 text-gray-200 hover:bg-red-600 hover:text-white w-full">Odstrániť</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>

        <!-- Loading panel for galleries -->
        <div v-else v-for="key in 4" class="text-center relative h-36 animate-pulse" :key="key">
          <div class="flex items-center justify-center w-full h-36 bg-gray-300 rounded-lg dark:bg-gray-700">
            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
          </div>
        </div>

        <div v-for="(src, index) in previews" :key="index" class="relative h-36">
          <img :src="src" class="rounded-lg w-full h-full object-cover ring-4 ring-emerald-500" alt="img" />
          <div class="absolute top-0 right-0 m-1">
            <button type="button" @click="clearPreviews(index)" class="text-gray-900 bg-white/50 hover:bg-gray-100 focus:outline-none dark:text-white dark:bg-gray-800/50 dark:hover:bg-gray-700 backdrop-blur leading-none py-1.5 px-2 rounded-md transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div v-if="!gallery.length && !previews.length" class="col-span-full p-6 text-center">
          Zatiaľ neboli pridané žiadne obrázky do galérie.
        </div>

      </div>
    </div>
    <panel-form-actions>
      <template #left>
        <form method="post" enctype="multipart/form-data" @submit.prevent="onUpload" @change="previewImages" class="flex items-center gap-x-2">
          <label class="flex items-center gap-x-3" :class="[previews.length ? 'form-secondary-button' : 'form-button']" for="images">
            <template v-if="!previews.length"><i class="fa-solid fa-file-circle-plus fa-lg"></i> Pridať obrázky</template>
            <template v-else><i class="fa-solid fa-arrow-up-from-bracket"></i> {{ previews.length }}</template>
            <input type="file" multiple hidden id="images" name="images" accept="image/*">
          </label>
          <div v-if="previews.length">
            <button type="button" class="form-secondary-button me-2" @click="clearPreviews()">Zrušiť</button>
            <button type="submit" class="form-button">
              <template v-if="!upload.loading">Nahrať <i class="fa-solid fa-file-import ms-3 fa-lg"></i></template>
              <template v-else>Nahráva sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
            </button>
          </div>
        </form>
      </template>
      <template #right>
        <button type="button" class="form-danger-button flex items-center gap-x-4" :disabled="!selectedImg.length || remove.loading" @click="removeImg(selectedImg)">
          <template v-if="!remove.loading">Odstrániť <div class="w-5 h-4 rounded-md bg-white inline-flex items-center justify-center text-red-950 font-bold text-xs leading-none" v-text="selectedImg.length"></div></template>
          <template v-else>Odstraňuje sa <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
        </button>
      </template>
    </panel-form-actions>
  </panel>
</template>