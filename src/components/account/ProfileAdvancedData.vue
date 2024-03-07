<script setup lang="ts">
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import Panel from "@/components/Panel.vue"
import {useToast} from "primevue/usetoast"
import {inject, onMounted, ref} from "vue"
import categoriesData from "@/plugins/data/categories.json"
import skZipcodes from "@/plugins/zipcodes/sk.json"
import axios from "axios"

const toast = useToast()

const auth = inject<Auth>('auth');
const user = ref(auth?.userData as User)

const advancedData = ref({
  type: '' as 'company' | 'worker' | 'normal',
  address: '' as string,
  name: '' as string,
  sections: [] as any,
  slogan: '' as string,
  description: '' as string,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})

const allSections = ref<Sections[]>(categoriesData.sections)
const slovakData = ref<Zipcodes[]>(skZipcodes)

const setAdvancedData = () => {
  advancedData.value.errors = []
  advancedData.value.changed = false
  advancedData.value.type = user.value.profile.type
  advancedData.value.address = user.value.profile.address ?? ''
  advancedData.value.name = user.value.profile.name ?? ''
  advancedData.value.sections = user.value.profile.sections
  advancedData.value.slogan = user.value.profile.slogan ?? ''
  advancedData.value.description = user.value.profile.description ?? ''
}
const checkAdvancedData = () => {
  advancedData.value.errors = []
  advancedData.value.changed = !(
    advancedData.value.type === user.value.profile.type &&
    advancedData.value.address === user.value.profile.address &&
    advancedData.value.name === user.value.profile.name &&
    advancedData.value.sections === user.value.profile.sections &&
    advancedData.value.slogan === user.value.profile.slogan &&
    advancedData.value.description === user.value.profile.description
  )

  if (advancedData.value.type !== 'normal'){
    validName(advancedData.value.name)
  }
}
const getErrorAdvancedData = (search: any) => {
  const emailError = advancedData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const updateAdvancedData = () => {
  advancedData.value.loading = true

  if (advancedData.value.errors.length) return false

  const AdvancedData = advancedData.value

  if (AdvancedData.type === 'normal') {
    AdvancedData.name = ''
    AdvancedData.sections = []
    AdvancedData.slogan = ''
    AdvancedData.description = ''
  }

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/profile/update/advanced-data`, AdvancedData, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
        advancedData.value.success = true
        advancedData.value.changed = false
        user.value.profile.type = advancedData.value.type
        user.value.profile.address = advancedData.value.address
        user.value.profile.name = advancedData.value.name
        user.value.profile.sections = advancedData.value.sections
        user.value.profile.slogan = advancedData.value.slogan
        user.value.profile.description = advancedData.value.description
      } else {
        advancedData.value.errors = response.data.errors
        advancedData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      advancedData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      advancedData.value.loading = false
      console.log('finally')
    })
}
const validName = (name: string) => {
  if (name) {
    if (name.length >= 3){
      if (name.length <= 50){
        return true
      } else {
        advancedData.value.errors.push({ where: 'name', message: 'Meno je príliš dlhé.' })
      }
    } else {
      advancedData.value.errors.push({ where: 'name', message: 'Meno je príliš krátke.' })
    }
  } else {
    advancedData.value.errors.push({ where: 'name', message: 'Meno musí byť vyplnené.' })
  }
}

onMounted(() => {
  setAdvancedData()
})

</script>

<template>
  <form method="post" @submit.prevent="updateAdvancedData" @keyup="checkAdvancedData">
    <panel divide="y">
      <panel-form>
        <div class="flex flex-col gap-6">
          <div>
            <label class="mb-2 block" for="type">Typ účtu</label>
            <select :class="[ getErrorAdvancedData('type') ? 'input-danger' : 'input']" id="type" v-model="advancedData.type" @change="checkAdvancedData">
              <option value="normal">Klasický</option>
              <option value="company">Firma</option>
              <option value="worker">Živnostník</option>
            </select>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('type')" v-text="getErrorAdvancedData('type')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="address">Lokalita</label>
            <input type="text" list="addressData" :class="[ getErrorAdvancedData('address') ? 'input-danger' : 'input', 'w-full']" id="address" v-model="advancedData.address" placeholder="Lokalita alebo PSČ">
            <div class="text-sm mt-2 flex items-center gap-1.5">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.6-8.5h0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              Lokalita je viditeľná v profile iba pre firmy a živnostníkov.
            </div>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('address')" v-text="getErrorAdvancedData('address') + 'asd'"></div>
            <datalist id="addressData">
              <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
            </datalist>
          </div>
        </div>
      </panel-form>
      <panel-form v-if="advancedData.type !== 'normal'">
        <div class="flex flex-col gap-6">
          <div>
            <label class="mb-1 block" for="name">Meno</label>
            <input type="text" :class="[ getErrorAdvancedData('name') ? 'input-danger' : 'input', 'w-full']" id="name" v-model="advancedData.name">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('name')" v-text="getErrorAdvancedData('name')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="slogan">Slogan</label>
            <input type="text" :class="[ getErrorAdvancedData('slogan') ? 'input-danger' : 'input', 'w-full']" id="slogan" v-model="advancedData.slogan">
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('slogan')" v-text="getErrorAdvancedData('slogan')"></div>
          </div>
          <div>
            <label class="mb-1 block" for="sections">Sekcie</label>
            <select :class="[ getErrorAdvancedData('sections') ? 'input-danger' : 'input', 'w-full h-56']" id="sections" v-model="advancedData.sections" multiple>
              <option v-for="section in allSections" :value="section.id">{{ section.title }}</option>
            </select>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('sections')" v-text="getErrorAdvancedData('sections')"></div>
          </div>
        </div>
      </panel-form>
      <panel-form width="full" v-if="advancedData.type !== 'normal'">
        <div>
          <label class="mb-1 block" for="description">Popis</label>
          <textarea :class="[ getErrorAdvancedData('description') ? 'input-danger' : 'input', 'w-full']" rows="6" id="description" v-model="advancedData.description"></textarea>
          <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('description')" v-text="getErrorAdvancedData('description')"></div>
        </div>
      </panel-form>
      <panel-form-actions>
        <template #left>
          Údaje vylepšeného profilu
        </template>
        <template #right>
          <button type="submit" class="form-secondary-button" v-if="advancedData.changed" @click.prevent="setAdvancedData">
            Zrušiť
          </button>
          <button type="submit" class="form-button" :disabled="!advancedData.changed || advancedData.loading || advancedData.errors.length">
            <template v-if="advancedData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
            <template v-else>Uložiť</template>
          </button>
        </template>
      </panel-form-actions>
    </panel>
  </form>
</template>

<style scoped>

</style>