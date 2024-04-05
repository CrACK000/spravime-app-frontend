<script setup lang="ts">
import {ref, inject, onBeforeUpdate} from 'vue'
import {useMeta} from "vue-meta"
import axios from "axios"
import router from "@/router"
import {useDialog} from "primevue/usedialog"
import {useToast} from "primevue/usetoast"
import {  getError, validTitle, checkError,
          validSection, validCategory, validAddress,
          validDescription, validRules, validStartAt, validEndAt } from "@/plugins/validation"
import Panel from "@/components/template/Panel.vue"
import PanelForm from "@/components/template/PanelForm.vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import categoriesData from "@/plugins/data/categories.json"
import InputContainer from "@/components/template/InputContainer.vue"
import InputLabel from "@/components/template/InputLabel.vue"
import SelectLabel from "@/components/template/SelectLabel.vue"
import TextareaLabel from "@/components/template/TextareaLabel.vue"
import SetAddress from "@/components/dialogs/SetAddress.vue"
import AccountPanelHead from "@/components/template/AccountPanelHead.vue";
import {onBeforeRouteLeave} from "vue-router";
import {useConfirm} from "primevue/useconfirm";
import ProductManagementDialog from "@/components/dialogs/ProductManagementDialog.vue";

const auth      = inject<Auth>('auth')
const user      = ref(auth?.userData as User)
const loggedIn  = ref(auth?.loggedIn as boolean)
const dialog    = useDialog()
const confirm   = useConfirm()
const toast     = useToast()

useMeta({ title: 'Vytvoriť ponuku' })

const loading   = ref<boolean>(false)
const errors    = ref<any>([])
const form      = ref<any>({
  title: '' as string,
  section: 0 as number,
  category: 0 as number,
  description: '' as string,
})
const products  = ref<Product[]>([])

const sections    = ref<Sections[]>(categoriesData.sections)
const categories  = ref<Categories[]>(categoriesData.categories)

const submitForm = () => {

  if (!checkForm()) return false

  loading.value = true

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/offers/create`, form.value, { withCredentials: true })
    .then(response => {
      if (response.data.success) {
        toast.add({
          severity: 'success',
          summary: 'Ponuka',
          detail: response.data.message,
          group: 'br',
          life: 4000
        })
        router.push({ name: 'offer', params: { offerId: response.data.last_id } })
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
    .catch(error => {
      console.error('[CreateOfferError]', error)
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
const checkForm = () => {

  errors.value = []

  checkError(errors.value, validTitle(form.value.title))
  checkError(errors.value, validSection(form.value.section))
  checkError(errors.value, validCategory(form.value.category))
  checkError(errors.value, validAddress(form.value.address))
  checkError(errors.value, validDescription(form.value.description))
  checkError(errors.value, validRules(form.value.rules))

  if (form.value.time_range) {
    checkError(errors.value, validStartAt(form.value.start_at))
    checkError(errors.value, validEndAt(form.value.end_at))
  }

  return !errors.value.length

}
const clearError = (where: string) => {
  return errors.value = errors.value.filter((error: any) => error.where !== where)
}

const addProduct = () => {
  dialog.open(ProductManagementDialog, {
    props: {
      header: 'Pridať produkt',
      contentClass: 'p-0 md:p-6',
      modal: true,
    },
    data: {
      productData: null
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          console.log(opt.data)
          products.value.push(opt.data)
        }
      }
    }
  })
}
const editProduct = (key: number) => {
  dialog.open(ProductManagementDialog, {
    props: {
      header: 'Upraviť produkt',
      contentClass: 'p-0 md:p-6',
      modal: true,
    },
    data: {
      productData: products.value[key]
    },
    onClose: (opt: any) => {
      if (opt.data) {
        if (!opt.data.cancelable) {
          products.value[key] = opt.data
        }
      }
    }
  })
}
const removeProduct = (key: number) => {
  products.value.splice(key, 1)
}

onBeforeRouteLeave((to, from, next) => {
  if (products.value.length) {
    confirm.require({
      header: 'Opustiť stránku',
      message: 'Naozaj chcete opustiť stránku? Všetky data budu stratené a nebudete sa k nim môcť vrátiť.',
      icon: 'fa-solid fa-triangle-exclamation',
      rejectIcon: 'fa-regular fa-circle-xmark',
      acceptIcon: 'fa-solid fa-arrow-right-from-bracket',
      rejectClass: 'form-secondary-button-sm',
      acceptClass: 'form-button-sm',
      acceptLabel: 'Opustiť',
      rejectLabel: 'Zrušiť',
      accept: () => {
        next()
      },
      reject: () => {
        //
      }
    })
  } else {
    next()
  }
})
</script>

<template>
  <div>

    <AccountPanelHead>
      Vytvoriť novú ponuku
    </AccountPanelHead>

    <form @submit.prevent="submitForm" v-if="loggedIn">
      <panel divide="y">

        <panel-form>
          <InputContainer>
            <InputLabel
              type="text"
              label="Názov ponuky"
              label-key="title"
              placeholder="Ponuka na..."
              v-model="form.title"
              @change="clearError('title')"
              :error="getError(errors, 'title')"
              info="Príklad „Ponuka na výrobu železných konštrukcii”"
            />
            <SelectLabel
              label="Sekcia"
              label-key="section"
              v-model="form.section"
              @change="clearError('section')"
              :error="getError(errors, 'section')"
              class-text="w-full"
            >
              <template #data>
                <option :value="0" class="text-gray-500">Vyberte sekciu</option>
                <option v-for="section in sections" :value="section.id">{{ section.title }}</option>
              </template>
            </SelectLabel>
            <SelectLabel
              label="Kategórie"
              label-key="category"
              v-model="form.category"
              @change="clearError('category')"
              :error="getError(errors, 'category')"
              class-text="w-full"
              info="Výber kategórie pod ktorú spadá požiadavka."
            >
              <template #data>
                <option :value="0" class="text-gray-500">Vyberte kategóriu</option>
                <template v-for="category in categories">
                  <option v-if="Number(form.section) === category.section_id" :value="category.id">{{ category.title }}</option>
                </template>
              </template>
            </SelectLabel>
          </InputContainer>
        </panel-form>

        <panel-form width="full">
          <div class="mb-6 md:px-4 flex items-center justify-between">
            <div class="text-lg">Produkty</div>
            <div v-if="products.length < 6">
              <button v-if="user.verify" type="button" @click="addProduct" class="form-button-sm">Pridať produkt</button>
            </div>
            <div v-else class="text-sm">
              Maximálny počet produktov
            </div>
          </div>

          <div v-if="!user.verify" class="bg-blue-500/10 border border-blue-600 rounded-xl p-4 text-blue-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Pridávanie produktov do ponuky je iba pre členov <b>Plus+</b>.</span>
            <router-link :to="{ name: 'user-plus' }" class="form-button-sm ms-auto">Aktivovať Plus+</router-link>
          </div>

          <div v-if="user.verify" class="grid grid-cols-3 gap-6">
            <div v-for="(product, key) in products" class="p-4 bg-white dark:bg-gray-800 shadow-lg shadow-black/10 rounded-3xl">
              <div class="aspect-[4/3] mb-4 relative rounded-2xl overflow-hidden flex items-center justify-center">
                <img :src="product.image" alt="Produkt 1">
                <div class="absolute top-2 left-2 bg-blue-500 text-white px-1.5 py-1 rounded-lg shadow-lg">{{ product.price }}€</div>
                <div class="absolute top-2 right-2">
                  <div class="flex items-center gap-x-1">
                    <button type="button" @click="editProduct(key)" class="bg-blue-500 text-white p-1 rounded-lg shadow-lg">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                      </svg>
                    </button>
                    <button type="button" @click="removeProduct(key)" class="bg-red-500 text-white p-1 rounded-lg shadow-lg">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="mb-1">
                {{ product.title }}
              </div>
              <div class="text-xs line-clamp-3 opacity-75">
                {{ product.description }}
              </div>
            </div>
            <div v-if="!products.length" class="col-span-3 text-center">
              Zatiaľ neboli pridané žiadne produkty
            </div>
          </div>
        </panel-form>

        <panel-form width="full">
          <TextareaLabel
            label="Informácie o ponuke"
            label-key="description"
            :rows="10"
            counter
            :max-count="5000"
            v-model="form.description"
            @change="clearError('description')"
            :error="getError(errors, 'description')"
          />
        </panel-form>

        <panel-form-actions>
          <template #left></template>
          <template #right>
            <button type="submit" class="form-button" :disabled="loading">
              <template v-if="!loading">Vytvoriť</template>
              <template v-else>Overovanie <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin ms-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg></template>
            </button>
          </template>
        </panel-form-actions>

      </panel>
    </form>

  </div>
</template>