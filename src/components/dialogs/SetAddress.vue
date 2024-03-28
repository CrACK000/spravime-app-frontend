<script setup lang="ts">
import InputLabel from "@/components/template/InputLabel.vue"
import {inject, ref} from "vue"
import PanelFormActions from "@/components/template/PanelFormActions.vue";

const addressErrors         = ref<any>([])
const address_mode          = ref<string>('address')
const location              = ref<string>('')
const location_from         = ref<string>('')
const location_to           = ref<string>('')

const dialogRef = inject('dialogRef') as { value: any }

const form = ref<any>({ address: '' as string })

const closeDialog = (callback: any) => {
  dialogRef.value.close(callback)
}
const addressMode = (input: string) => {
  address_mode.value = input
  location.value = ''
  location_from.value = ''
  location_to.value = ''
}
const setAddress = () => {

  checkAddress()

  if (addressErrors.value.length) {
    return false
  }

  if (address_mode.value === 'address') {
    form.value.address = location.value
  } else if (address_mode.value === 'route'){
    form.value.address = `${location_from.value} - ${location_to.value}`
  } else {
    form.value.address = ''
  }

  closeDialog(form.value.address)
}
const checkAddress = () => {

  addressErrors.value = []

  if (address_mode.value === 'address') {
    if (!location.value.length) addressErrors.value.push({ where: 'location', message: 'Adresa musí byť vyplnená.' })
  }

  if (address_mode.value === 'route'){
    if (!location_from.value.length) addressErrors.value.push({ where: 'location_from', message: 'Adresa musí byť vyplnená.' })
    if (!location_to.value.length) addressErrors.value.push({ where: 'location_to', message: 'Adresa musí byť vyplnená.' })
  }

}
const getAddressError = (search: any) => {
  const emailError = addressErrors.value.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
</script>

<template>
  <form @submit.prevent="setAddress" class="w-full md:w-96">

    <div class="grid grid-cols-2 rounded-lg overflow-hidden m-4">
      <button type="button" @click="addressMode('address')" class="px-3 py-2.5" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'address'}">
        Miesto práce
      </button>
      <button type="button" @click="addressMode('route')" class="px-3 py-2.5" :class="{'text-blue-500 bg-blue-500/10': address_mode === 'route'}">
        Trasa
      </button>
    </div>

    <div class="p-6">
      <div v-if="address_mode === 'address'" class="p-1">

        <InputLabel
          label="Miesto práce"
          label-key="location"
          v-model="location"
          placeholder="Mesto alebo PSČ"
          :error="getAddressError('location')"
        />

      </div>
      <div v-if="address_mode === 'route'" class="p-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <InputLabel
            label="Odkiaľ"
            label-key="location_from"
            v-model="location_from"
            placeholder="Bratislava"
            :error="getAddressError('location_from')"
          />

          <InputLabel
            label="Kam"
            label-key="location_to"
            v-model="location_to"
            placeholder="Košice"
            :error="getAddressError('location_to')"
          />

        </div>
      </div>
    </div>

    <panel-form-actions class="md:-mx-6 md:-mb-6">
      <template #left>
        <button type="reset" @click="closeDialog" class="form-secondary-button-sm">
          <i class="fa-solid fa-xmark fa-lg me-1"></i> Zatvoriť
        </button>
      </template>
      <template #right>
        <button type="submit" class="form-button-sm">Nastaviť</button>
      </template>
    </panel-form-actions>

  </form>
</template>