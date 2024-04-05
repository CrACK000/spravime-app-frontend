<script setup lang="ts">
import {inject, onMounted, ref} from "vue"
import {useToast} from "primevue/usetoast"
import axios from "axios"
import {checkError, getError, validName} from "@/plugins/validation"
import categoriesData from "@/plugins/data/categories.json"
import PanelForm from "@/components/template/PanelForm.vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import Panel from "@/components/template/Panel.vue"
import InputContainer from "@/components/template/InputContainer.vue"
import InputLabel from "@/components/template/InputLabel.vue"
import SelectLabel from "@/components/template/SelectLabel.vue"
import TextareaLabel from "@/components/template/TextareaLabel.vue"

const toast = useToast()

const auth = inject<Auth>('auth')
const user = ref(auth?.userData as User)

const advancedData = ref({
  type: '' as 'company' | 'worker' | 'normal',
  address: '',
  name: '',
  sections: [],
  slogan: '',
  description: ''
})

const changed = ref<boolean>(false)
const loading = ref<boolean>(false)
const errors = ref<any>([])

const allSections = ref<Sections[]>(categoriesData.sections)

const useDefault = () => {
  errors.value = []
  changed.value = false
  advancedData.value.type = user.value.profile.type
  advancedData.value.address = user.value.profile.address ?? ''
  advancedData.value.name = user.value.profile.name ?? ''
  advancedData.value.sections = user.value.profile.sections
  advancedData.value.slogan = user.value.profile.slogan ?? ''
  advancedData.value.description = user.value.profile.description ?? ''
}
const checkForm = () => {

  errors.value = []
  changed.value = !(
    advancedData.value.type === user.value.profile.type &&
    advancedData.value.address === user.value.profile.address &&
    advancedData.value.name === user.value.profile.name &&
    advancedData.value.sections === user.value.profile.sections &&
    advancedData.value.slogan === user.value.profile.slogan &&
    advancedData.value.description === user.value.profile.description
  )

  if (advancedData.value.type !== 'normal'){
    checkError(errors.value, validName(advancedData.value.name))
  }

  return !errors.value.length

}
const updateAdvancedData = () => {

  if (!checkForm()) return false

  loading.value = true

  if (advancedData.value.type === 'normal') {
    advancedData.value.name = ''
    advancedData.value.sections = []
    advancedData.value.slogan = ''
    advancedData.value.description = ''
  }

  axios.post(`${import.meta.env.VITE_BACKEND}/auth/profile/update/advanced-data`, advancedData.value, { withCredentials: true })
    .then((response) => {

      if (response.data.success === true) {

        user.value.profile.type         = advancedData.value.type
        user.value.profile.address      = advancedData.value.address
        user.value.profile.name         = advancedData.value.name
        user.value.profile.sections     = advancedData.value.sections
        user.value.profile.slogan       = advancedData.value.slogan
        user.value.profile.description  = advancedData.value.description

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
  <form method="post" @submit.prevent="updateAdvancedData" @keyup="checkForm">
    <panel divide="y">
      <panel-form>
        <InputContainer>

          <SelectLabel
            label-key="type"
            label="Typ účtu"
            v-model="advancedData.type"
            :error="getError(errors ,'type')"
            :data="[
              { value: 'normal', name: 'Klasický' },
              { value: 'company', name: 'Firma' },
              { value: 'worker', name: 'Živnostník' }
            ]"
            @change="checkForm"
          />

          <InputLabel
            type="text"
            label="Lokalita"
            label-key="address"
            placeholder="Lokalita alebo PSČ"
            v-model="advancedData.address"
            :error="getError(errors ,'address')"
            info="Lokalita je viditeľná v profile iba pre firmy a živnostníkov."
          />

        </InputContainer>
      </panel-form>
      <panel-form v-if="advancedData.type !== 'normal'">
        <InputContainer>

          <InputLabel
            type="text"
            label="Meno"
            label-key="name"
            v-model="advancedData.name"
            :error="getError(errors ,'name')"
          />

          <InputLabel
            type="text"
            label="Slogan"
            label-key="slogan"
            v-model="advancedData.slogan"
            :error="getError(errors ,'slogan')"
          />

          <div>
            <label class="mb-1 block text-sm xs:text-base" for="sections">Sekcie</label>
            <select :class="[ getError(errors ,'sections') ? 'input-danger' : 'input', 'w-full h-44']" id="sections" v-model="advancedData.sections" @change="checkForm" multiple>
              <option v-for="section in allSections" :value="section.id">{{ section.title }}</option>
            </select>
            <div class="text-red-500 text-sm mt-2" v-if="getError(errors ,'sections')" v-text="getError(errors ,'sections')"></div>
          </div>

        </InputContainer>
      </panel-form>
      <panel-form width="full" v-if="advancedData.type !== 'normal'">
        <InputContainer>

          <TextareaLabel
            label="Popis"
            label-key="description"
            v-model="advancedData.description"
            :error="getError(errors ,'description')"
            :rows="6"
          />

        </InputContainer>
      </panel-form>
      <panel-form-actions>
        <template #left>
          Údaje vylepšeného profilu
        </template>
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