<script setup lang="ts">
import {inject, ref} from "vue"
import PanelForm from "@/components/template/PanelForm.vue"
import InputContainer from "@/components/template/InputContainer.vue"
import InputLabel from "@/components/template/InputLabel.vue"
import SelectLabel from "@/components/template/SelectLabel.vue"
import categoriesData from "@/plugins/data/categories.json"
import PanelFormActions from "@/components/template/PanelFormActions.vue"
import {FwbCheckbox} from "flowbite-vue"

type DialogRefType = {
  data: any,
  close: (callbackData?: any) => void
}

const dialogRef   = inject('dialogRef') as { value: DialogRefType }
const query       = dialogRef.value.data.query
const sections    = ref<Sections[]>(categoriesData.sections)
const types       = ref<any>([
  { value: 'none',    name: 'Firmy & Majstri' },
  { value: 'company', name: 'Firmy' },
  { value: 'worker',  name: 'Majstri' }
])

const filterData = ref<FilterWorkersData>({
  search: query.search ?? '',
  type: query.type ?? 'none',
  section: query.section ?? 0,
  address: query.address ?? '',
  verify: query.verify ?? false,
})
const closeDialog = (callback: any) => {
  dialogRef.value.close(callback)
}
const submitForm = () => {
  closeDialog(filterData.value)
}
</script>

<template>
  <form @submit.prevent="submitForm" class="divide-y divide-gray-200 dark:divide-gray-700/40 w-full md:w-[550px]">
    <panel-form width="full">
      <InputContainer>
        <InputLabel
          type="search"
          label="Hľadať"
          label-key="title"
          placeholder="Koho hľadáte ?"
          v-model="filterData.search"
        />
        <SelectLabel
          label="Typ"
          label-key="type"
          v-model="filterData.type"
          :data="types"
        />
        <SelectLabel
          label="Sekcie"
          label-key="sections"
          v-model="filterData.section"
          placeholder="Vybrať sekciu"
          :placeholder-value="0"
          :data="sections.map(section => ({ value: section.id, name: section.title }))"
        />
        <InputLabel
          type="text"
          label="Lokalita"
          label-key="address"
          v-model="filterData.address"
          placeholder="napr. Bratislava"
        />
        <fwb-checkbox
          v-model="filterData.verify"
          label="Zobraziť iba overené účty"
        />
      </InputContainer>
    </panel-form>
    <panel-form-actions class="md:-mx-6 md:-mb-6">
      <template #left>
        <button type="reset" @click="closeDialog" class="form-secondary-button-sm">
          <i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť
        </button>
      </template>
      <template #right>
        <button type="submit" class="form-button">
          Filtrovať
        </button>
      </template>
    </panel-form-actions>
  </form>
</template>